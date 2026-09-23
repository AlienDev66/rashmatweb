import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";
import { brand } from "../../brand";

export function StudioLoginPage() {
  const { ready, user, signIn, configured } = useAuth();
  const navigate = useNavigate();
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
      setError(err);
      return;
    }
    navigate("/studio", { replace: true });
  };

  return (
    <div className="studio-auth">
      <Link className="studio-brand" to="/">
        <img src="/logo-yellow.png" width={48} height={48} alt="" />
        <span>
          {brand.name} <em>Studio</em>
        </span>
      </Link>
      <h1>Sign in to publish</h1>
      <p className="studio-muted">
        Same account as the athlete app. Activate creator mode after you sign in.
      </p>
      {!configured ? (
        <p className="studio-error">Supabase keys missing — add web/.env first.</p>
      ) : (
        <form className="studio-form" onSubmit={(e) => void onSubmit(e)}>
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
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
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      )}
    </div>
  );
}
