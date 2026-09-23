import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth";
import type { StudentProgressRow, StudioProgram } from "../../lib/database";
import { fetchCreatorStudentProgress, fetchMyPrograms } from "../../lib/studio";

export function StudioStudentsPage() {
  const { user, profile } = useAuth();
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
        <Link to="/studio">← Dashboard</Link>
      </main>
    );
  }

  return (
    <main className="studio-page">
      <header className="studio-page-head">
        <div>
          <p className="studio-kicker">Retention</p>
          <h1>Students</h1>
          <p className="studio-muted">Who enrolled, how far they are, last completion.</p>
        </div>
      </header>

      <div className="studio-toolbar">
        <select
          className="studio-search"
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
        >
          <option value="all">All programs</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="studio-muted">Loading…</p>
      ) : sorted.length === 0 ? (
        <div className="studio-empty">
          <p>No students yet. Publish a program and share it from the athlete app.</p>
        </div>
      ) : (
        <div className="studio-panel">
          <table className="studio-data">
            <thead>
              <tr>
                <th>Athlete</th>
                <th>Program</th>
                <th>Progress</th>
                <th>Day</th>
                <th>Last session</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.enrollment_id}>
                  <td>
                    <strong>{r.student_name || "Athlete"}</strong>
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
                      : "—"}
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
