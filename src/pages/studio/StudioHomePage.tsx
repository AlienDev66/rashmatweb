import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth";
import { useT } from "../../i18n";
import {
  activateCreator,
  fetchCreatorStudentProgress,
  fetchMyCreatorFollowers,
  fetchMyPrograms,
} from "../../lib/studio";
import type { StudentProgressRow, StudioProgram } from "../../lib/database";

export function StudioHomePage() {
  const { user, profile, refreshProfile } = useAuth();
  const t = useT();
  const [programs, setPrograms] = useState<StudioProgram[]>([]);
  const [students, setStudents] = useState<StudentProgressRow[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [progs, studs, followers] = await Promise.all([
      fetchMyPrograms(user.id),
      fetchCreatorStudentProgress(),
      fetchMyCreatorFollowers(),
    ]);
    setPrograms(progs.programs);
    setStudents(studs.rows);
    setFollowerCount(followers.rows.length);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const onActivate = async () => {
    setBusy(true);
    setError(null);
    const { error: err } = await activateCreator(profile?.full_name ?? undefined);
    setBusy(false);
    if (err) {
      setError(t(err));
      return;
    }
    await refreshProfile();
    await load();
  };

  if (!profile?.is_creator) {
    return (
      <main className="studio-page studio-page--narrow">
        <p className="studio-kicker">{t("studio.getStarted")}</p>
        <h1>{t("studio.activateTitle")}</h1>
        <p className="studio-muted">{t("studio.activateBody")}</p>
        {error ? <p className="studio-error">{error}</p> : null}
        <button
          type="button"
          className="studio-btn studio-btn--accent"
          disabled={busy}
          onClick={() => void onActivate()}
        >
          {busy ? t("studio.activating") : t("studio.becomeCreator")}
        </button>
      </main>
    );
  }

  const published = programs.filter((p) => p.status === "published").length;
  const draft = programs.length - published;
  const avg =
    students.length === 0
      ? 0
      : Math.round(students.reduce((s, r) => s + Number(r.progress_pct), 0) / students.length);

  const firstName = profile.full_name?.split(" ")[0];
  const welcome = firstName
    ? t("studio.welcomeBackName", { name: firstName })
    : t("studio.welcomeBack");

  return (
    <main className="studio-page">
      <header className="studio-page-head">
        <div>
          <p className="studio-kicker">{t("studio.navDashboard")}</p>
          <h1>{welcome}</h1>
          <p className="studio-muted">{t("studio.dashboardSub")}</p>
        </div>
        <div className="studio-actions">
          <Link className="studio-btn studio-btn--ghost" to="/studio/cms">
            {t("studio.openCms")}
          </Link>
          <Link className="studio-btn studio-btn--accent" to="/studio/programs/new">
            {t("studio.newProgram")}
          </Link>
        </div>
      </header>

      <div className="studio-stat-row">
        <div>
          <strong>{programs.length}</strong>
          <span>{t("studio.statPrograms")}</span>
        </div>
        <div>
          <strong>{published}</strong>
          <span>{t("studio.statPublished")}</span>
        </div>
        <div>
          <strong>{draft}</strong>
          <span>{t("studio.statDrafts")}</span>
        </div>
        <div>
          <strong>{students.length}</strong>
          <span>{t("studio.statStudents")}</span>
        </div>
        <div>
          <strong>{followerCount}</strong>
          <span>{t("studio.statFollowers")}</span>
        </div>
        <div>
          <strong>{avg}%</strong>
          <span>{t("studio.statAvgProgress")}</span>
        </div>
      </div>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>{t("studio.home.quickTitle")}</h2>
        </div>
        <div className="studio-quick">
          <Link to="/studio/programs/new">
            <strong>{t("studio.home.quickWizard")}</strong>
            <span>{t("studio.home.quickWizardHint")}</span>
          </Link>
          <Link to="/studio/cms">
            <strong>{t("studio.home.quickCms")}</strong>
            <span>{t("studio.home.quickCmsHint")}</span>
          </Link>
          <Link to="/studio/students">
            <strong>{t("studio.home.quickStudents")}</strong>
            <span>{t("studio.home.quickStudentsHint")}</span>
          </Link>
          <Link to="/studio/followers">
            <strong>{t("studio.home.quickFollowers")}</strong>
            <span>{t("studio.home.quickFollowersHint")}</span>
          </Link>
          <Link to="/studio/library">
            <strong>{t("studio.home.quickLibrary")}</strong>
            <span>{t("studio.home.quickLibraryHint")}</span>
          </Link>
        </div>
      </section>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>{t("studio.home.recentTitle")}</h2>
          <Link to="/studio/programs">{t("studio.home.viewAll")}</Link>
        </div>
        {loading ? (
          <p className="studio-muted">{t("common.loading")}</p>
        ) : programs.length === 0 ? (
          <div className="studio-empty">
            <p>{t("studio.home.empty")}</p>
            <Link className="studio-btn studio-btn--accent" to="/studio/programs/new">
              {t("studio.home.createProgram")}
            </Link>
          </div>
        ) : (
          <ul className="studio-table">
            {programs.slice(0, 6).map((p) => (
              <li key={p.id}>
                <Link to={`/studio/programs/${p.id}`}>
                  <span className="studio-table-title">{p.title}</span>
                  <span className="studio-table-meta">
                    {t("studio.home.programMeta", {
                      weeks: p.weeks,
                      days: p.days_per_week,
                      level: t(`studio.levels.${p.level}`),
                    })}
                  </span>
                  <span className={`studio-pill studio-pill--${p.status}`}>
                    {t(`studio.status.${p.status}`)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
