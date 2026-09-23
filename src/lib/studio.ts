import type {
  StudentProgressRow,
  StudioExercise,
  StudioProgram,
  StudioSession,
} from "./database";
import { isSupabaseConfigured, supabase } from "./supabase";
import {
  buildSessionPlan,
  PROGRAM_TEMPLATES,
  type DrillPreset,
  type ProgramTemplate,
} from "./templates";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200&q=80";

export async function activateCreator(slug?: string) {
  if (!isSupabaseConfigured) return { error: "Supabase not configured", profile: null };
  const { data, error } = await supabase.rpc("activate_creator", {
    p_slug: slug ?? null,
  });
  if (error) return { error: error.message, profile: null };
  return { error: null, profile: data };
}

export async function fetchProfile(userId: string) {
  if (!isSupabaseConfigured) return { error: null, profile: null };
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, is_creator, creator_slug")
    .eq("id", userId)
    .maybeSingle();
  if (error) return { error: error.message, profile: null };
  return { error: null, profile: data };
}

export async function fetchMyPrograms(userId: string) {
  if (!isSupabaseConfigured) return { error: null, programs: [] as StudioProgram[] };
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("creator_user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return { error: error.message, programs: [] as StudioProgram[] };
  return { error: null, programs: (data ?? []) as StudioProgram[] };
}

export async function fetchProgram(programId: string) {
  if (!isSupabaseConfigured) return { error: null, program: null as StudioProgram | null };
  const { data, error } = await supabase.from("programs").select("*").eq("id", programId).maybeSingle();
  if (error) return { error: error.message, program: null };
  return { error: null, program: data as StudioProgram | null };
}

export type CreateProgramInput = {
  userId: string;
  creatorSlug: string;
  title: string;
  description?: string;
  coverUrl?: string;
  level?: string;
  weeks?: number;
  daysPerWeek?: number;
  minutes?: number;
  tags?: string[];
  isPremium?: boolean;
  templateId?: string;
  /** When true (default), auto-create full week×day schedule + template drills */
  autoSchedule?: boolean;
  seedDrills?: boolean;
};

export async function createProgram(opts: CreateProgramInput) {
  if (!isSupabaseConfigured) return { error: "Supabase not configured", program: null };

  const template: ProgramTemplate =
    PROGRAM_TEMPLATES.find((t) => t.id === opts.templateId) ?? PROGRAM_TEMPLATES[0];

  const weeks = opts.weeks ?? template.weeks;
  const daysPerWeek = opts.daysPerWeek ?? template.daysPerWeek;
  const minutes = opts.minutes ?? template.minutes;
  const level = opts.level ?? template.level;
  const tags = opts.tags?.length ? opts.tags : template.tags;
  const autoSchedule = opts.autoSchedule !== false;
  const seedDrills = opts.seedDrills !== false && template.id !== "blank";

  const id = `${slugify(opts.title) || "program"}-${Date.now().toString(36)}`;
  const { data, error } = await supabase
    .from("programs")
    .insert({
      id,
      creator_id: opts.creatorSlug,
      creator_user_id: opts.userId,
      title: opts.title.trim(),
      description: opts.description ?? "",
      cover_url: opts.coverUrl ?? DEFAULT_COVER,
      weeks,
      days_per_week: daysPerWeek,
      minutes,
      level,
      tags,
      status: "draft",
      is_premium: opts.isPremium ?? false,
    })
    .select("*")
    .single();

  if (error) return { error: error.message, program: null };
  const program = data as StudioProgram;

  if (autoSchedule) {
    const plan = buildSessionPlan(template, weeks, daysPerWeek);
    for (const item of plan) {
      const { session } = await createSession({
        programId: program.id,
        title: item.title,
        day: item.day,
        minutes: item.minutes,
      });
      if (session && seedDrills && item.drills.length) {
        await seedDrillsOntoSession(session.id, item.drills);
      }
    }
  } else {
    await createSession({
      programId: program.id,
      title: "Day 1",
      day: 1,
      minutes,
    });
  }

  return { error: null, program };
}

export async function updateProgram(
  programId: string,
  patch: Partial<{
    title: string;
    description: string;
    cover_url: string;
    weeks: number;
    days_per_week: number;
    minutes: number;
    level: string;
    tags: string[];
    is_premium: boolean;
    status: "draft" | "published";
  }>,
) {
  if (!isSupabaseConfigured) return { error: "Supabase not configured" };
  const { error } = await supabase.from("programs").update(patch).eq("id", programId);
  return { error: error?.message ?? null };
}

export async function publishProgram(programId: string, published: boolean) {
  return updateProgram(programId, { status: published ? "published" : "draft" });
}

export async function deleteProgram(programId: string) {
  if (!isSupabaseConfigured) return { error: "Supabase not configured" };
  const { sessions } = await fetchProgramSessions(programId);
  for (const s of sessions) {
    await deleteSession(s.id);
  }
  const { error } = await supabase.from("programs").delete().eq("id", programId);
  return { error: error?.message ?? null };
}

export async function duplicateProgram(programId: string, userId: string, creatorSlug: string) {
  const { program } = await fetchProgram(programId);
  if (!program) return { error: "Program not found", program: null };

  const { program: copy, error } = await createProgram({
    userId,
    creatorSlug,
    title: `${program.title} (copy)`,
    description: program.description ?? "",
    coverUrl: program.cover_url ?? undefined,
    level: program.level,
    weeks: program.weeks,
    daysPerWeek: program.days_per_week,
    minutes: program.minutes,
    tags: program.tags,
    isPremium: program.is_premium,
    templateId: "blank",
    autoSchedule: false,
    seedDrills: false,
  });
  if (error || !copy) return { error: error ?? "Copy failed", program: null };

  // Remove the Day 1 placeholder from createProgram(autoSchedule:false)
  const { sessions: placeholders } = await fetchProgramSessions(copy.id);
  for (const p of placeholders) await deleteSession(p.id);

  const { sessions } = await fetchProgramSessions(programId);
  for (const s of sessions) {
    const { session: ns } = await createSession({
      programId: copy.id,
      title: s.title,
      day: s.day,
      description: s.description ?? "",
      minutes: s.minutes,
      muxPlaybackId: s.mux_playback_id ?? undefined,
    });
    if (!ns) continue;
    const { exercises } = await fetchSessionExercises(s.id);
    await seedDrillsOntoSession(
      ns.id,
      exercises.map((e) => ({
        name: e.name,
        reps: e.reps ?? "Reps: 8 8 8",
        rest_seconds: e.rest_seconds,
        muxPlaybackId: e.mux_playback_id,
      })),
    );
  }

  return { error: null, program: copy };
}

export async function fetchProgramSessions(programId: string) {
  if (!isSupabaseConfigured) return { error: null, sessions: [] as StudioSession[] };
  const { data, error } = await supabase
    .from("workout_sessions")
    .select("*")
    .eq("program_id", programId)
    .order("day", { ascending: true });
  if (error) return { error: error.message, sessions: [] as StudioSession[] };
  return { error: null, sessions: (data ?? []) as StudioSession[] };
}

export async function createSession(opts: {
  programId: string;
  title: string;
  day: number;
  description?: string;
  minutes?: number;
  muxPlaybackId?: string;
}) {
  if (!isSupabaseConfigured) return { error: "Supabase not configured", session: null };
  const id = `${opts.programId}-d${opts.day}-${Date.now().toString(36)}`;
  const { data, error } = await supabase
    .from("workout_sessions")
    .insert({
      id,
      program_id: opts.programId,
      title: opts.title.trim(),
      description: opts.description ?? "",
      cover_url: null,
      tags: [],
      sets: 1,
      day: opts.day,
      minutes: opts.minutes ?? 45,
      mux_playback_id: opts.muxPlaybackId ?? null,
      video_url: null,
    })
    .select("*")
    .single();
  if (error) return { error: error.message, session: null };
  return { error: null, session: data as StudioSession };
}

export async function updateSession(
  sessionId: string,
  patch: Partial<{
    title: string;
    description: string;
    day: number;
    minutes: number;
    mux_playback_id: string | null;
  }>,
) {
  if (!isSupabaseConfigured) return { error: "Supabase not configured" };
  const { error } = await supabase.from("workout_sessions").update(patch).eq("id", sessionId);
  return { error: error?.message ?? null };
}

export async function deleteSession(sessionId: string) {
  if (!isSupabaseConfigured) return { error: "Supabase not configured" };
  const { exercises } = await fetchSessionExercises(sessionId);
  for (const e of exercises) {
    await deleteExercise(e.id);
  }
  const { error } = await supabase.from("workout_sessions").delete().eq("id", sessionId);
  return { error: error?.message ?? null };
}

export async function duplicateSession(sessionId: string, programId: string, nextDay: number) {
  const { sessions } = await fetchProgramSessions(programId);
  const source = sessions.find((s) => s.id === sessionId);
  if (!source) return { error: "Session not found", session: null };

  const { session, error } = await createSession({
    programId,
    title: `${source.title} (copy)`,
    day: nextDay,
    description: source.description ?? "",
    minutes: source.minutes,
    muxPlaybackId: source.mux_playback_id ?? undefined,
  });
  if (error || !session) return { error: error ?? "Failed", session: null };

  const { exercises } = await fetchSessionExercises(sessionId);
  await seedDrillsOntoSession(
    session.id,
    exercises.map((e) => ({
      name: e.name,
      reps: e.reps ?? "Reps: 8 8 8",
      rest_seconds: e.rest_seconds,
      muxPlaybackId: e.mux_playback_id,
    })),
  );
  return { error: null, session };
}

/** Fill missing days up to weeks × days_per_week. */
export async function fillProgramSchedule(program: StudioProgram, seedFromTemplateId?: string) {
  const target = program.weeks * program.days_per_week;
  const { sessions } = await fetchProgramSessions(program.id);
  const existingDays = new Set(sessions.map((s) => s.day));
  const template =
    PROGRAM_TEMPLATES.find((t) => t.id === seedFromTemplateId) ??
    PROGRAM_TEMPLATES.find((t) => t.id === "blank")!;
  const plan = buildSessionPlan(template, program.weeks, program.days_per_week);

  let created = 0;
  for (const item of plan) {
    if (item.day > target) break;
    if (existingDays.has(item.day)) continue;
    const { session } = await createSession({
      programId: program.id,
      title: item.title,
      day: item.day,
      minutes: item.minutes || program.minutes,
    });
    if (session && item.drills.length) {
      await seedDrillsOntoSession(session.id, item.drills);
    }
    created += 1;
  }
  return { error: null as string | null, created };
}

export async function fetchSessionExercises(sessionId: string) {
  if (!isSupabaseConfigured) return { error: null, exercises: [] as StudioExercise[] };
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("session_id", sessionId)
    .order("sort_order", { ascending: true });
  if (error) return { error: error.message, exercises: [] as StudioExercise[] };
  return { error: null, exercises: (data ?? []) as StudioExercise[] };
}

export async function createExercise(opts: {
  sessionId: string;
  name: string;
  reps?: string;
  sortOrder?: number;
  restSeconds?: number;
  muxPlaybackId?: string | null;
}) {
  if (!isSupabaseConfigured) return { error: "Supabase not configured", exercise: null };
  const id = `ex-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const { data, error } = await supabase
    .from("exercises")
    .insert({
      id,
      session_id: opts.sessionId,
      name: opts.name.trim(),
      reps: opts.reps ?? "Reps: 8 8 8",
      sort_order: opts.sortOrder ?? 0,
      rest_seconds: opts.restSeconds ?? 60,
      mux_playback_id: opts.muxPlaybackId ?? null,
      video_url: null,
      thumbnail_url: DEFAULT_COVER.replace("w=1200", "w=800"),
    })
    .select("*")
    .single();
  if (error) return { error: error.message, exercise: null };
  return { error: null, exercise: data as StudioExercise };
}

async function seedDrillsOntoSession(
  sessionId: string,
  drills: (DrillPreset & { muxPlaybackId?: string | null })[],
) {
  for (let i = 0; i < drills.length; i++) {
    const d = drills[i];
    await createExercise({
      sessionId,
      name: d.name,
      reps: d.reps,
      restSeconds: d.rest_seconds,
      sortOrder: i,
      muxPlaybackId: d.muxPlaybackId,
    });
  }
}

export async function updateExercise(
  exerciseId: string,
  patch: Partial<{
    name: string;
    reps: string;
    sort_order: number;
    rest_seconds: number;
    mux_playback_id: string | null;
  }>,
) {
  if (!isSupabaseConfigured) return { error: "Supabase not configured" };
  const { error } = await supabase.from("exercises").update(patch).eq("id", exerciseId);
  return { error: error?.message ?? null };
}

export async function deleteExercise(exerciseId: string) {
  if (!isSupabaseConfigured) return { error: "Supabase not configured" };
  const { error } = await supabase.from("exercises").delete().eq("id", exerciseId);
  return { error: error?.message ?? null };
}

export async function reorderExercises(orderedIds: string[]) {
  if (!isSupabaseConfigured) return { error: "Supabase not configured" };
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from("exercises")
      .update({ sort_order: i })
      .eq("id", orderedIds[i]);
    if (error) return { error: error.message };
  }
  return { error: null as string | null };
}

export async function applyDrillPresets(sessionId: string, presets: DrillPreset[], startOrder: number) {
  const created: StudioExercise[] = [];
  for (let i = 0; i < presets.length; i++) {
    const p = presets[i];
    const { exercise } = await createExercise({
      sessionId,
      name: p.name,
      reps: p.reps,
      restSeconds: p.rest_seconds,
      sortOrder: startOrder + i,
    });
    if (exercise) created.push(exercise);
  }
  return { error: null as string | null, exercises: created };
}

export async function fetchCreatorStudentProgress(programId?: string) {
  if (!isSupabaseConfigured) return { error: null, rows: [] as StudentProgressRow[] };
  const { data, error } = await supabase.rpc("creator_student_progress", {
    p_program_id: programId ?? null,
  });
  if (error) return { error: error.message, rows: [] as StudentProgressRow[] };
  return { error: null, rows: (data ?? []) as StudentProgressRow[] };
}
