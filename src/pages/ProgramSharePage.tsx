import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { brand } from "../brand";
import { useT } from "../i18n";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type PublicProgram = {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  level: string;
  weeks: number;
  days_per_week: number;
  minutes: number;
  status: string;
};

export function ProgramSharePage() {
  const { id = "" } = useParams();
  const t = useT();
  const [program, setProgram] = useState<PublicProgram | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const deepLink = `rashmat://program/${id}`;
  const storeHint = brand.platformUrl;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!id) {
        setError("errors.missingProgramId");
        setLoading(false);
        return;
      }
      if (!isSupabaseConfigured) {
        setError("errors.supabaseMissing");
        setLoading(false);
        return;
      }
      const { data, error: err } = await supabase
        .from("programs")
        .select(
          "id, title, description, cover_url, level, weeks, days_per_week, minutes, status",
        )
        .eq("id", id)
        .maybeSingle();
      if (cancelled) return;
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      if (!data || data.status !== "published") {
        setError("errors.programUnavailable");
        setLoading(false);
        return;
      }
      setProgram(data as PublicProgram);
      setLoading(false);
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const openApp = () => {
    window.location.href = deepLink;
    window.setTimeout(() => {
      // If the app isn’t installed, user can still use platform URL
    }, 800);
  };

  return (
    <div className="share-page">
      <header className="share-top">
        <Link to="/" className="studio-brand">
          <img src="/logo-yellow.png" width={40} height={40} alt="" />
          <span>{brand.name}</span>
        </Link>
      </header>

      <main className="share-main">
        {loading ? <p className="studio-muted">{t("share.loading")}</p> : null}
        {error ? (
          <div className="share-card">
            <h1>{t("share.unavailable")}</h1>
            <p className="studio-muted">{t(error)}</p>
            <Link className="studio-btn studio-btn--accent" to="/">
              {t("share.backToSite")}
            </Link>
          </div>
        ) : null}
        {program ? (
          <div className="share-card">
            <div
              className="share-cover"
              style={
                program.cover_url
                  ? { ["--cover" as string]: `url('${program.cover_url}')` }
                  : undefined
              }
            />
            <p className="studio-kicker">{t("share.kicker")}</p>
            <h1>{program.title}</h1>
            <p className="studio-muted">
              {t("share.meta", {
                weeks: program.weeks,
                days: program.days_per_week,
                minutes: program.minutes,
                level: t(`studio.levels.${program.level}`),
              })}
            </p>
            {program.description ? <p className="share-desc">{program.description}</p> : null}

            <div className="share-actions">
              <button type="button" className="studio-btn studio-btn--accent" onClick={openApp}>
                {t("share.openApp")}
              </button>
              <a className="studio-btn studio-btn--ghost" href={storeHint}>
                {t("share.getApp")}
              </a>
            </div>

            <p className="share-deeplink">
              {t("share.deepLink")} <code>{deepLink}</code>
            </p>
            <p className="studio-muted share-note">{t("share.note")}</p>
          </div>
        ) : null}
      </main>
    </div>
  );
}
