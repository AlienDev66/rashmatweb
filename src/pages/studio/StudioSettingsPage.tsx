import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../auth";
import { brand } from "../../brand";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { useT } from "../../i18n";
import { startStripeConnectOnboarding, creatorPayoutsReady, stripeModeForBrowser } from "../../lib/stripeConnect";
import { useStudioTour } from "../../tour/StudioTour";

export function StudioSettingsPage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { start } = useStudioTour();
  const t = useT();
  const [params] = useSearchParams();
  const [stripeBusy, setStripeBusy] = useState(false);
  const [stripeMsg, setStripeMsg] = useState<string | null>(null);

  useEffect(() => {
    const stripe = params.get("stripe");
    if (stripe === "return" || stripe === "refresh") {
      void refreshProfile();
      setStripeMsg(
        stripe === "return" ? t("studio.stripe.returnOk") : t("studio.stripe.refreshHint"),
      );
    }
  }, [params, refreshProfile, t]);

  const onConnectStripe = async () => {
    setStripeBusy(true);
    setStripeMsg(null);
    const result = await startStripeConnectOnboarding();
    setStripeBusy(false);
    if (result.error) {
      setStripeMsg(result.error.startsWith("errors.") ? t(result.error) : result.error);
      return;
    }
    if (result.ready) {
      await refreshProfile();
      setStripeMsg(t("studio.stripe.ready"));
      return;
    }
    if (result.url) {
      window.location.href = result.url;
      return;
    }
    setStripeMsg(t("studio.stripe.failed"));
  };

  const payoutsReady = creatorPayoutsReady(profile);
  const stripeMode = stripeModeForBrowser();

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
          <h2>{t("studio.stripe.title")}</h2>
        </div>
        <p className="studio-muted" style={{ marginBottom: "0.85rem" }}>
          {t("studio.stripe.body")}
        </p>
        <p className="studio-muted" style={{ marginBottom: "0.85rem" }}>
          {stripeMode === "test"
            ? t("studio.stripe.modeTest")
            : t("studio.stripe.modeLive")}
        </p>
        <p className="studio-muted" style={{ marginBottom: "0.85rem" }}>
          {payoutsReady ? t("studio.stripe.statusReady") : t("studio.stripe.statusPending")}
        </p>
        {stripeMsg ? <p className="studio-flash">{stripeMsg}</p> : null}
        <button
          type="button"
          className="studio-btn studio-btn--accent"
          disabled={stripeBusy}
          onClick={() => void onConnectStripe()}
        >
          {stripeBusy
            ? t("common.loading")
            : payoutsReady
              ? t("studio.stripe.manage")
              : t("studio.stripe.connect")}
        </button>
      </section>

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
        </dl>
      </section>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>{t("studio.guide")}</h2>
        </div>
        <p className="studio-muted" style={{ marginBottom: "0.85rem" }}>
          {t("studio.guideHint")}
        </p>
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
