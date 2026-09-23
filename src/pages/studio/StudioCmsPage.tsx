import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../auth";
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
        <p className="studio-muted">Activate creator mode first.</p>
        <Link to="/studio">← Dashboard</Link>
      </main>
    );
  }

  const filteredPrograms = programs.filter((p) =>
    p.title.toLowerCase().includes(programQuery.trim().toLowerCase()),
  );

  const onSaveSession = async () => {
    if (!sessionId) return;
    setBusy(true);
    const { error } = await updateSession(sessionId, {
      title: sessionTitle.trim() || "Session",
      description: sessionDesc,
      minutes: sessionMinutes,
      mux_playback_id: sessionMux.trim() || null,
      video_url: sessionVideoUrl.trim() || null,
    });
    setBusy(false);
    if (error) return flash(error);
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              title: sessionTitle.trim() || "Session",
              description: sessionDesc,
              minutes: sessionMinutes,
              mux_playback_id: sessionMux.trim() || null,
              video_url: sessionVideoUrl.trim() || null,
            }
          : s,
      ),
    );
    flash("Session saved");
  };

  const onAddSession = async () => {
    if (!programId || !selectedProgram) return;
    const nextDay = sessions.reduce((m, s) => Math.max(m, s.day), 0) + 1;
    setBusy(true);
    const { session, error } = await createSession({
      programId,
      title: `Day ${nextDay}`,
      day: nextDay,
      minutes: selectedProgram.minutes,
    });
    setBusy(false);
    if (error || !session) return flash(error ?? "Could not create session");
    setSessions((prev) => [...prev, session]);
    setSessionId(session.id);
    flash("Session added");
  };

  const onDuplicateSession = async () => {
    if (!sessionId || !programId) return;
    const nextDay = sessions.reduce((m, s) => Math.max(m, s.day), 0) + 1;
    setBusy(true);
    const { session, error } = await duplicateSession(sessionId, programId, nextDay);
    setBusy(false);
    if (error || !session) return flash(error ?? "Duplicate failed");
    setSessions((prev) => [...prev, session].sort((a, b) => a.day - b.day));
    setSessionId(session.id);
    flash("Session duplicated with drills");
  };

  const onDeleteSession = async () => {
    if (!sessionId) return;
    if (!window.confirm("Delete this session and its drills?")) return;
    setBusy(true);
    const { error } = await deleteSession(sessionId);
    setBusy(false);
    if (error) return flash(error);
    const next = sessions.filter((s) => s.id !== sessionId);
    setSessions(next);
    setSessionId(next[0]?.id ?? "");
    flash("Session deleted");
  };

  const onFillSchedule = async () => {
    if (!selectedProgram) return;
    setBusy(true);
    const { created, error } = await fillProgramSchedule(selectedProgram);
    setBusy(false);
    if (error) return flash(error);
    const { sessions: list } = await fetchProgramSessions(selectedProgram.id);
    setSessions(list);
    flash(`Filled ${created} missing day${created === 1 ? "" : "s"}`);
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
    if (error || !exercise) return flash(error ?? "Could not add drill");
    setExercises((prev) => [...prev, exercise]);
    if (!preset) {
      setDrillName("");
      setDrillMux("");
      setDrillVideoUrl("");
    }
    flash("Drill added");
  };

  const onApplyStarterBlock = async () => {
    if (!sessionId) return;
    setBusy(true);
    const { exercises: created, error } = await applyDrillPresets(
      sessionId,
      DRILL_QUICK_ADDS,
      exercises.length,
    );
    setBusy(false);
    if (error) return flash(error);
    setExercises((prev) => [...prev, ...created]);
    flash("Starter block applied");
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
    if (error) return flash(error);
    setEditingDrill(null);
    flash("Drill updated");
  };

  const onDeleteDrill = async (id: string) => {
    setBusy(true);
    const { error } = await deleteExercise(id);
    setBusy(false);
    if (error) return flash(error);
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
      name: `${last.name} (copy)`,
      reps: last.reps ?? "Reps: 8 8 8",
      restSeconds: last.rest_seconds,
      sortOrder: exercises.length,
      muxPlaybackId: last.mux_playback_id,
      videoUrl: last.video_url,
    });
    setBusy(false);
    if (error || !exercise) return flash(error ?? "Failed");
    setExercises((prev) => [...prev, exercise]);
    flash("Drill duplicated");
  };

  const onTogglePublish = async () => {
    if (!selectedProgram) return;
    const next = selectedProgram.status !== "published";
    if (next) {
      const readiness = await getPublishReadiness(selectedProgram);
      if (!readiness.ready) {
        const missing = readiness.checks.filter((c) => !c.ok).map((c) => c.label);
        flash(`Finish checklist: ${missing.join(" · ")}`);
        return;
      }
    }
    setBusy(true);
    const { error } = await publishProgram(selectedProgram.id, next);
    setBusy(false);
    if (error) return flash(error);
    setPrograms((prev) =>
      prev.map((p) =>
        p.id === selectedProgram.id ? { ...p, status: next ? "published" : "draft" } : p,
      ),
    );
    flash(next ? "Published" : "Unpublished");
  };

  const targetSessions = selectedProgram
    ? selectedProgram.weeks * selectedProgram.days_per_week
    : 0;

  return (
    <main className="studio-page studio-page--wide">
      <header className="studio-page-head">
        <div>
          <p className="studio-kicker">Editor</p>
          <h1>CMS</h1>
          <p className="studio-muted">
            Programs → sessions → drills. Quick-adds and duplicates keep you out of busywork.
          </p>
        </div>
        <div className="studio-actions">
          {message ? <span className="studio-flash">{message}</span> : null}
          <Link className="studio-btn studio-btn--ghost" to="/studio/programs/new">
            Wizard
          </Link>
        </div>
      </header>

      <div className="cms-grid">
        <aside className="cms-col">
          <div className="cms-col-head">
            <h2>Programs</h2>
            <Link to="/studio/programs/new">+ New</Link>
          </div>
          <input
            className="studio-search studio-search--compact"
            placeholder="Filter…"
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
                  <em>{p.status}</em>
                </button>
              </li>
            ))}
          </ul>
          {selectedProgram ? (
            <div className="cms-side-actions">
              <p className="studio-muted">
                {sessions.length}/{targetSessions} days
              </p>
              <button
                type="button"
                className="studio-btn studio-btn--ghost"
                disabled={busy}
                onClick={() => void onFillSchedule()}
              >
                Auto-fill missing days
              </button>
              <button
                type="button"
                className="studio-btn studio-btn--ghost"
                disabled={busy}
                onClick={() => void onTogglePublish()}
              >
                {selectedProgram.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <Link className="studio-btn studio-btn--ghost" to={`/studio/programs/${selectedProgram.id}`}>
                Program details
              </Link>
            </div>
          ) : null}
        </aside>

        <aside className="cms-col">
          <div className="cms-col-head">
            <h2>Sessions</h2>
            <button type="button" disabled={!programId || busy} onClick={() => void onAddSession()}>
              + Day
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
                Duplicate day + drills
              </button>
              <button
                type="button"
                className="studio-btn studio-btn--danger"
                disabled={busy}
                onClick={() => void onDeleteSession()}
              >
                Delete session
              </button>
            </div>
          ) : null}
        </aside>

        <section className="cms-col cms-col--editor">
          {!sessionId ? (
            <p className="studio-muted">Select or create a session.</p>
          ) : (
            <>
              <div className="cms-col-head">
                <h2>Session editor</h2>
              </div>
              <div className="studio-form studio-form--grid">
                <label className="span-2">
                  Title
                  <input value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value)} />
                </label>
                <label className="span-2">
                  Notes for athletes
                  <textarea
                    rows={2}
                    value={sessionDesc}
                    onChange={(e) => setSessionDesc(e.target.value)}
                  />
                </label>
                <label>
                  Minutes
                  <input
                    type="number"
                    min={10}
                    value={sessionMinutes}
                    onChange={(e) => setSessionMinutes(Number(e.target.value) || 45)}
                  />
                </label>
                <div className="span-2">
                  <p className="studio-muted" style={{ marginBottom: "0.35rem" }}>
                    Session video
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
                          if (error) flash(error);
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
                            flash("Session video saved");
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
                Save session
              </button>

              <div className="cms-col-head cms-col-head--spaced">
                <h2>Drills ({exercises.length})</h2>
                <div className="cms-inline-actions">
                  <button type="button" disabled={busy} onClick={() => void onApplyStarterBlock()}>
                    + Starter block
                  </button>
                  <button
                    type="button"
                    disabled={busy || exercises.length === 0}
                    onClick={() => void onDuplicateLastDrill()}
                  >
                    Duplicate last
                  </button>
                </div>
              </div>

              <div className="cms-quick-drills">
                {DRILL_QUICK_ADDS.map((p) => (
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
                          onChange={(e) =>
                            setExercises((prev) =>
                              prev.map((x) => (x.id === ex.id ? { ...x, name: e.target.value } : x)),
                            )
                          }
                        />
                        <input
                          value={ex.reps ?? ""}
                          onChange={(e) =>
                            setExercises((prev) =>
                              prev.map((x) => (x.id === ex.id ? { ...x, reps: e.target.value } : x)),
                            )
                          }
                        />
                        <input
                          type="number"
                          value={ex.rest_seconds}
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
                            Drill video
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
                                  if (error) flash(error);
                                  else flash("Drill video saved");
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
                            Save
                          </button>
                          <button
                            type="button"
                            className="studio-btn studio-btn--ghost"
                            onClick={() => {
                              setEditingDrill(null);
                              void reloadExercises(sessionId);
                            }}
                          >
                            Cancel
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
                            {ex.reps} · rest {ex.rest_seconds}s
                          </span>
                          {ex.video_url ? (
                            <em>Video · Storage</em>
                          ) : ex.mux_playback_id ? (
                            <em>Mux · {ex.mux_playback_id}</em>
                          ) : null}
                        </div>
                        <div className="cms-drill-actions">
                          <button type="button" disabled={busy} onClick={() => void moveDrill(index, -1)}>
                            ↑
                          </button>
                          <button type="button" disabled={busy} onClick={() => void moveDrill(index, 1)}>
                            ↓
                          </button>
                          <button type="button" onClick={() => setEditingDrill(ex.id)}>
                            Edit
                          </button>
                          <button type="button" disabled={busy} onClick={() => void onDeleteDrill(ex.id)}>
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
                  Drill name
                  <input value={drillName} onChange={(e) => setDrillName(e.target.value)} />
                </label>
                <label>
                  Reps / scheme
                  <input value={drillReps} onChange={(e) => setDrillReps(e.target.value)} />
                </label>
                <label>
                  Rest (sec)
                  <input
                    type="number"
                    value={drillRest}
                    onChange={(e) => setDrillRest(Number(e.target.value) || 0)}
                  />
                </label>
                <div className="span-2">
                  <p className="studio-muted" style={{ marginBottom: "0.35rem" }}>
                    Drill video
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
                  Add custom drill
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
