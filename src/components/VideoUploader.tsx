import { useRef, useState } from "react";
import { useAuth } from "../auth";
import { useT } from "../i18n";
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
  /** Hide paste/Mux by default — upload stays primary */
  compact?: boolean;
};

/**
 * Default path: Supabase Storage MP4 (no Mux cost).
 * Optional paste of Mux playback ID if you add Mux later.
 */
export function VideoUploader({ label, value, onChange, disabled, compact }: Props) {
  const { user } = useAuth();
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const display = value.videoUrl || value.muxPlaybackId;
  const hasVideo = Boolean(display);

  const onFile = async (file: File | null) => {
    setError(null);
    setInfo(null);
    if (!file) return;
    if (!user) {
      setError(t("errors.signInRequired"));
      return;
    }

    const invalid = validateVideoFile(file);
    if (invalid) {
      setError(t(invalid));
      return;
    }

    setBusy(true);
    setInfo(t("upload.videoProgress", { size: (file.size / (1024 * 1024)).toFixed(1) }));

    try {
      const { url, error: upErr } = await uploadVideoToStorage(user.id, file);
      if (upErr || !url) {
        setError(upErr ? t(upErr) : t("errors.uploadFailed"));
        setInfo(null);
        return;
      }
      onChange({ muxPlaybackId: "", videoUrl: url });
      setInfo(t("upload.videoReady"));
    } catch (e) {
      setError(e instanceof Error ? e.message : t("errors.uploadFailed"));
      setInfo(null);
    } finally {
      setBusy(false);
    }
  };

  const pasteField = (
    <input
      className="video-uploader__id"
      value={display}
      onChange={(e) => {
        const v = e.target.value.trim();
        if (/^https?:\/\//i.test(v)) {
          onChange({ muxPlaybackId: "", videoUrl: v });
        } else {
          onChange({ muxPlaybackId: v, videoUrl: "" });
        }
      }}
      placeholder={t("upload.videoPlaceholder")}
      disabled={disabled || busy}
      aria-label={label ?? t("upload.videoLabel")}
    />
  );

  return (
    <div className={`video-uploader${compact ? " video-uploader--compact" : ""}`}>
      <div className="video-uploader__row">
        <button
          type="button"
          className="studio-btn studio-btn--ghost"
          disabled={disabled || busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? t("common.uploading") : hasVideo ? t("upload.videoReplace") : t("upload.videoUpload")}
        </button>
        {!compact ? pasteField : null}
        {compact && hasVideo ? (
          <span className="video-uploader__status studio-muted">{t("upload.videoAttached")}</span>
        ) : null}
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
      {compact ? (
        <details className="video-uploader__advanced">
          <summary>{t("upload.videoAdvanced")}</summary>
          {pasteField}
          <p className="studio-muted video-uploader__hint">
            {t("upload.videoHintStart")} <strong>{t("upload.videoHintStorage")}</strong>{" "}
            {t("upload.videoHintEnd")}
          </p>
        </details>
      ) : (
        <p className="studio-muted video-uploader__hint">
          {t("upload.videoHintStart")} <strong>{t("upload.videoHintStorage")}</strong>{" "}
          {t("upload.videoHintEnd")}
        </p>
      )}
    </div>
  );
}
