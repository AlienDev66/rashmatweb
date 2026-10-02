import { useEffect } from "react";
import { Link } from "react-router-dom";
import { brand } from "../brand";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { SiteFooter } from "../components/SiteFooter";
import { useT } from "../i18n";

/**
 * Soft-launch destination for “Enter the platform”.
 * Native athletes train in the Expo app; Expo web on app.rashmat.com is not live yet.
 */
export function GetAppPage() {
  const t = useT();

  useEffect(() => {
    document.title = `${t("getApp.title")} — ${brand.name}`;
    return () => {
      document.title = "RASHMAT — Train with creators on the mat";
    };
  }, [t]);

  const tryOpenApp = () => {
    window.location.href = `${brand.scheme}://`;
  };

  return (
    <div className="page legal-page">
      <header className="legal-top">
        <div className="shell legal-top__inner">
          <Link className="legal-brand" to="/">
            <img src="/logo-yellow.png" width={40} height={40} alt="" />
            <span>{brand.name}</span>
          </Link>
          <nav className="legal-top__nav" aria-label={t("common.navLegal")}>
            <Link to={brand.studioUrl}>{t("common.studio")}</Link>
            <Link to={brand.legal.supportUrl}>{t("legal.navSupport")}</Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <main className="shell legal">
        <p className="kicker">{t("getApp.kicker")}</p>
        <h1 className="legal__title">{t("getApp.title")}</h1>
        <p className="body legal__summary">{t("getApp.body")}</p>

        <div className="get-app__actions">
          <a className="btn btn--accent" href={brand.stores.ios}>
            {t("stores.appStore")}
          </a>
          <a className="btn btn--ghost" href={brand.stores.android}>
            {t("stores.googlePlay")}
          </a>
          <button type="button" className="btn btn--ghost" onClick={tryOpenApp}>
            {t("getApp.openInstalled")}
          </button>
        </div>

        <p className="body get-app__note">{t("getApp.note")}</p>

        <p className="legal__contact">
          <Link to="/">{t("common.backHome")}</Link>
          {" · "}
          <Link to={brand.studioUrl}>{t("common.studio")}</Link>
        </p>
      </main>

      <SiteFooter showStores />
    </div>
  );
}
