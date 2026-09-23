import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import { createProgram } from "../../lib/studio";
import { PROGRAM_TEMPLATES, buildSessionPlan } from "../../lib/templates";

export function StudioNewProgramPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [templateId, setTemplateId] = useState("bjj-fundamentals");
  const template = PROGRAM_TEMPLATES.find((t) => t.id === templateId) ?? PROGRAM_TEMPLATES[0];

  const [title, setTitle] = useState(template.name);
  const [description, setDescription] = useState("");
  const [weeks, setWeeks] = useState(template.weeks);
  const [daysPerWeek, setDaysPerWeek] = useState(template.daysPerWeek);
  const [minutes, setMinutes] = useState(template.minutes);
  const [level, setLevel] = useState(template.level);
  const [autoSchedule, setAutoSchedule] = useState(true);
  const [seedDrills, setSeedDrills] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = useMemo(
    () => buildSessionPlan(template, weeks, daysPerWeek),
    [template, weeks, daysPerWeek],
  );

  if (!profile?.is_creator) {
    return (
      <main className="studio-page studio-page--narrow">
        <p className="studio-muted">Activate creator mode first.</p>
        <Link to="/studio">← Dashboard</Link>
      </main>
    );
  }

  const pickTemplate = (id: string) => {
    const t = PROGRAM_TEMPLATES.find((x) => x.id === id);
    if (!t) return;
    setTemplateId(id);
    setTitle(t.name);
    setWeeks(t.weeks);
    setDaysPerWeek(t.daysPerWeek);
    setMinutes(t.minutes);
    setLevel(t.level);
    setSeedDrills(id !== "blank");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !profile.creator_slug) return;
    setBusy(true);
    setError(null);
    const { program, error: err } = await createProgram({
      userId: user.id,
      creatorSlug: profile.creator_slug,
      title,
      description,
      weeks,
      daysPerWeek,
      minutes,
      level,
      tags: template.tags,
      templateId,
      autoSchedule,
      seedDrills: seedDrills && templateId !== "blank",
    });
    setBusy(false);
    if (err || !program) {
      setError(err ?? "Could not create program");
      return;
    }
    navigate(`/studio/programs/${program.id}`, { replace: true });
  };

  return (
    <main className="studio-page">
      <header className="studio-page-head">
        <div>
          <p className="studio-kicker">Wizard</p>
          <h1>New program</h1>
          <p className="studio-muted">
            Pick a template — we generate the full calendar and starter drills so you only tweak.
          </p>
        </div>
      </header>

      <form className="wizard" onSubmit={(e) => void onSubmit(e)}>
        <section className="studio-panel">
          <div className="studio-panel-head">
            <h2>1 · Template</h2>
          </div>
          <div className="wizard-templates">
            {PROGRAM_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={t.id === templateId ? "is-active" : undefined}
                onClick={() => pickTemplate(t.id)}
              >
                <strong>{t.name}</strong>
                <span>{t.blurb}</span>
                <em>
                  {t.weeks}w · {t.daysPerWeek}d · {t.sport}
                </em>
              </button>
            ))}
          </div>
        </section>

        <section className="studio-panel">
          <div className="studio-panel-head">
            <h2>2 · Details</h2>
          </div>
          <div className="studio-form studio-form--grid">
            <label className="span-2">
              Title
              <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            <label className="span-2">
              Description
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What athletes will build over this block…"
              />
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
              Session minutes
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
          </div>

          <div className="wizard-toggles">
            <label className="studio-check">
              <input
                type="checkbox"
                checked={autoSchedule}
                onChange={(e) => setAutoSchedule(e.target.checked)}
              />
              Auto-create all {weeks * daysPerWeek} sessions
            </label>
            <label className="studio-check">
              <input
                type="checkbox"
                checked={seedDrills}
                disabled={templateId === "blank"}
                onChange={(e) => setSeedDrills(e.target.checked)}
              />
              Seed starter drills from template
            </label>
          </div>
        </section>

        <section className="studio-panel">
          <div className="studio-panel-head">
            <h2>3 · Preview schedule</h2>
            <span className="studio-muted">{preview.length} sessions</span>
          </div>
          <ol className="wizard-preview">
            {preview.slice(0, 12).map((s) => (
              <li key={s.day}>
                <strong>Day {s.day}</strong>
                <span>{s.title}</span>
                <em>
                  {s.drills.length} drills · {s.minutes}m
                </em>
              </li>
            ))}
            {preview.length > 12 ? (
              <li className="studio-muted">…and {preview.length - 12} more days</li>
            ) : null}
          </ol>
        </section>

        {error ? <p className="studio-error">{error}</p> : null}

        <div className="studio-actions">
          <Link className="studio-btn studio-btn--ghost" to="/studio/programs">
            Cancel
          </Link>
          <button className="studio-btn studio-btn--accent" type="submit" disabled={busy}>
            {busy ? "Building…" : "Create program"}
          </button>
        </div>
      </form>
    </main>
  );
}
