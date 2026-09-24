import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth";
import {
  activateCreator,
  fetchCreatorStudentProgress,
  fetchMyCreatorFollowers,
  fetchMyPrograms,
} from "../../lib/studio";
import type { StudentProgressRow, StudioProgram } from "../../lib/database";

export function StudioHomePage() {
  const { user, profile, refreshProfile } = useAuth();
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
      setError(err);
      return;
    }
    await refreshProfile();
    await load();
  };

  if (!profile?.is_creator) {
    return (
      <main className="studio-page studio-page--narrow">
        <p className="studio-kicker">Get started</p>
        <h1>Activate Creator Studio</h1>
        <p className="studio-muted">
          One click unlocks programs, the CMS, student progress, and templates — same account as the
          athlete app.
        </p>
        {error ? <p className="studio-error">{error}</p> : null}
        <button
          type="button"
          className="studio-btn studio-btn--accent"
          disabled={busy}
          onClick={() => void onActivate()}
        >
          {busy ? "Activating…" : "Become a creator"}
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

  return (
    <main className="studio-page">
      <header className="studio-page-head">
        <div>
          <p className="studio-kicker">Dashboard</p>
          <h1>Welcome back{profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}</h1>
          <p className="studio-muted">Ship programs fast — templates and auto-schedules do the heavy lifting.</p>
        </div>
        <div className="studio-actions">
          <Link className="studio-btn studio-btn--ghost" to="/studio/cms">
            Open CMS
          </Link>
          <Link className="studio-btn studio-btn--accent" to="/studio/programs/new">
            New program
          </Link>
        </div>
      </header>

      <div className="studio-stat-row">
        <div>
          <strong>{programs.length}</strong>
          <span>Programs</span>
        </div>
        <div>
          <strong>{published}</strong>
          <span>Published</span>
        </div>
        <div>
          <strong>{draft}</strong>
          <span>Drafts</span>
        </div>
        <div>
          <strong>{students.length}</strong>
          <span>Students</span>
        </div>
        <div>
          <strong>{followerCount}</strong>
          <span>Followers</span>
        </div>
        <div>
          <strong>{avg}%</strong>
          <span>Avg progress</span>
        </div>
      </div>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>Quick actions</h2>
        </div>
        <div className="studio-quick">
          <Link to="/studio/programs/new">
            <strong>Wizard + templates</strong>
            <span>Auto-build weeks, days, and starter drills</span>
          </Link>
          <Link to="/studio/cms">
            <strong>Deep CMS</strong>
            <span>Edit sessions, Mux IDs, and drill order</span>
          </Link>
          <Link to="/studio/students">
            <strong>Students</strong>
            <span>See who is showing up and where they are</span>
          </Link>
          <Link to="/studio/followers">
            <strong>Followers</strong>
            <span>Athletes who follow your creator profile</span>
          </Link>
          <Link to="/studio/library">
            <strong>Drill library</strong>
            <span>One-tap presets for warm-up, technique, rounds</span>
          </Link>
        </div>
      </section>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>Recent programs</h2>
          <Link to="/studio/programs">View all</Link>
        </div>
        {loading ? (
          <p className="studio-muted">Loading…</p>
        ) : programs.length === 0 ? (
          <div className="studio-empty">
            <p>No programs yet — start from a template in under a minute.</p>
            <Link className="studio-btn studio-btn--accent" to="/studio/programs/new">
              Create program
            </Link>
          </div>
        ) : (
          <ul className="studio-table">
            {programs.slice(0, 6).map((p) => (
              <li key={p.id}>
                <Link to={`/studio/programs/${p.id}`}>
                  <span className="studio-table-title">{p.title}</span>
                  <span className="studio-table-meta">
                    {p.weeks}w · {p.days_per_week}d/w · {p.level}
                  </span>
                  <span className={`studio-pill studio-pill--${p.status}`}>{p.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
