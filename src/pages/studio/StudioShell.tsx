import { NavLink, Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../auth";
import { brand } from "../../brand";
import { StudioTourOverlay, StudioTourProvider, useStudioTour } from "../../tour/StudioTour";

const NAV = [
  { to: "/studio", end: true, label: "Dashboard", hint: "Overview" },
  { to: "/studio/programs", end: false, label: "Programs", hint: "Catalog" },
  { to: "/studio/cms", end: false, label: "CMS", hint: "Editor" },
  { to: "/studio/students", end: false, label: "Students", hint: "Progress" },
  { to: "/studio/library", end: false, label: "Library", hint: "Templates" },
  { to: "/studio/settings", end: false, label: "Settings", hint: "Account" },
] as const;

function TourHintButton() {
  const { active, start } = useStudioTour();
  if (active) return null;
  return (
    <button type="button" className="studio-tour-launch" onClick={start}>
      Guide
    </button>
  );
}

function StudioChrome() {
  const { user, profile, signOut } = useAuth();

  return (
    <div className="studio-app">
      <aside className="studio-side">
        <Link className="studio-side-brand" to="/studio">
          <img src="/logo-yellow.png" width={40} height={40} alt="" />
          <div>
            <strong>{brand.name}</strong>
            <span>Creator Studio</span>
          </div>
        </Link>

        <nav className="studio-side-nav" aria-label="Studio">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
            >
              <span>{item.label}</span>
              <em>{item.hint}</em>
            </NavLink>
          ))}
        </nav>

        <div className="studio-side-foot">
          <p className="studio-side-user">{profile?.full_name || user?.email}</p>
          {profile?.is_creator ? (
            <p className="studio-side-meta">@{profile.creator_slug}</p>
          ) : (
            <p className="studio-side-meta">Creator mode off</p>
          )}
          <div className="studio-side-actions">
            <TourHintButton />
            <Link to="/">Site</Link>
            <button type="button" onClick={() => void signOut()}>
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="studio-body">
        <Outlet />
      </div>
      <StudioTourOverlay />
    </div>
  );
}

export function StudioShell() {
  const { ready, user, profile, configured } = useAuth();

  if (!ready) {
    return (
      <div className="studio-boot">
        <p>Loading Studio…</p>
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="studio-boot">
        <h1>Studio</h1>
        <p>
          Copy <code>.env.example</code> → <code>.env</code> with your Supabase URL and anon key,
          then restart <code>bun run dev</code>.
        </p>
        <Link to="/">← Back to site</Link>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/studio/login" replace />;
  }

  return (
    <StudioTourProvider enabled={Boolean(profile?.is_creator)}>
      <StudioChrome />
    </StudioTourProvider>
  );
}
