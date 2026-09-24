import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import { brand } from "../../brand";
import { useT } from "../../i18n";

export function StudioLoginPage() {
  const { ready, user, signIn, configured } = useAuth();
  const navigate = useNavigate();
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (ready && user) return <Navigate to="/studio" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const err = await signIn(email.trim(), password);
    setBusy(false);
    if (err) {
      setError(t(err));
      return;
    }
    navigate("/studio", { replace: true });
  };

  return (
    <div className="studio-auth">
      <Link className="studio-brand" to="/">
        <img src="/logo-yellow.png" width={48} height={48} alt="" />
        <span>
          {brand.name} <em>{t("common.studio")}</em>
        </span>
      </Link>
      <h1>{t("studio.login.title")}</h1>
      <p className="studio-muted">{t("studio.login.sub")}</p>
      {!configured ? (
        <p className="studio-error">{t("errors.supabaseKeys")}</p>
      ) : (
        <form className="studio-form" onSubmit={(e) => void onSubmit(e)}>
          <label>
            {t("common.email")}
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            {t("common.password")}
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error ? <p className="studio-error">{error}</p> : null}
          <button className="studio-btn studio-btn--accent" type="submit" disabled={busy}>
            {busy ? t("studio.login.signingIn") : t("studio.login.signIn")}
          </button>
        </form>
      )}
    </div>
  );
}
