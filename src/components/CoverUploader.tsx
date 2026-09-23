import { useRef, useState } from "react";
import { uploadProgramCover, validateCoverFile } from "../lib/cover";

type Props = {
  userId: string;
  /** When set, upload goes straight to Storage */
  programId?: string;
  coverUrl: string | null;
  onCoverUrl: (url: string) => void;
  /** Hold local file until program exists (wizard) */
  onPendingFile?: (file: File | null) => void;
  disabled?: boolean;
};

export function CoverUploader({
  userId,
  programId,
  coverUrl,
  onCoverUrl,
  onPendingFile,
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shown = preview || coverUrl;

  const onPick = async (file: File | null) => {
    setError(null);
    if (!file) return;

    const invalid = validateCoverFile(file);
    if (invalid) {
      setError(invalid);
      return;
    }

    const local = URL.createObjectURL(file);
    setPreview(local);

    if (!programId) {
      onPendingFile?.(file);
      return;
    }

    setBusy(true);
    const { url, error: upErr } = await uploadProgramCover(userId, programId, file);
    setBusy(false);
    if (upErr || !url) {
      setError(upErr ?? "Upload failed");
      return;
    }
    onPendingFile?.(null);
    onCoverUrl(url);
  };

  return (
    <div className="cover-uploader">
      <div
        className="cover-uploader__stage"
        style={shown ? { ["--cover" as string]: `url('${shown}')` } : undefined}
      >
        {!shown ? (
          <div className="cover-uploader__empty">
            <strong>Program cover</strong>
            <span>Mat / training photo · JPEG, PNG, WebP · max 5MB</span>
          </div>
        ) : null}
        <div className="cover-uploader__actions">
          <button
            type="button"
            className="studio-btn studio-btn--ghost"
            disabled={disabled || busy}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? "Uploading…" : shown ? "Change cover" : "Upload cover"}
          </button>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(e) => void onPick(e.target.files?.[0] ?? null)}
      />
      {error ? <p className="studio-error">{error}</p> : null}
      <p className="studio-muted cover-uploader__hint">
        Stored in Supabase Storage (<code>covers</code>). Avoid gym-lift stock — mats, rounds, drilling.
      </p>
    </div>
  );
}
