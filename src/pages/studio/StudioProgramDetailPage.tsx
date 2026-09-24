import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth";
import { CoverUploader } from "../../components/CoverUploader";
import { useT } from "../../i18n";
import type { StudioProgram, StudioSession } from "../../lib/database";
import { getPublishReadiness, type PublishReadiness } from "../../lib/publishGate";
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
  const t = useT();
  const [program, setProgram] = useState<StudioProgram | null>(null);
  const [sessions, setSessions] = useState<StudioSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [gate, setGate] = useState<PublishReadiness | null>(null);

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
      const readiness = await getPublishReadiness(p);
      setGate(readiness);
    } else {
      setGate(null);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!profile?.is_creator) {
    return (
      <main className="studio-page studio-page--narrow">
        <Link to="/studio">{t("common.dashboardBack")}</Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="studio-page">
        <p className="studio-muted">{t("common.loading")}</p>
      </main>
    );
  }

  if (!program) {
    return (
      <main className="studio-page">
        <p className="studio-error">{t("studio.detail.notFound")}</p>
        <Link to="/studio/programs">{t("studio.detail.backPrograms")}</Link>
      </main>
    );
  }

  const target = weeks * daysPerWeek;
  const missing = Math.max(0, target - sessions.length);

  const flash = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 2400);
  };

  const onCoverUrl = async (url: string) => {
    setCoverUrl(url);
    setBusy(true);
    const { error } = await updateProgram(program.id, { cover_url: url });
    setBusy(false);
    if (error) {
      flash(t(error));
      return;
    }
    setProgram({ ...program, cover_url: url });
    flash(t("studio.detail.flashCover"));
    const readiness = await getPublishReadiness({ ...program, cover_url: url });
    setGate(readiness);
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
        .map((tag) => tag.trim())
        .filter(Boolean),
      is_premium: isPremium,
    });
    setBusy(false);
    if (error) {
      flash(t(error));
      return;
    }
    flash(t("studio.detail.flashSaved"));
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
      flash(t(error));
      return;
    }
    flash(
      created === 1
        ? t("studio.detail.flashAddedOne")
        : t("studio.detail.flashAdded", { count: created }),
    );
    await load();
  };

  const onPublish = async () => {
    const next = program.status !== "published";
    setBusy(true);
    const { error } = await publishProgram(program.id, next);
    setBusy(false);
    if (error) {
      flash(t(error));
      return;
    }
    setProgram({ ...program, status: next ? "published" : "draft" });
    flash(next ? t("studio.detail.flashPublished") : t("studio.detail.flashUnpublished"));
  };

  const onDelete = async () => {
    if (!window.confirm(t("studio.detail.confirmDelete", { title: program.title }))) return;
    setBusy(true);
    const { error } = await deleteProgram(program.id);
    setBusy(false);
    if (error) {
      flash(t(error));
      return;
    }
    navigate("/studio/programs", { replace: true });
  };

  return (
    <main className="studio-page">
      <header className="studio-page-head">
        <div>
          <p className="studio-kicker">{t("studio.detail.kicker")}</p>
          <h1>{program.title}</h1>
          <p className="studio-muted">
            {t("studio.detail.sessionsMeta", { count: sessions.length, target })} ·{" "}
            <span className={`studio-pill studio-pill--${program.status}`}>
              {t(`studio.status.${program.status}`)}
            </span>
          </p>
        </div>
        <div className="studio-actions">
          {message ? <span className="studio-flash">{message}</span> : null}
          {program.status === "published" ? (
            <a className="studio-btn studio-btn--ghost" href={`/p/${program.id}`} target="_blank" rel="noreferrer">
              {t("studio.detail.shareLink")}
            </a>
          ) : null}
          <Link className="studio-btn studio-btn--ghost" to={`/studio/cms?program=${program.id}`}>
            {t("studio.detail.openCms")}
          </Link>
          <button
            type="button"
            className="studio-btn studio-btn--accent"
            disabled={busy || (program.status !== "published" && gate !== null && !gate.ready)}
            onClick={() => void onPublish()}
            title={
              gate && !gate.ready && program.status !== "published"
                ? t("studio.detail.publishHint")
                : undefined
            }
          >
            {program.status === "published" ? t("common.unpublish") : t("common.publish")}
          </button>
        </div>
      </header>

      {gate ? (
        <section className="studio-panel publish-gate">
          <div className="studio-panel-head">
            <h2>{t("studio.detail.checklistTitle")}</h2>
            <span className={gate.ready ? "studio-flash" : "studio-muted"}>
              {gate.ready ? t("studio.detail.ready") : t("studio.detail.incomplete")}
            </span>
          </div>
          <ul className="publish-checks">
            {gate.checks.map((c) => (
              <li key={c.id} className={c.ok ? "is-ok" : "is-miss"}>
                <strong>{c.ok ? "✓" : "○"}</strong>
                <div>
                  <span>{t(`studio.gate.${c.id}.label`)}</span>
                  {!c.ok ? <em>{c.hint ?? t(`studio.gate.${c.id}.hint`)}</em> : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="studio-split-2">
        <form className="studio-panel" onSubmit={(e) => void onSave(e)}>
          <div className="studio-panel-head">
            <h2>{t("studio.detail.details")}</h2>
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
              {t("common.title")}
              <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            <label className="span-2">
              {t("common.description")}
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
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
              {t("common.minutes")}
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
            <label className="span-2">
              {t("studio.detail.tags")}
              <input value={tags} onChange={(e) => setTags(e.target.value)} />
            </label>
            <label className="studio-check span-2">
              <input
                type="checkbox"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
              />
              {t("studio.detail.premium")}
            </label>
          </div>
          <div className="studio-actions">
            <button className="studio-btn studio-btn--accent" type="submit" disabled={busy}>
              {t("studio.detail.saveDetails")}
            </button>
            <button
              type="button"
              className="studio-btn studio-btn--danger"
              disabled={busy}
              onClick={() => void onDelete()}
            >
              {t("studio.detail.deleteProgram")}
            </button>
          </div>
        </form>

        <section className="studio-panel">
          <div className="studio-panel-head">
            <h2>{t("studio.detail.schedule")}</h2>
            {missing > 0 ? (
              <button
                type="button"
                className="studio-btn studio-btn--ghost"
                disabled={busy}
                onClick={() => void onFill()}
              >
                {t("studio.detail.autoFillMissing", { count: missing })}
              </button>
            ) : (
              <span className="studio-muted">{t("studio.detail.complete")}</span>
            )}
          </div>
          <ul className="studio-table">
            {sessions.map((s) => (
              <li key={s.id}>
                <Link to={`/studio/cms?program=${program.id}&session=${s.id}`}>
                  <span className="studio-table-title">
                    {t("studio.detail.dayTitle", { day: s.day, title: s.title })}
                  </span>
                  <span className="studio-table-meta">
                    {t("studio.detail.minutesMeta", { minutes: s.minutes })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {sessions.length === 0 ? (
            <div className="studio-empty">
              <p>{t("studio.detail.noSessions")}</p>
              <button
                type="button"
                className="studio-btn studio-btn--accent"
                disabled={busy}
                onClick={() => void onFill()}
              >
                {t("studio.detail.generateSchedule")}
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
