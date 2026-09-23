/**
 * Mux is owned by RASHMAT (platform), not by each creator.
 *
 * Creators never create a Mux account or pay Mux directly.
 * They upload in Studio → our edge function creates a Direct Upload
 * with the platform token → Mux returns a playback_id we store on the drill/session.
 *
 * Billing: RASHMAT pays Mux for encoding + streaming; you price that into Pro / program fees later.
 */

import { supabase } from "./supabase";

export type MuxUploadSession = {
  uploadId: string;
  uploadUrl: string;
};

export async function createMuxDirectUpload(): Promise<
  { error: null; data: MuxUploadSession } | { error: string; data: null }
> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) return { error: "Sign in required", data: null };

  const base = import.meta.env.VITE_SUPABASE_URL;
  if (!base) return { error: "Supabase URL missing", data: null };

  const res = await fetch(`${base}/functions/v1/mux-direct-upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const j = JSON.parse(text) as { error?: string; message?: string };
      message = j.error || j.message || text;
    } catch {
      /* keep text */
    }
    if (res.status === 404 || res.status === 503) {
      return {
        error:
          "Mux upload not configured yet. Deploy the mux-direct-upload function and set MUX_TOKEN_ID / MUX_TOKEN_SECRET on Supabase.",
        data: null,
      };
    }
    return { error: message || `Upload init failed (${res.status})`, data: null };
  }

  const json = (await res.json()) as MuxUploadSession & { playbackId?: string };
  if (!json.uploadUrl || !json.uploadId) {
    return { error: "Invalid upload session from server", data: null };
  }
  return { error: null, data: { uploadId: json.uploadId, uploadUrl: json.uploadUrl } };
}

/** PUT the file to Mux's direct upload URL. */
export async function putFileToMux(uploadUrl: string, file: File) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
  });
  if (!res.ok) {
    return { error: `Mux upload failed (${res.status})` };
  }
  return { error: null as string | null };
}

export async function fetchMuxPlaybackId(uploadId: string): Promise<
  { error: null; playbackId: string } | { error: string; playbackId: null }
> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) return { error: "Sign in required", playbackId: null };

  const base = import.meta.env.VITE_SUPABASE_URL;
  const res = await fetch(
    `${base}/functions/v1/mux-direct-upload?uploadId=${encodeURIComponent(uploadId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
      },
    },
  );

  if (!res.ok) {
    const text = await res.text();
    return { error: text || `Status ${res.status}`, playbackId: null };
  }

  const json = (await res.json()) as {
    status?: string;
    playbackId?: string | null;
    error?: string;
  };

  if (json.error) return { error: json.error, playbackId: null };
  if (json.playbackId) return { error: null, playbackId: json.playbackId };
  return { error: `Asset not ready (${json.status ?? "pending"})`, playbackId: null };
}

/** Upload file and poll until playback ID exists (or timeout). */
export async function uploadVideoToMux(
  file: File,
  opts?: { timeoutMs?: number; intervalMs?: number },
) {
  const init = await createMuxDirectUpload();
  if (init.error || !init.data) return { error: init.error ?? "Init failed", playbackId: null };

  const put = await putFileToMux(init.data.uploadUrl, file);
  if (put.error) return { error: put.error, playbackId: null };

  const timeoutMs = opts?.timeoutMs ?? 90_000;
  const intervalMs = opts?.intervalMs ?? 2500;
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    await new Promise((r) => setTimeout(r, intervalMs));
    const status = await fetchMuxPlaybackId(init.data.uploadId);
    if (status.playbackId) return { error: null, playbackId: status.playbackId };
    // keep polling while "not ready"
    if (status.error && !status.error.includes("not ready") && !status.error.includes("waiting")) {
      // soft: continue until timeout for pending states
    }
  }

  return {
    error:
      "Upload received — Mux is still processing. Paste the playback ID later, or retry status in a minute.",
    playbackId: null,
  };
}
