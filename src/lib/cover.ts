import { isSupabaseConfigured, supabase } from "./supabase";

const COVER_BUCKET = "covers";
const MAX_BYTES = 5 * 1024 * 1024; // 5MB — matches bucket limit

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export function resolveImageContentType(file: File) {
  if (ALLOWED.has(file.type)) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  return null;
}

function extensionFor(contentType: string) {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}

export function validateCoverFile(file: File) {
  if (file.size > MAX_BYTES) {
    return "Cover must be under 5MB.";
  }
  if (!resolveImageContentType(file)) {
    return "Use JPEG, PNG, or WebP.";
  }
  return null;
}

/** Path: {userId}/programs/{programId}.{ext} */
export async function uploadProgramCover(userId: string, programId: string, file: File) {
  if (!isSupabaseConfigured) {
    return { error: "Supabase not configured", url: null as string | null };
  }

  const validation = validateCoverFile(file);
  if (validation) return { error: validation, url: null };

  const contentType = resolveImageContentType(file)!;
  const path = `${userId}/programs/${programId}.${extensionFor(contentType)}`;

  const { error: uploadError } = await supabase.storage
    .from(COVER_BUCKET)
    .upload(path, file, { contentType, upsert: true });

  if (uploadError) {
    return { error: uploadError.message, url: null };
  }

  const { data } = supabase.storage.from(COVER_BUCKET).getPublicUrl(path);
  const url = `${data.publicUrl}?t=${Date.now()}`;
  return { error: null, url };
}
