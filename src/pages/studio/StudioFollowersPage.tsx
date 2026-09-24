import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth";
import { useT } from "../../i18n";
import { fetchMyCreatorFollowers, type CreatorFollowerRow } from "../../lib/studio";

export function StudioFollowersPage() {
  const { profile } = useAuth();
  const t = useT();
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
        <Link to="/studio">{t("common.dashboardBack")}</Link>
      </main>
    );
  }

  return (
    <main className="studio-page">
      <header className="studio-page-head">
        <div>
          <p className="studio-kicker">{t("studio.followers.kicker")}</p>
          <h1>{t("studio.followers.title")}</h1>
          <p className="studio-muted">{t("studio.followers.sub")}</p>
        </div>
      </header>

      {error ? <p className="studio-error">{t(error)}</p> : null}

      {loading ? (
        <p className="studio-muted">{t("common.loading")}</p>
      ) : rows.length === 0 ? (
        <div className="studio-empty">
          <p>{t("studio.followers.empty")}</p>
        </div>
      ) : (
        <div className="studio-panel">
          <p className="studio-muted" style={{ marginBottom: "1rem" }}>
            {rows.length === 1
              ? t("studio.followers.countOne")
              : t("studio.followers.count", { count: rows.length })}
          </p>
          <table className="studio-data">
            <thead>
              <tr>
                <th>{t("studio.followers.thAthlete")}</th>
                <th>{t("studio.followers.thFollowed")}</th>
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
