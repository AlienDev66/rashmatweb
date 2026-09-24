import { isSupabaseConfigured, supabase } from "./supabase";

const VIDEO_BUCKET = "videos";
const MAX_BYTES = 100 * 1024 * 1024; // 100MB

const ALLOWED = new Set([
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-m4v",
]);

function extensionFor(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && ["mp4", "mov", "webm", "m4v"].includes(fromName)) return fromName;
  if (file.type === "video/webm") return "webm";
  if (file.type === "video/quicktime") return "mov";
  return "mp4";
}

export function validateVideoFile(file: File) {
  if (file.size > MAX_BYTES) return "errors.videoTooLarge";
  if (file.type && !ALLOWED.has(file.type) && !file.type.startsWith("video/")) {
    return "errors.videoType";
  }
  return null;
}

/** Path: {userId}/clips/{timestamp}-{safeName}.ext */
export async function uploadVideoToStorage(userId: string, file: File) {
  if (!isSupabaseConfigured) {
    return { error: "errors.supabaseMissing", url: null as string | null };
  }

  const invalid = validateVideoFile(file);
  if (invalid) return { error: invalid, url: null };

  const ext = extensionFor(file);
  const safe = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const path = `${userId}/clips/${Date.now().toString(36)}-${safe || "clip"}.${ext}`;

  const contentType = file.type && ALLOWED.has(file.type) ? file.type : "video/mp4";

  const { error: uploadError } = await supabase.storage
    .from(VIDEO_BUCKET)
    .upload(path, file, { contentType, upsert: false });

  if (uploadError) {
    return { error: uploadError.message, url: null };
  }

  const { data } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(path);
  return { error: null, url: data.publicUrl };
}
