import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../auth";
import { useT } from "../../i18n";
import type { StudioExercise, StudioProgram, StudioSession } from "../../lib/database";
import {
  applyDrillPresets,
  createExercise,
  createSession,
  deleteExercise,
  deleteSession,
  duplicateSession,
  fetchMyPrograms,
  fetchProgramSessions,
  fetchSessionExercises,
  fillProgramSchedule,
  publishProgram,
  reorderExercises,
  updateExercise,
  updateSession,
} from "../../lib/studio";
import { VideoUploader } from "../../components/VideoUploader";
import { getPublishReadiness } from "../../lib/publishGate";
import { DRILL_QUICK_ADDS } from "../../lib/templates";

export function StudioCmsPage() {
  const { user, profile } = useAuth();
  const t = useT();
  const [params, setParams] = useSearchParams();
  const paramProgram = params.get("program") ?? "";
  const paramSession = params.get("session") ?? "";

  const [programs, setPrograms] = useState<StudioProgram[]>([]);
  const [programId, setProgramId] = useState(paramProgram);
  const [sessions, setSessions] = useState<StudioSession[]>([]);
  const [sessionId, setSessionId] = useState(paramSession);
  const [exercises, setExercises] = useState<StudioExercise[]>([]);

  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDesc, setSessionDesc] = useState("");
  const [sessionMinutes, setSessionMinutes] = useState(45);
  const [sessionMux, setSessionMux] = useState("");
  const [sessionVideoUrl, setSessionVideoUrl] = useState("");

  const [drillName, setDrillName] = useState("");
  const [drillReps, setDrillReps] = useState("Reps: 8 8 8");
  const [drillRest, setDrillRest] = useState(60);
  const [drillMux, setDrillMux] = useState("");
  const [drillVideoUrl, setDrillVideoUrl] = useState("");
  const [editingDrill, setEditingDrill] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [programQuery, setProgramQuery] = useState("");

  const selectedProgram = useMemo(
    () => programs.find((p) => p.id === programId) ?? null,
    [programs, programId],
  );

  /** Quick-adds are UI presets, so their names are stored in the creator's language. */
  const quickAdds = useMemo(
    () =>
      DRILL_QUICK_ADDS.map((preset) => ({
        ...preset,
        name: preset.nameKey ? t(preset.nameKey) : preset.name,
      })),
    [t],
  );

  const flash = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 2200);
  };

  const loadPrograms = useCallback(async () => {
    if (!user) return;
    const { programs: list } = await fetchMyPrograms(user.id);
    setPrograms(list);
    if (!programId && list[0]) setProgramId(list[0].id);
  }, [user, programId]);

  useEffect(() => {
    void loadPrograms();
  }, [loadPrograms]);

  useEffect(() => {
    if (paramProgram) setProgramId(paramProgram);
    if (paramSession) setSessionId(paramSession);
  }, [paramProgram, paramSession]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (programId) next.set("program", programId);
    if (sessionId) next.set("session", sessionId);
    setParams(next, { replace: true });
  }, [programId, sessionId, setParams]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!programId) {
        setSessions([]);
        return;
      }
      const { sessions: list } = await fetchProgramSessions(programId);
      if (cancelled) return;
      setSessions(list);
      if (list.length === 0) {
        setSessionId("");
        return;
      }
      if (!list.some((s) => s.id === sessionId)) {
        setSessionId(list[0].id);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [programId, sessionId]);

  const reloadExercises = useCallback(async (sid: string) => {
    const { exercises: list } = await fetchSessionExercises(sid);
    setExercises(list);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!sessionId) {
        setExercises([]);
        setSessionTitle("");
        setSessionDesc("");
        setSessionMinutes(45);
        setSessionMux("");
        setSessionVideoUrl("");
        return;
      }
      const sess = sessions.find((s) => s.id === sessionId);
      setSessionTitle(sess?.title ?? "");
      setSessionDesc(sess?.description ?? "");
      setSessionMinutes(sess?.minutes ?? 45);
      setSessionMux(sess?.mux_playback_id ?? "");
      setSessionVideoUrl(sess?.video_url ?? "");
      const { exercises: list } = await fetchSessionExercises(sessionId);
      if (!cancelled) setExercises(list);
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [sessionId, sessions]);

  if (!profile?.is_creator) {
    return (
      <main className="studio-page studio-page--narrow">
        <p className="studio-muted">{t("studio.cms.activateFirst")}</p>
        <Link to="/studio">{t("common.dashboardBack")}</Link>
      </main>
    );
  }

  const filteredPrograms = programs.filter((p) =>
    p.title.toLowerCase().includes(programQuery.trim().toLowerCase()),
  );

  const onSaveSession = async () => {
    if (!sessionId) return;
    setBusy(true);
    const fallbackTitle = t("studio.cms.sessionFallback");
    const { error } = await updateSession(sessionId, {
      title: sessionTitle.trim() || fallbackTitle,
      description: sessionDesc,
      minutes: sessionMinutes,
      mux_playback_id: sessionMux.trim() || null,
      video_url: sessionVideoUrl.trim() || null,
    });
    setBusy(false);
    if (error) return flash(t(error));
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              title: sessionTitle.trim() || fallbackTitle,
              description: sessionDesc,
              minutes: sessionMinutes,
              mux_playback_id: sessionMux.trim() || null,
              video_url: sessionVideoUrl.trim() || null,
            }
          : s,
      ),
    );
    flash(t("studio.cms.flashSessionSaved"));
  };

  const onAddSession = async () => {
    if (!programId || !selectedProgram) return;
    const nextDay = sessions.reduce((m, s) => Math.max(m, s.day), 0) + 1;
    setBusy(true);
    const { session, error } = await createSession({
      programId,
      title: t("studio.cms.dayTitle", { day: nextDay }),
      day: nextDay,
      minutes: selectedProgram.minutes,
    });
    setBusy(false);
    if (error || !session) return flash(error ? t(error) : t("errors.createSession"));
    setSessions((prev) => [...prev, session]);
    setSessionId(session.id);
    flash(t("studio.cms.flashSessionAdded"));
  };

  const onDuplicateSession = async () => {
    if (!sessionId || !programId) return;
    const nextDay = sessions.reduce((m, s) => Math.max(m, s.day), 0) + 1;
    setBusy(true);
    const { session, error } = await duplicateSession(sessionId, programId, nextDay);
    setBusy(false);
    if (error || !session) return flash(error ? t(error) : t("errors.duplicateSession"));
    setSessions((prev) => [...prev, session].sort((a, b) => a.day - b.day));
    setSessionId(session.id);
    flash(t("studio.cms.flashSessionDuplicated"));
  };

  const onDeleteSession = async () => {
    if (!sessionId) return;
    if (!window.confirm(t("studio.cms.confirmDeleteSession"))) return;
    setBusy(true);
    const { error } = await deleteSession(sessionId);
    setBusy(false);
    if (error) return flash(t(error));
    const next = sessions.filter((s) => s.id !== sessionId);
    setSessions(next);
    setSessionId(next[0]?.id ?? "");
    flash(t("studio.cms.flashSessionDeleted"));
  };

  const onFillSchedule = async () => {
    if (!selectedProgram) return;
    setBusy(true);
    const { created, error } = await fillProgramSchedule(selectedProgram);
    setBusy(false);
    if (error) return flash(t(error));
    const { sessions: list } = await fetchProgramSessions(selectedProgram.id);
    setSessions(list);
    flash(
      created === 1
        ? t("studio.cms.flashFilledOne")
        : t("studio.cms.flashFilled", { count: created }),
    );
  };

  const onAddDrill = async (preset?: { name: string; reps: string; rest_seconds: number }) => {
    if (!sessionId) return;
    const name = preset?.name ?? drillName;
    if (!name.trim()) return;
    setBusy(true);
    const { exercise, error } = await createExercise({
      sessionId,
      name,
      reps: preset?.reps ?? drillReps,
      restSeconds: preset?.rest_seconds ?? drillRest,
      sortOrder: exercises.length,
      muxPlaybackId: preset ? null : drillMux.trim() || null,
      videoUrl: preset ? null : drillVideoUrl.trim() || null,
    });
    setBusy(false);
    if (error || !exercise) return flash(error ? t(error) : t("errors.addDrill"));
    setExercises((prev) => [...prev, exercise]);
    if (!preset) {
      setDrillName("");
      setDrillMux("");
      setDrillVideoUrl("");
    }
    flash(t("studio.cms.flashDrillAdded"));
  };

  const onApplyStarterBlock = async () => {
    if (!sessionId) return;
    setBusy(true);
    const { exercises: created, error } = await applyDrillPresets(
      sessionId,
      quickAdds,
      exercises.length,
    );
    setBusy(false);
    if (error) return flash(t(error));
    setExercises((prev) => [...prev, ...created]);
    flash(t("studio.cms.flashStarterApplied"));
  };

  const onSaveDrill = async (ex: StudioExercise) => {
    setBusy(true);
    const { error } = await updateExercise(ex.id, {
      name: ex.name,
      reps: ex.reps ?? "",
      rest_seconds: ex.rest_seconds,
      mux_playback_id: ex.mux_playback_id,
      video_url: ex.video_url,
    });
    setBusy(false);
    if (error) return flash(t(error));
    setEditingDrill(null);
    flash(t("studio.cms.flashDrillUpdated"));
  };

  const onDeleteDrill = async (id: string) => {
    setBusy(true);
    const { error } = await deleteExercise(id);
    setBusy(false);
    if (error) return flash(t(error));
    const next = exercises.filter((e) => e.id !== id);
    setExercises(next);
    await reorderExercises(next.map((e) => e.id));
  };

  const moveDrill = async (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= exercises.length) return;
    const next = [...exercises];
    const tmp = next[index];
    next[index] = next[j];
    next[j] = tmp;
    setExercises(next);
    setBusy(true);
    await reorderExercises(next.map((e) => e.id));
    setBusy(false);
  };

  const onDuplicateLastDrill = async () => {
    const last = exercises[exercises.length - 1];
    if (!last || !sessionId) return;
    setBusy(true);
    const { exercise, error } = await createExercise({
      sessionId,
      name: t("studio.cms.copySuffix", { name: last.name }),
      reps: last.reps ?? "Reps: 8 8 8",
      restSeconds: last.rest_seconds,
      sortOrder: exercises.length,
      muxPlaybackId: last.mux_playback_id,
      videoUrl: last.video_url,
    });
    setBusy(false);
    if (error || !exercise) return flash(error ? t(error) : t("errors.failed"));
    setExercises((prev) => [...prev, exercise]);
    flash(t("studio.cms.flashDrillDuplicated"));
  };

  const onTogglePublish = async () => {
    if (!selectedProgram) return;
    const next = selectedProgram.status !== "published";
    if (next) {
      const readiness = await getPublishReadiness(selectedProgram);
      if (!readiness.ready) {
        const missing = readiness.checks
          .filter((c) => !c.ok)
          .map((c) => t(`studio.gate.${c.id}.label`));
        flash(t("studio.cms.flashChecklist", { missing: missing.join(" · ") }));
        return;
      }
    }
    setBusy(true);
    const { error } = await publishProgram(selectedProgram.id, next);
    setBusy(false);
    if (error) return flash(t(error));
    setPrograms((prev) =>
      prev.map((p) =>
        p.id === selectedProgram.id ? { ...p, status: next ? "published" : "draft" } : p,
      ),
    );
    flash(next ? t("studio.cms.flashPublished") : t("studio.cms.flashUnpublished"));
  };

  const targetSessions = selectedProgram
    ? selectedProgram.weeks * selectedProgram.days_per_week
    : 0;

  return (
    <main className="studio-page studio-page--wide">
      <header className="studio-page-head">
        <div>
          <p className="studio-kicker">{t("studio.cms.kicker")}</p>
          <h1>{t("studio.cms.title")}</h1>
          <p className="studio-muted">{t("studio.cms.sub")}</p>
        </div>
        <div className="studio-actions">
          {message ? <span className="studio-flash">{message}</span> : null}
          <Link className="studio-btn studio-btn--ghost" to="/studio/programs/new">
            {t("studio.cms.wizard")}
          </Link>
        </div>
      </header>

      <div className="cms-grid">
        <aside className="cms-col">
          <div className="cms-col-head">
            <h2>{t("studio.cms.programs")}</h2>
            <Link to="/studio/programs/new">{t("studio.cms.newProgram")}</Link>
          </div>
          <input
            className="studio-search studio-search--compact"
            placeholder={t("studio.cms.filterPlaceholder")}
            value={programQuery}
            onChange={(e) => setProgramQuery(e.target.value)}
          />
          <ul className="cms-list">
            {filteredPrograms.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={p.id === programId ? "is-active" : undefined}
                  onClick={() => {
                    setProgramId(p.id);
                    setSessionId("");
                  }}
                >
                  <span>{p.title}</span>
                  <em>{t(`studio.status.${p.status}`)}</em>
                </button>
              </li>
            ))}
          </ul>
          {selectedProgram ? (
            <div className="cms-side-actions">
              <p className="studio-muted">
                {t("studio.cms.dayCount", {
                  count: sessions.length,
                  target: targetSessions,
                })}
              </p>
              <button
                type="button"
                className="studio-btn studio-btn--ghost"
                disabled={busy}
                onClick={() => void onFillSchedule()}
              >
                {t("studio.cms.autoFill")}
              </button>
              <button
                type="button"
                className="studio-btn studio-btn--ghost"
                disabled={busy}
                onClick={() => void onTogglePublish()}
              >
                {selectedProgram.status === "published"
                  ? t("common.unpublish")
                  : t("common.publish")}
              </button>
              <Link className="studio-btn studio-btn--ghost" to={`/studio/programs/${selectedProgram.id}`}>
                {t("studio.cms.programDetails")}
              </Link>
            </div>
          ) : null}
        </aside>

        <aside className="cms-col">
          <div className="cms-col-head">
            <h2>{t("studio.cms.sessions")}</h2>
            <button type="button" disabled={!programId || busy} onClick={() => void onAddSession()}>
              {t("studio.cms.addDay")}
            </button>
          </div>
          <ul className="cms-list">
            {sessions.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={s.id === sessionId ? "is-active" : undefined}
                  onClick={() => setSessionId(s.id)}
                >
                  <span>
                    D{s.day} · {s.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {sessionId ? (
            <div className="cms-side-actions">
              <button
                type="button"
                className="studio-btn studio-btn--ghost"
                disabled={busy}
                onClick={() => void onDuplicateSession()}
              >
                {t("studio.cms.duplicateDay")}
              </button>
              <button
                type="button"
                className="studio-btn studio-btn--danger"
                disabled={busy}
                onClick={() => void onDeleteSession()}
              >
                {t("studio.cms.deleteSession")}
              </button>
            </div>
          ) : null}
        </aside>

        <section className="cms-col cms-col--editor">
          {!sessionId ? (
            <p className="studio-muted">{t("studio.cms.selectSession")}</p>
          ) : (
            <>
              <div className="cms-col-head">
                <h2>{t("studio.cms.sessionEditor")}</h2>
              </div>
              <div className="studio-form studio-form--grid">
                <label className="span-2">
                  {t("common.title")}
                  <input value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value)} />
                </label>
                <label className="span-2">
                  {t("studio.cms.notes")}
                  <textarea
                    rows={2}
                    value={sessionDesc}
                    onChange={(e) => setSessionDesc(e.target.value)}
                  />
                </label>
                <label>
                  {t("common.minutes")}
                  <input
                    type="number"
                    min={10}
                    value={sessionMinutes}
                    onChange={(e) => setSessionMinutes(Number(e.target.value) || 45)}
                  />
                </label>
                <div className="span-2">
                  <p className="studio-muted" style={{ marginBottom: "0.35rem" }}>
                    {t("studio.cms.sessionVideo")}
                  </p>
                  <VideoUploader
                    value={{ muxPlaybackId: sessionMux, videoUrl: sessionVideoUrl }}
                    onChange={(next) => {
                      setSessionMux(next.muxPlaybackId);
                      setSessionVideoUrl(next.videoUrl);
                      // Persist immediately after Storage upload so video isn't lost
                      if (sessionId && next.videoUrl) {
                        void updateSession(sessionId, {
                          mux_playback_id: next.muxPlaybackId.trim() || null,
                          video_url: next.videoUrl.trim() || null,
                        }).then(({ error }) => {
                          if (error) flash(t(error));
                          else {
                            setSessions((prev) =>
                              prev.map((s) =>
                                s.id === sessionId
                                  ? {
                                      ...s,
                                      mux_playback_id: next.muxPlaybackId.trim() || null,
                                      video_url: next.videoUrl.trim() || null,
                                    }
                                  : s,
                              ),
                            );
                            flash(t("studio.cms.flashSessionVideoSaved"));
                          }
                        });
                      }
                    }}
                    disabled={busy}
                  />
                </div>
              </div>
              <button
                type="button"
                className="studio-btn studio-btn--accent"
                disabled={busy}
                onClick={() => void onSaveSession()}
              >
                {t("studio.cms.saveSession")}
              </button>

              <div className="cms-col-head cms-col-head--spaced">
                <h2>{t("studio.cms.drills", { count: exercises.length })}</h2>
                <div className="cms-inline-actions">
                  <button type="button" disabled={busy} onClick={() => void onApplyStarterBlock()}>
                    {t("studio.cms.starterBlock")}
                  </button>
                  <button
                    type="button"
                    disabled={busy || exercises.length === 0}
                    onClick={() => void onDuplicateLastDrill()}
                  >
                    {t("studio.cms.duplicateLast")}
                  </button>
                </div>
              </div>

              <div className="cms-quick-drills">
                {quickAdds.map((p) => (
                  <button key={p.name} type="button" disabled={busy} onClick={() => void onAddDrill(p)}>
                    {p.name}
                  </button>
                ))}
              </div>

              <ul className="cms-drills">
                {exercises.map((ex, index) => (
                  <li key={ex.id}>
                    {editingDrill === ex.id ? (
                      <div className="studio-form">
                        <input
                          value={ex.name}
                          aria-label={t("studio.cms.drillName")}
                          onChange={(e) =>
                            setExercises((prev) =>
                              prev.map((x) => (x.id === ex.id ? { ...x, name: e.target.value } : x)),
                            )
                          }
                        />
                        <input
                          value={ex.reps ?? ""}
                          aria-label={t("studio.cms.reps")}
                          onChange={(e) =>
                            setExercises((prev) =>
                              prev.map((x) => (x.id === ex.id ? { ...x, reps: e.target.value } : x)),
                            )
                          }
                        />
                        <input
                          type="number"
                          value={ex.rest_seconds}
                          aria-label={t("studio.cms.rest")}
                          onChange={(e) =>
                            setExercises((prev) =>
                              prev.map((x) =>
                                x.id === ex.id
                                  ? { ...x, rest_seconds: Number(e.target.value) || 0 }
                                  : x,
                              ),
                            )
                          }
                        />
                        <div className="span-2">
                          <p className="studio-muted" style={{ marginBottom: "0.35rem" }}>
                            {t("studio.cms.drillVideo")}
                          </p>
                          <VideoUploader
                            value={{
                              muxPlaybackId: ex.mux_playback_id ?? "",
                              videoUrl: ex.video_url ?? "",
                            }}
                            onChange={(next) => {
                              setExercises((prev) =>
                                prev.map((x) =>
                                  x.id === ex.id
                                    ? {
                                        ...x,
                                        video_url: next.videoUrl.trim() || null,
                                        mux_playback_id: next.muxPlaybackId.trim() || null,
                                      }
                                    : x,
                                ),
                              );
                              if (next.videoUrl) {
                                void updateExercise(ex.id, {
                                  video_url: next.videoUrl.trim() || null,
                                  mux_playback_id: next.muxPlaybackId.trim() || null,
                                }).then(({ error }) => {
                                  if (error) flash(t(error));
                                  else flash(t("studio.cms.flashDrillVideoSaved"));
                                });
                              }
                            }}
                            disabled={busy}
                          />
                        </div>
                        <div className="studio-actions">
                          <button
                            type="button"
                            className="studio-btn studio-btn--accent"
                            onClick={() => void onSaveDrill(ex)}
                          >
                            {t("common.save")}
                          </button>
                          <button
                            type="button"
                            className="studio-btn studio-btn--ghost"
                            onClick={() => {
                              setEditingDrill(null);
                              void reloadExercises(sessionId);
                            }}
                          >
                            {t("common.cancel")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <strong>
                            {index + 1}. {ex.name}
                          </strong>
                          <span>
                            {t("studio.cms.drillMeta", {
                              reps: ex.reps ?? "",
                              seconds: ex.rest_seconds,
                            })}
                          </span>
                          {ex.video_url ? (
                            <em>{t("studio.cms.videoStorage")}</em>
                          ) : ex.mux_playback_id ? (
                            <em>{t("studio.cms.videoMux", { id: ex.mux_playback_id })}</em>
                          ) : null}
                        </div>
                        <div className="cms-drill-actions">
                          <button
                            type="button"
                            disabled={busy}
                            aria-label={t("studio.cms.moveUp")}
                            title={t("studio.cms.moveUp")}
                            onClick={() => void moveDrill(index, -1)}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            aria-label={t("studio.cms.moveDown")}
                            title={t("studio.cms.moveDown")}
                            onClick={() => void moveDrill(index, 1)}
                          >
                            ↓
                          </button>
                          <button type="button" onClick={() => setEditingDrill(ex.id)}>
                            {t("common.edit")}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            aria-label={t("studio.cms.removeDrill")}
                            title={t("studio.cms.removeDrill")}
                            onClick={() => void onDeleteDrill(ex.id)}
                          >
                            ✕
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              <div className="studio-form studio-form--grid cms-add-drill">
                <label>
                  {t("studio.cms.drillName")}
                  <input value={drillName} onChange={(e) => setDrillName(e.target.value)} />
                </label>
                <label>
                  {t("studio.cms.reps")}
                  <input value={drillReps} onChange={(e) => setDrillReps(e.target.value)} />
                </label>
                <label>
                  {t("studio.cms.rest")}
                  <input
                    type="number"
                    value={drillRest}
                    onChange={(e) => setDrillRest(Number(e.target.value) || 0)}
                  />
                </label>
                <div className="span-2">
                  <p className="studio-muted" style={{ marginBottom: "0.35rem" }}>
                    {t("studio.cms.drillVideo")}
                  </p>
                  <VideoUploader
                    value={{ muxPlaybackId: drillMux, videoUrl: drillVideoUrl }}
                    onChange={(next) => {
                      setDrillMux(next.muxPlaybackId);
                      setDrillVideoUrl(next.videoUrl);
                    }}
                    disabled={busy}
                  />
                </div>
                <button
                  type="button"
                  className="studio-btn studio-btn--accent span-2"
                  disabled={busy || !drillName.trim()}
                  onClick={() => void onAddDrill()}
                >
                  {t("studio.cms.addCustom")}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
