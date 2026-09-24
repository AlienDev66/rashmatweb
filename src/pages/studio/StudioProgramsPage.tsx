import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import { useT } from "../../i18n";
import type { StudioProgram } from "../../lib/database";
import {
  deleteProgram,
  duplicateProgram,
  fetchMyPrograms,
  publishProgram,
} from "../../lib/studio";
import { getPublishReadiness } from "../../lib/publishGate";

export function StudioProgramsPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const t = useT();
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
        <p className="studio-muted">{t("studio.programs.activateFirst")}</p>
        <Link to="/studio">{t("common.dashboardBack")}</Link>
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
      window.alert(error ? t(error) : t("errors.duplicateProgram"));
      return;
    }
    await load();
    navigate(`/studio/programs/${program.id}`);
  };

  const onToggle = async (p: StudioProgram) => {
    const next = p.status !== "published";
    if (next) {
      const readiness = await getPublishReadiness(p);
      if (!readiness.ready) {
        const missing = readiness.checks
          .filter((c) => !c.ok)
          .map((c) => t(`studio.gate.${c.id}.label`));
        window.alert(`${t("studio.programs.checklistAlert")}\n• ${missing.join("\n• ")}`);
        return;
      }
    }
    setBusyId(p.id);
    const { error } = await publishProgram(p.id, next);
    setBusyId(null);
    if (error) {
      window.alert(t(error));
      return;
    }
    setPrograms((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, status: next ? "published" : "draft" } : x)),
    );
  };

  const onDelete = async (p: StudioProgram) => {
    if (!window.confirm(t("studio.programs.confirmDelete", { title: p.title }))) return;
    setBusyId(p.id);
    const { error } = await deleteProgram(p.id);
    setBusyId(null);
    if (error) {
      window.alert(t(error));
      return;
    }
    setPrograms((prev) => prev.filter((x) => x.id !== p.id));
  };

  return (
    <main className="studio-page">
      <header className="studio-page-head">
        <div>
          <p className="studio-kicker">{t("studio.programs.kicker")}</p>
          <h1>{t("studio.programs.title")}</h1>
        </div>
        <Link className="studio-btn studio-btn--accent" to="/studio/programs/new">
          {t("studio.newProgram")}
        </Link>
      </header>

      <div className="studio-toolbar">
        <input
          className="studio-search"
          placeholder={t("studio.programs.searchPlaceholder")}
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
              {t(`studio.filter.${f}`)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="studio-muted">{t("common.loading")}</p>
      ) : filtered.length === 0 ? (
        <div className="studio-empty">
          <p>{t("studio.programs.emptyMatch")}</p>
          <Link className="studio-btn studio-btn--accent" to="/studio/programs/new">
            {t("studio.programs.createOne")}
          </Link>
        </div>
      ) : (
        <ul className="studio-card-list">
          {filtered.map((p) => (
            <li key={p.id} className="studio-card">
              <div
                className="studio-card-cover"
                style={
                  p.cover_url
                    ? { ["--cover" as string]: `url('${p.cover_url}')` }
                    : undefined
                }
              />
              <div className="studio-card-main">
                <Link to={`/studio/programs/${p.id}`} className="studio-card-title">
                  {p.title}
                </Link>
                <p className="studio-muted">
                  {t("studio.programs.meta", {
                    weeks: p.weeks,
                    days: p.days_per_week,
                    minutes: p.minutes,
                    level: t(`studio.levels.${p.level}`),
                  })}
                </p>
                <div className="studio-tags">
                  <span className={`studio-pill studio-pill--${p.status}`}>
                    {t(`studio.status.${p.status}`)}
                  </span>
                  {p.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="studio-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="studio-card-actions">
                <Link className="studio-btn studio-btn--ghost" to={`/studio/cms?program=${p.id}`}>
                  {t("studio.programs.cms")}
                </Link>
                <button
                  type="button"
                  className="studio-btn studio-btn--ghost"
                  disabled={busyId === p.id}
                  onClick={() => void onToggle(p)}
                >
                  {p.status === "published" ? t("common.unpublish") : t("common.publish")}
                </button>
                <button
                  type="button"
                  className="studio-btn studio-btn--ghost"
                  disabled={busyId === p.id}
                  onClick={() => void onDuplicate(p.id)}
                >
                  {t("common.duplicate")}
                </button>
                <button
                  type="button"
                  className="studio-btn studio-btn--danger"
                  disabled={busyId === p.id}
                  onClick={() => void onDelete(p)}
                >
                  {t("common.delete")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
