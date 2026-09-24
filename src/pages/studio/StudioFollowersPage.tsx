import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth";
import { fetchMyCreatorFollowers, type CreatorFollowerRow } from "../../lib/studio";

export function StudioFollowersPage() {
  const { profile } = useAuth();
  const [rows, setRows] = useState<CreatorFollowerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchMyCreatorFollowers();
    setRows(res.rows);
    setError(res.error);
    setLoading(false);
  }, []);

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

  return (
    <main className="studio-page">
      <header className="studio-page-head">
        <div>
          <p className="studio-kicker">Audience</p>
          <h1>Followers</h1>
          <p className="studio-muted">
            Athletes who follow your creator profile — separate from students enrolled in a camp.
          </p>
        </div>
      </header>

      {error ? <p className="studio-error">{error}</p> : null}

      {loading ? (
        <p className="studio-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="studio-empty">
          <p>No followers yet. Athletes tap Follow on your profile in the app.</p>
        </div>
      ) : (
        <div className="studio-panel">
          <p className="studio-muted" style={{ marginBottom: "1rem" }}>
            {rows.length} follower{rows.length === 1 ? "" : "s"}
          </p>
          <table className="studio-data">
            <thead>
              <tr>
                <th>Athlete</th>
                <th>Followed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.user_id}>
                  <td>
                    <div className="studio-person">
                      {r.avatar_url ? (
                        <img src={r.avatar_url} alt="" width={32} height={32} />
                      ) : (
                        <span className="studio-avatar-fallback">{r.full_name.slice(0, 1)}</span>
                      )}
                      <strong>{r.full_name}</strong>
                    </div>
                  </td>
                  <td>{new Date(r.followed_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
