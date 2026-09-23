import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth";
import { CoverUploader } from "../../components/CoverUploader";
import type { StudioProgram, StudioSession } from "../../lib/database";
import {
  deleteProgram,
  fetchProgram,
  fetchProgramSessions,
  fillProgramSchedule,
  publishProgram,
  updateProgram,
} from "../../lib/studio";

export function StudioProgramDetailPage() {
  const { id = "" } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [program, setProgram] = useState<StudioProgram | null>(null);
  const [sessions, setSessions] = useState<StudioSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [weeks, setWeeks] = useState(4);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [minutes, setMinutes] = useState(60);
  const [level, setLevel] = useState("Beginner");
  const [tags, setTags] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const [{ program: p }, { sessions: s }] = await Promise.all([
      fetchProgram(id),
      fetchProgramSessions(id),
    ]);
    setProgram(p);
    setSessions(s);
    if (p) {
      setTitle(p.title);
      setDescription(p.description ?? "");
      setCoverUrl(p.cover_url ?? "");
      setWeeks(p.weeks);
      setDaysPerWeek(p.days_per_week);
      setMinutes(p.minutes);
      setLevel(p.level);
      setTags(p.tags.join(", "));
      setIsPremium(p.is_premium);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!profile?.is_creator) {
    return (
      <main className="studio-page studio-page--narrow">
        <Link to="/studio">← Dashboard</Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="studio-page">
        <p className="studio-muted">Loading…</p>
      </main>
    );
  }

  if (!program) {
    return (
      <main className="studio-page">
        <p className="studio-error">Program not found.</p>
        <Link to="/studio/programs">← Programs</Link>
      </main>
    );
  }

  const target = weeks * daysPerWeek;
  const missing = Math.max(0, target - sessions.length);

  const flash = (t: string) => {
    setMessage(t);
    window.setTimeout(() => setMessage(null), 2400);
  };

  const onCoverUrl = async (url: string) => {
    setCoverUrl(url);
    setBusy(true);
    const { error } = await updateProgram(program.id, { cover_url: url });
    setBusy(false);
    if (error) {
      flash(error);
      return;
    }
    setProgram({ ...program, cover_url: url });
    flash("Cover uploaded");
  };

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await updateProgram(program.id, {
      title: title.trim(),
      description,
      cover_url: coverUrl.trim() || program.cover_url || "",
      weeks,
      days_per_week: daysPerWeek,
      minutes,
      level,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      is_premium: isPremium,
    });
    setBusy(false);
    if (error) {
      flash(error);
      return;
    }
    flash("Saved");
    await load();
  };

  const onFill = async () => {
    setBusy(true);
    // Persist schedule size first
    await updateProgram(program.id, { weeks, days_per_week: daysPerWeek, minutes });
    const refreshed = { ...program, weeks, days_per_week: daysPerWeek, minutes };
    const { created, error } = await fillProgramSchedule(refreshed);
    setBusy(false);
    if (error) {
      flash(error);
      return;
    }
    flash(`Added ${created} session${created === 1 ? "" : "s"}`);
    await load();
  };

  const onPublish = async () => {
    const next = program.status !== "published";
    setBusy(true);
    const { error } = await publishProgram(program.id, next);
    setBusy(false);
    if (error) {
      flash(error);
      return;
    }
    setProgram({ ...program, status: next ? "published" : "draft" });
    flash(next ? "Published" : "Unpublished");
  };

  const onDelete = async () => {
    if (!window.confirm(`Delete “${program.title}”?`)) return;
    setBusy(true);
    const { error } = await deleteProgram(program.id);
    setBusy(false);
    if (error) {
      flash(error);
      return;
    }
    navigate("/studio/programs", { replace: true });
  };

  return (
    <main className="studio-page">
      <header className="studio-page-head">
        <div>
          <p className="studio-kicker">Program</p>
          <h1>{program.title}</h1>
          <p className="studio-muted">
            {sessions.length}/{target} sessions ·{" "}
            <span className={`studio-pill studio-pill--${program.status}`}>{program.status}</span>
          </p>
        </div>
        <div className="studio-actions">
          {message ? <span className="studio-flash">{message}</span> : null}
          <Link className="studio-btn studio-btn--ghost" to={`/studio/cms?program=${program.id}`}>
            Open in CMS
          </Link>
          <button
            type="button"
            className="studio-btn studio-btn--accent"
            disabled={busy}
            onClick={() => void onPublish()}
          >
            {program.status === "published" ? "Unpublish" : "Publish"}
          </button>
        </div>
      </header>

      <div className="studio-split-2">
        <form className="studio-panel" onSubmit={(e) => void onSave(e)}>
          <div className="studio-panel-head">
            <h2>Details</h2>
          </div>
          <div className="studio-form studio-form--grid">
            <div className="span-2">
              {user ? (
                <CoverUploader
                  userId={user.id}
                  programId={program.id}
                  coverUrl={coverUrl}
                  onCoverUrl={(url) => void onCoverUrl(url)}
                  disabled={busy}
                />
              ) : null}
            </div>
            <label className="span-2">
              Title
              <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            <label className="span-2">
              Description
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <label>
              Weeks
              <input
                type="number"
                min={1}
                max={16}
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value) || 1)}
              />
            </label>
            <label>
              Days / week
              <input
                type="number"
                min={1}
                max={7}
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Number(e.target.value) || 1)}
              />
            </label>
            <label>
              Minutes
              <input
                type="number"
                min={15}
                max={180}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value) || 45)}
              />
            </label>
            <label>
              Level
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>All levels</option>
              </select>
            </label>
            <label className="span-2">
              Tags (comma-separated)
              <input value={tags} onChange={(e) => setTags(e.target.value)} />
            </label>
            <label className="studio-check span-2">
              <input
                type="checkbox"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
              />
              Mark as premium
            </label>
          </div>
          <div className="studio-actions">
            <button className="studio-btn studio-btn--accent" type="submit" disabled={busy}>
              Save details
            </button>
            <button
              type="button"
              className="studio-btn studio-btn--danger"
              disabled={busy}
              onClick={() => void onDelete()}
            >
              Delete program
            </button>
          </div>
        </form>

        <section className="studio-panel">
          <div className="studio-panel-head">
            <h2>Schedule</h2>
            {missing > 0 ? (
              <button
                type="button"
                className="studio-btn studio-btn--ghost"
                disabled={busy}
                onClick={() => void onFill()}
              >
                Auto-fill {missing} missing
              </button>
            ) : (
              <span className="studio-muted">Complete</span>
            )}
          </div>
          <ul className="studio-table">
            {sessions.map((s) => (
              <li key={s.id}>
                <Link to={`/studio/cms?program=${program.id}&session=${s.id}`}>
                  <span className="studio-table-title">
                    Day {s.day} · {s.title}
                  </span>
                  <span className="studio-table-meta">{s.minutes} min</span>
                </Link>
              </li>
            ))}
          </ul>
          {sessions.length === 0 ? (
            <div className="studio-empty">
              <p>No sessions yet.</p>
              <button
                type="button"
                className="studio-btn studio-btn--accent"
                disabled={busy}
                onClick={() => void onFill()}
              >
                Generate schedule
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
