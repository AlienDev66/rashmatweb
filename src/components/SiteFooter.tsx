import { Link } from "react-router-dom";
import { brand } from "../brand";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useT } from "../i18n";

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M16.37 12.55c-.03-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.71-3.18-1.73-1.35-.14-2.64.8-3.32.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.55 2.68-.4 6.64 1.11 8.81.74 1.06 1.61 2.25 2.76 2.21 1.11-.05 1.53-.71 2.87-.71 1.33 0 1.72.71 2.89.69 1.2-.02 1.95-1.07 2.68-2.14.84-1.23 1.19-2.42 1.21-2.48-.03-.01-2.31-.89-2.34-3.51zm-2.2-6.5c.61-.74 1.02-1.77.91-2.8-.88.04-1.95.59-2.58 1.32-.57.65-1.06 1.7-.93 2.7.98.08 1.98-.5 2.6-1.22z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M3.6 2.8c-.3.2-.5.6-.5 1.1v16.2c0 .5.2.9.5 1.1l.1.1L13.4 12v-.1L3.7 2.7l-.1.1zm12.2 7L13.4 12l2.4 2.2 3.2-1.8c.9-.5.9-1.3 0-1.8l-3.2-1.8zM13.4 12l-9.8 9.1c.2.1.4.1.6 0l11.4-6.5L13.4 12zM3.6 2.9l11.4 6.5L13.4 12 3.6 2.9z" />
    </svg>
  );
}

type Props = {
  showStores?: boolean;
};

export function SiteFooter({ showStores = true }: Props) {
  const t = useT();

  return (
    <footer className="foot">
      <div className="shell foot__inner">
        <div className="foot__brand">
          <Link to="/" className="foot__brand-link">
            <img src="/logo-yellow.png" width={44} height={44} alt="" />
            <span>{brand.name}</span>
          </Link>
          <LanguageSwitcher className="foot__lang" />
        </div>

        {showStores ? (
          <div className="foot__stores" aria-label={t("stores.getApp")}>
            <a
              className="store-btn"
              href={brand.stores.ios}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AppleIcon />
              <span>
                <small>{t("stores.downloadOn")}</small>
                {t("stores.appStore")}
              </span>
            </a>
            <a
              className="store-btn"
              href={brand.stores.android}
              target="_blank"
              rel="noopener noreferrer"
            >
              <PlayIcon />
              <span>
                <small>{t("stores.getItOn")}</small>
                {t("stores.googlePlay")}
              </span>
            </a>
          </div>
        ) : null}

        <nav className="foot__nav" aria-label="Footer">
          <a href={brand.platformUrl}>{t("common.platform")}</a>
          <Link to={brand.studioUrl}>{t("common.studio")}</Link>
          <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer">
            {t("common.instagram")}
          </a>
          <Link to={brand.legal.privacyUrl}>{t("common.privacy")}</Link>
          <Link to={brand.legal.termsUrl}>{t("common.terms")}</Link>
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
        </nav>

        <p className="foot__meta">
          © {new Date().getFullYear()} {brand.name} · {brand.domain}
        </p>
      </div>
    </footer>
  );
}
