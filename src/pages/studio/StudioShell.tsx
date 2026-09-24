import { NavLink, Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../auth";
import { brand } from "../../brand";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { useT } from "../../i18n";
import { StudioTourOverlay, StudioTourProvider, useStudioTour } from "../../tour/StudioTour";

function TourHintButton() {
  const { active, start } = useStudioTour();
  const t = useT();
  if (active) return null;
  return (
    <button type="button" className="studio-tour-launch" onClick={start}>
      {t("studio.guide")}
    </button>
  );
}

function StudioChrome() {
  const { user, profile, signOut } = useAuth();
  const t = useT();

  const nav = [
    { to: "/studio", end: true, label: t("studio.navDashboard"), hint: t("studio.navDashboardHint") },
    { to: "/studio/programs", end: false, label: t("studio.navPrograms"), hint: t("studio.navProgramsHint") },
    { to: "/studio/cms", end: false, label: t("studio.navCms"), hint: t("studio.navCmsHint") },
    { to: "/studio/students", end: false, label: t("studio.navStudents"), hint: t("studio.navStudentsHint") },
    { to: "/studio/followers", end: false, label: t("studio.navFollowers"), hint: t("studio.navFollowersHint") },
    { to: "/studio/library", end: false, label: t("studio.navLibrary"), hint: t("studio.navLibraryHint") },
    { to: "/studio/settings", end: false, label: t("studio.navSettings"), hint: t("studio.navSettingsHint") },
  ] as const;

  return (
    <div className="studio-app">
      <aside className="studio-side">
        <Link className="studio-side-brand" to="/studio">
          <img src="/logo-yellow.png" width={40} height={40} alt="" />
          <div>
            <strong>{brand.name}</strong>
            <span>{t("studio.sideLabel")}</span>
          </div>
        </Link>

        <nav className="studio-side-nav" aria-label="Studio">
          {nav.map((item) => (
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
            <p className="studio-side-meta">{t("studio.creatorOff")}</p>
          )}
          <LanguageSwitcher className="studio-side-lang" />
          <div className="studio-side-actions">
            <TourHintButton />
            <Link to="/">Site</Link>
            <button type="button" onClick={() => void signOut()}>
              {t("studio.signOut")}
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
  const t = useT();

  if (!ready) {
    return (
      <div className="studio-boot">
        <p>{t("common.loading")}</p>
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
        <Link to="/">← {t("common.backHome")}</Link>
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
