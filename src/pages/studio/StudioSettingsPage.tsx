import { Link } from "react-router-dom";
import { useAuth } from "../../auth";
import { brand } from "../../brand";
import { isSupabaseConfigured } from "../../lib/supabase";
import { useStudioTour } from "../../tour/StudioTour";

export function StudioSettingsPage() {
  const { user, profile, signOut } = useAuth();
  const { start } = useStudioTour();

  return (
    <main className="studio-page studio-page--narrow">
      <header className="studio-page-head">
        <div>
          <p className="studio-kicker">Account</p>
          <h1>Settings</h1>
        </div>
      </header>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>Creator</h2>
        </div>
        <dl className="studio-dl">
          <div>
            <dt>Name</dt>
            <dd>{profile?.full_name || "—"}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user?.email || "—"}</dd>
          </div>
          <div>
            <dt>Creator slug</dt>
            <dd>{profile?.creator_slug ? `@${profile.creator_slug}` : "Not activated"}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{profile?.is_creator ? "Creator mode on" : "Athlete only"}</dd>
          </div>
          <div>
            <dt>Supabase</dt>
            <dd>{isSupabaseConfigured ? "Connected" : "Missing keys"}</dd>
          </div>
        </dl>
      </section>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>Studio guide</h2>
        </div>
        <p className="studio-muted" style={{ marginBottom: "0.85rem" }}>
          Replay the walkthrough (Next / Skip) when onboarding a new coach — Dashboard through
          Settings.
        </p>
        <button type="button" className="studio-btn studio-btn--accent" onClick={start}>
          Replay Studio tour
        </button>
      </section>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>Links</h2>
        </div>
        <ul className="studio-link-list">
          <li>
            <a href={brand.platformUrl} target="_blank" rel="noreferrer">
              Athlete platform
            </a>
          </li>
          <li>
            <Link to="/">Marketing site</Link>
          </li>
          <li>
            <Link to="/studio/library">Creator onboarding playbook</Link>
          </li>
          <li>
            <a href={brand.social.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </li>
        </ul>
      </section>

      <button type="button" className="studio-btn studio-btn--ghost" onClick={() => void signOut()}>
        Sign out
      </button>
    </main>
  );
}
