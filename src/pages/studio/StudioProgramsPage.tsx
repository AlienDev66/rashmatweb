import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import type { StudioProgram } from "../../lib/database";
import {
  deleteProgram,
  duplicateProgram,
  fetchMyPrograms,
  publishProgram,
} from "../../lib/studio";

export function StudioProgramsPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<StudioProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "draft" | "published">("all");
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { programs: list } = await fetchMyPrograms(user.id);
    setPrograms(list);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!profile?.is_creator) {
    return (
      <main className="studio-page studio-page--narrow">
        <p className="studio-muted">Activate creator mode from the dashboard first.</p>
        <Link to="/studio">← Dashboard</Link>
      </main>
    );
  }

  const filtered = programs.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;
    if (q.trim() && !p.title.toLowerCase().includes(q.trim().toLowerCase())) return false;
    return true;
  });

  const onDuplicate = async (id: string) => {
    if (!user || !profile.creator_slug) return;
    setBusyId(id);
    const { program, error } = await duplicateProgram(id, user.id, profile.creator_slug);
    setBusyId(null);
    if (error || !program) {
      window.alert(error ?? "Could not duplicate");
      return;
    }
    await load();
    navigate(`/studio/programs/${program.id}`);
  };

  const onToggle = async (p: StudioProgram) => {
    setBusyId(p.id);
    const next = p.status !== "published";
    const { error } = await publishProgram(p.id, next);
    setBusyId(null);
    if (error) {
      window.alert(error);
      return;
    }
    setPrograms((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, status: next ? "published" : "draft" } : x)),
    );
  };

  const onDelete = async (p: StudioProgram) => {
    if (!window.confirm(`Delete “${p.title}”? This removes sessions and drills.`)) return;
    setBusyId(p.id);
    const { error } = await deleteProgram(p.id);
    setBusyId(null);
    if (error) {
      window.alert(error);
      return;
    }
    setPrograms((prev) => prev.filter((x) => x.id !== p.id));
  };

  return (
    <main className="studio-page">
      <header className="studio-page-head">
        <div>
          <p className="studio-kicker">Catalog</p>
          <h1>Programs</h1>
        </div>
        <Link className="studio-btn studio-btn--accent" to="/studio/programs/new">
          New program
        </Link>
      </header>

      <div className="studio-toolbar">
        <input
          className="studio-search"
          placeholder="Search programs…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="studio-seg">
          {(["all", "draft", "published"] as const).map((f) => (
            <button
              key={f}
              type="button"
              className={filter === f ? "is-active" : undefined}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="studio-muted">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="studio-empty">
          <p>No programs match.</p>
          <Link className="studio-btn studio-btn--accent" to="/studio/programs/new">
            Create one
          </Link>
        </div>
      ) : (
        <ul className="studio-card-list">
          {filtered.map((p) => (
            <li key={p.id} className="studio-card">
              <div className="studio-card-main">
                <Link to={`/studio/programs/${p.id}`} className="studio-card-title">
                  {p.title}
                </Link>
                <p className="studio-muted">
                  {p.weeks} weeks · {p.days_per_week} days/week · {p.minutes} min · {p.level}
                </p>
                <div className="studio-tags">
                  <span className={`studio-pill studio-pill--${p.status}`}>{p.status}</span>
                  {p.tags.slice(0, 4).map((t) => (
                    <span key={t} className="studio-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="studio-card-actions">
                <Link className="studio-btn studio-btn--ghost" to={`/studio/cms?program=${p.id}`}>
                  CMS
                </Link>
                <button
                  type="button"
                  className="studio-btn studio-btn--ghost"
                  disabled={busyId === p.id}
                  onClick={() => void onToggle(p)}
                >
                  {p.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  className="studio-btn studio-btn--ghost"
                  disabled={busyId === p.id}
                  onClick={() => void onDuplicate(p.id)}
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  className="studio-btn studio-btn--danger"
                  disabled={busyId === p.id}
                  onClick={() => void onDelete(p)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
