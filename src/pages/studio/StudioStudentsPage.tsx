import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth";
import { useT } from "../../i18n";
import type { StudentProgressRow, StudioProgram } from "../../lib/database";
import { fetchCreatorStudentProgress, fetchMyPrograms } from "../../lib/studio";

export function StudioStudentsPage() {
  const { user, profile } = useAuth();
  const t = useT();
  const [rows, setRows] = useState<StudentProgressRow[]>([]);
  const [programs, setPrograms] = useState<StudioProgram[]>([]);
  const [programFilter, setProgramFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [studs, progs] = await Promise.all([
      fetchCreatorStudentProgress(programFilter === "all" ? undefined : programFilter),
      fetchMyPrograms(user.id),
    ]);
    setRows(studs.rows);
    setPrograms(progs.programs);
    setLoading(false);
  }, [user, programFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const sorted = useMemo(
    () => [...rows].sort((a, b) => Number(b.progress_pct) - Number(a.progress_pct)),
    [rows],
  );

  if (!profile?.is_creator) {
    return (
      <main className="studio-page studio-page--narrow">
        <Link to="/studio">{t("common.dashboardBack")}</Link>
      </main>
    );
  }

  return (
    <main className="studio-page">
      <header className="studio-page-head">
        <div>
          <p className="studio-kicker">{t("studio.students.kicker")}</p>
          <h1>{t("studio.students.title")}</h1>
          <p className="studio-muted">{t("studio.students.sub")}</p>
        </div>
      </header>

      <div className="studio-toolbar">
        <select
          className="studio-search"
          aria-label={t("studio.students.allPrograms")}
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
        >
          <option value="all">{t("studio.students.allPrograms")}</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="studio-muted">{t("common.loading")}</p>
      ) : sorted.length === 0 ? (
        <div className="studio-empty">
          <p>{t("studio.students.empty")}</p>
        </div>
      ) : (
        <div className="studio-panel">
          <table className="studio-data">
            <thead>
              <tr>
                <th>{t("studio.students.thAthlete")}</th>
                <th>{t("studio.students.thProgram")}</th>
                <th>{t("studio.students.thProgress")}</th>
                <th>{t("studio.students.thDay")}</th>
                <th>{t("studio.students.thLast")}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.enrollment_id}>
                  <td>
                    <strong>{r.student_name || t("studio.students.athlete")}</strong>
                  </td>
                  <td>{r.program_title}</td>
                  <td>
                    <div className="studio-progress">
                      <i style={{ width: `${Math.min(100, Number(r.progress_pct))}%` }} />
                      <span>{Math.round(Number(r.progress_pct))}%</span>
                    </div>
                  </td>
                  <td>{r.current_day}</td>
                  <td className="studio-muted">
                    {r.last_completed_at
                      ? new Date(r.last_completed_at).toLocaleDateString()
                      : t("common.none")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
