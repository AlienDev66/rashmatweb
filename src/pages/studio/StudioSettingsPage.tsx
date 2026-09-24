import { Link } from "react-router-dom";
import { useAuth } from "../../auth";
import { brand } from "../../brand";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { useT } from "../../i18n";
import { isSupabaseConfigured } from "../../lib/supabase";
import { useStudioTour } from "../../tour/StudioTour";

export function StudioSettingsPage() {
  const { user, profile, signOut } = useAuth();
  const { start } = useStudioTour();
  const t = useT();

  return (
    <main className="studio-page studio-page--narrow">
      <header className="studio-page-head">
        <div>
          <p className="studio-kicker">{t("studio.settingsKicker")}</p>
          <h1>{t("studio.settingsTitle")}</h1>
        </div>
      </header>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>{t("studio.settingsLanguage")}</h2>
        </div>
        <p className="studio-muted" style={{ marginBottom: "0.85rem" }}>
          {t("studio.settingsLanguageHint")}
        </p>
        <LanguageSwitcher variant="select" />
      </section>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>{t("studio.settingsAccount")}</h2>
        </div>
        <dl className="studio-dl">
          <div>
            <dt>{t("studio.settingsName")}</dt>
            <dd>{profile?.full_name || "—"}</dd>
          </div>
          <div>
            <dt>{t("common.email")}</dt>
            <dd>{user?.email || "—"}</dd>
          </div>
          <div>
            <dt>{t("studio.settingsSlug")}</dt>
            <dd>{profile?.creator_slug ? `@${profile.creator_slug}` : "—"}</dd>
          </div>
          <div>
            <dt>{t("studio.settingsStatus")}</dt>
            <dd>{profile?.is_creator ? t("studio.settingsCreatorOn") : t("studio.creatorOff")}</dd>
          </div>
          <div>
            <dt>Supabase</dt>
            <dd>{isSupabaseConfigured ? "OK" : "—"}</dd>
          </div>
        </dl>
      </section>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>{t("studio.guide")}</h2>
        </div>
        <button type="button" className="studio-btn studio-btn--accent" onClick={start}>
          {t("studio.guide")}
        </button>
      </section>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>{t("studio.settingsLinks")}</h2>
        </div>
        <ul className="studio-link-list">
          <li>
            <a href={brand.platformUrl} target="_blank" rel="noreferrer">
              {t("common.platform")}
            </a>
          </li>
          <li>
            <Link to="/">{brand.domain}</Link>
          </li>
          <li>
            <Link to="/studio/library">{t("studio.navLibrary")}</Link>
          </li>
          <li>
            <a href={brand.social.instagram} target="_blank" rel="noreferrer">
              {t("common.instagram")}
            </a>
          </li>
        </ul>
      </section>

      <button type="button" className="studio-btn studio-btn--ghost" onClick={() => void signOut()}>
        {t("studio.signOut")}
      </button>
    </main>
  );
}
