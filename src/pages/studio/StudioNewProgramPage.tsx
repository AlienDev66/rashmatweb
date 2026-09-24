import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import { CoverUploader } from "../../components/CoverUploader";
import { useT } from "../../i18n";
import { uploadProgramCover } from "../../lib/cover";
import { createProgram, updateProgram } from "../../lib/studio";
import { PROGRAM_TEMPLATES, buildSessionPlan } from "../../lib/templates";

export function StudioNewProgramPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const t = useT();
  const [templateId, setTemplateId] = useState("bjj-fundamentals");
  const template = PROGRAM_TEMPLATES.find((x) => x.id === templateId) ?? PROGRAM_TEMPLATES[0];

  const [title, setTitle] = useState(() => t(template.nameKey));
  const [description, setDescription] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [pendingCover, setPendingCover] = useState<File | null>(null);
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
        <p className="studio-muted">{t("studio.wizard.activateFirst")}</p>
        <Link to="/studio">{t("common.dashboardBack")}</Link>
      </main>
    );
  }

  const pickTemplate = (id: string) => {
    const next = PROGRAM_TEMPLATES.find((x) => x.id === id);
    if (!next) return;
    setTemplateId(id);
    setTitle(t(next.nameKey));
    setWeeks(next.weeks);
    setDaysPerWeek(next.daysPerWeek);
    setMinutes(next.minutes);
    setLevel(next.level);
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
    if (err || !program) {
      setBusy(false);
      setError(err ? t(err) : t("errors.createProgram"));
      return;
    }

    if (pendingCover) {
      const { url, error: upErr } = await uploadProgramCover(user.id, program.id, pendingCover);
      if (upErr || !url) {
        setBusy(false);
        setError(upErr ? t(upErr) : t("errors.coverUploadLater"));
        navigate(`/studio/programs/${program.id}`, { replace: true });
        return;
      }
      await updateProgram(program.id, { cover_url: url });
    }

    setBusy(false);
    navigate(`/studio/programs/${program.id}`, { replace: true });
  };

  return (
    <main className="studio-page">
      <header className="studio-page-head">
        <div>
          <p className="studio-kicker">{t("studio.wizard.kicker")}</p>
          <h1>{t("studio.wizard.title")}</h1>
          <p className="studio-muted">{t("studio.wizard.sub")}</p>
        </div>
      </header>

      <form className="wizard" onSubmit={(e) => void onSubmit(e)}>
        <section className="studio-panel">
          <div className="studio-panel-head">
            <h2>{t("studio.wizard.step1")}</h2>
          </div>
          <div className="wizard-templates">
            {PROGRAM_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                className={tpl.id === templateId ? "is-active" : undefined}
                onClick={() => pickTemplate(tpl.id)}
              >
                <strong>{t(tpl.nameKey)}</strong>
                <span>{t(tpl.blurbKey)}</span>
                <em>
                  {t("studio.wizard.templateMeta", {
                    weeks: tpl.weeks,
                    days: tpl.daysPerWeek,
                    sport: t(tpl.sportKey),
                  })}
                </em>
              </button>
            ))}
          </div>
        </section>

        <section className="studio-panel">
          <div className="studio-panel-head">
            <h2>{t("studio.wizard.step2")}</h2>
          </div>
          <div className="studio-form studio-form--grid">
            <div className="span-2">
              {user ? (
                <CoverUploader
                  userId={user.id}
                  coverUrl={coverPreview}
                  onCoverUrl={setCoverPreview}
                  onPendingFile={setPendingCover}
                  disabled={busy}
                />
              ) : null}
            </div>
            <label className="span-2">
              {t("common.title")}
              <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            <label className="span-2">
              {t("common.description")}
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("studio.wizard.descPlaceholder")}
              />
            </label>
            <label>
              {t("common.weeks")}
              <input
                type="number"
                min={1}
                max={16}
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value) || 1)}
              />
            </label>
            <label>
              {t("common.daysPerWeek")}
              <input
                type="number"
                min={1}
                max={7}
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Number(e.target.value) || 1)}
              />
            </label>
            <label>
              {t("studio.wizard.sessionMinutes")}
              <input
                type="number"
                min={15}
                max={180}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value) || 45)}
              />
            </label>
            <label>
              {t("common.level")}
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="Beginner">{t("studio.levels.Beginner")}</option>
                <option value="Intermediate">{t("studio.levels.Intermediate")}</option>
                <option value="Advanced">{t("studio.levels.Advanced")}</option>
                <option value="All levels">{t("studio.levels.All levels")}</option>
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
              {t("studio.wizard.autoCreate", { count: weeks * daysPerWeek })}
            </label>
            <label className="studio-check">
              <input
                type="checkbox"
                checked={seedDrills}
                disabled={templateId === "blank"}
                onChange={(e) => setSeedDrills(e.target.checked)}
              />
              {t("studio.wizard.seedDrills")}
            </label>
          </div>
        </section>

        <section className="studio-panel">
          <div className="studio-panel-head">
            <h2>{t("studio.wizard.step3")}</h2>
            <span className="studio-muted">
              {t("studio.wizard.previewCount", { count: preview.length })}
            </span>
          </div>
          <ol className="wizard-preview">
            {preview.slice(0, 12).map((s) => (
              <li key={s.day}>
                <strong>{t("studio.wizard.previewDay", { day: s.day })}</strong>
                <span>{s.title}</span>
                <em>
                  {t("studio.wizard.previewDrills", {
                    count: s.drills.length,
                    minutes: s.minutes,
                  })}
                </em>
              </li>
            ))}
            {preview.length > 12 ? (
              <li className="studio-muted">
                {t("studio.wizard.previewMore", { count: preview.length - 12 })}
              </li>
            ) : null}
          </ol>
        </section>

        {error ? <p className="studio-error">{error}</p> : null}

        <div className="studio-actions">
          <Link className="studio-btn studio-btn--ghost" to="/studio/programs">
            {t("common.cancel")}
          </Link>
          <button className="studio-btn studio-btn--accent" type="submit" disabled={busy}>
            {busy ? t("studio.wizard.building") : t("studio.wizard.create")}
          </button>
        </div>
      </form>
    </main>
  );
}
