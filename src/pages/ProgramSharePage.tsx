import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { brand } from "../brand";
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
  const [program, setProgram] = useState<PublicProgram | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const deepLink = `rashmat://program/${id}`;
  const storeHint = brand.platformUrl;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!id) {
        setError("Missing program id");
        setLoading(false);
        return;
      }
      if (!isSupabaseConfigured) {
        setError("Supabase not configured");
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
        setError("This program isn’t published or wasn’t found.");
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
        {loading ? <p className="studio-muted">Loading program…</p> : null}
        {error ? (
          <div className="share-card">
            <h1>Program unavailable</h1>
            <p className="studio-muted">{error}</p>
            <Link className="studio-btn studio-btn--accent" to="/">
              Back to site
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
            <p className="studio-kicker">Creator program</p>
            <h1>{program.title}</h1>
            <p className="studio-muted">
              {program.weeks} weeks · {program.days_per_week} days/week · {program.minutes} min ·{" "}
              {program.level}
            </p>
            {program.description ? <p className="share-desc">{program.description}</p> : null}

            <div className="share-actions">
              <button type="button" className="studio-btn studio-btn--accent" onClick={openApp}>
                Open in RASHMAT app
              </button>
              <a className="studio-btn studio-btn--ghost" href={storeHint}>
                Get the app / platform
              </a>
            </div>

            <p className="share-deeplink">
              Deep link: <code>{deepLink}</code>
            </p>
            <p className="studio-muted share-note">
              On a phone with the app installed, Open jumps straight into this program. Otherwise use
              the platform link.
            </p>
          </div>
        ) : null}
      </main>
    </div>
  );
}
