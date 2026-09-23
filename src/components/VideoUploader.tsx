import { useRef, useState } from "react";
import { useAuth } from "../auth";
import { uploadVideoToStorage, validateVideoFile } from "../lib/videoUpload";

export type VideoValue = {
  muxPlaybackId: string;
  videoUrl: string;
};

type Props = {
  label?: string;
  value: VideoValue;
  onChange: (next: VideoValue) => void;
  disabled?: boolean;
};

/**
 * Default path: Supabase Storage MP4 (no Mux cost).
 * Optional paste of Mux playback ID if you add Mux later.
 */
export function VideoUploader({
  label = "Video",
  value,
  onChange,
  disabled,
}: Props) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const display = value.videoUrl || value.muxPlaybackId;

  const onFile = async (file: File | null) => {
    setError(null);
    setInfo(null);
    if (!file) return;
    if (!user) {
      setError("Sign in required");
      return;
    }

    const invalid = validateVideoFile(file);
    if (invalid) {
      setError(invalid);
      return;
    }

    setBusy(true);
    setInfo(`Uploading ${(file.size / (1024 * 1024)).toFixed(1)}MB to Storage…`);

    try {
      const { url, error: upErr } = await uploadVideoToStorage(user.id, file);
      if (upErr || !url) {
        setError(upErr ?? "Upload failed");
        setInfo(null);
        return;
      }
      onChange({ muxPlaybackId: "", videoUrl: url });
      setInfo("Ready — video stored (no Mux needed).");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      setInfo(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="video-uploader">
      <div className="video-uploader__row">
        <button
          type="button"
          className="studio-btn studio-btn--ghost"
          disabled={disabled || busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Uploading…" : "Upload video"}
        </button>
        <input
          className="video-uploader__id"
          value={display}
          onChange={(e) => {
            const v = e.target.value.trim();
            // Heuristic: full URL → video_url; else treat as Mux id
            if (/^https?:\/\//i.test(v)) {
              onChange({ muxPlaybackId: "", videoUrl: v });
            } else {
              onChange({ muxPlaybackId: v, videoUrl: "" });
            }
          }}
          placeholder="Or paste video URL / Mux ID"
          disabled={disabled || busy}
          aria-label={label}
        />
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,video/*"
        hidden
        onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
      />
      {info ? <p className="studio-flash">{info}</p> : null}
      {error ? <p className="studio-error">{error}</p> : null}
      <p className="studio-muted video-uploader__hint">
        Videos go to <strong>Supabase Storage</strong> (included in your plan). Mux is optional
        later for HLS — not required now.
      </p>
    </div>
  );
}
