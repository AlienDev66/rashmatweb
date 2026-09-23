import type { StudioProgram } from "./database";
import { isSupabaseConfigured, supabase } from "./supabase";

const PLACEHOLDER_COVER =
  "https://images.unsplash.com/photo-1555597673-b21d5c935865";

export type PublishCheck = {
  id: string;
  label: string;
  ok: boolean;
  hint?: string;
};

export type PublishReadiness = {
  ready: boolean;
  checks: PublishCheck[];
};

function hasRealCover(url: string | null | undefined) {
  if (!url?.trim()) return false;
  if (url.includes(PLACEHOLDER_COVER)) return false;
  return true;
}

function hasVideo(opts: { mux?: string | null; url?: string | null }) {
  return Boolean(opts.mux?.trim() || opts.url?.trim());
}

/** Client-side gate before publishing a program. */
export async function getPublishReadiness(program: StudioProgram): Promise<PublishReadiness> {
  if (!isSupabaseConfigured) {
    return {
      ready: false,
      checks: [
        {
          id: "supabase",
          label: "Supabase configured",
          ok: false,
          hint: "Add web/.env keys.",
        },
      ],
    };
  }

  const { data: sessions, error: sErr } = await supabase
    .from("workout_sessions")
    .select("id, mux_playback_id, video_url")
    .eq("program_id", program.id);

  if (sErr) {
    return {
      ready: false,
      checks: [
        {
          id: "sessions",
          label: "At least 1 session",
          ok: false,
          hint: sErr.message,
        },
      ],
    };
  }

  const sessionRows = sessions ?? [];
  let drillsWithVideo = 0;
  let totalDrills = 0;
  let sessionsWithVideo = 0;

  for (const s of sessionRows) {
    if (hasVideo({ mux: s.mux_playback_id, url: s.video_url })) {
      sessionsWithVideo += 1;
    }

    const { data: exercises } = await supabase
      .from("exercises")
      .select("id, mux_playback_id, video_url")
      .eq("session_id", s.id);

    const list = exercises ?? [];
    totalDrills += list.length;
    for (const ex of list) {
      if (hasVideo({ mux: ex.mux_playback_id, url: ex.video_url })) drillsWithVideo += 1;
    }
  }

  const allDrillsHaveVideo = totalDrills > 0 && drillsWithVideo === totalDrills;
  const allSessionsHaveVideo =
    sessionRows.length > 0 && sessionsWithVideo === sessionRows.length;

  const checks: PublishCheck[] = [
    {
      id: "cover",
      label: "Custom program cover",
      ok: hasRealCover(program.cover_url),
      hint: "Upload a mat/training cover (not the default placeholder).",
    },
    {
      id: "sessions",
      label: "At least 1 session",
      ok: sessionRows.length >= 1,
      hint: "Add a day in the CMS or use Auto-fill schedule.",
    },
    {
      id: "drills",
      label: "At least 1 drill",
      ok: totalDrills >= 1,
      hint: "Add drills to a session (or quick-add starter block).",
    },
    {
      id: "session_videos",
      label: "Every session has a video",
      ok: allSessionsHaveVideo,
      hint: "Upload an MP4 to Storage for each session (or add Mux later).",
    },
    {
      id: "drill_videos",
      label: "Every drill has a video",
      ok: allDrillsHaveVideo,
      hint: "Upload an MP4 for each drill before publishing.",
    },
  ];

  return {
    ready: checks.every((c) => c.ok),
    checks,
  };
}
