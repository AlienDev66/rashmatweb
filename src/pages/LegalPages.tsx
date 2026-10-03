import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { brand } from "../brand";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { SiteFooter } from "../components/SiteFooter";
import { useI18n, useT } from "../i18n";
import { privacySections, termsSections, type LegalSection } from "../i18n/legalContent";

function LegalChrome({ children }: { children: ReactNode }) {
  const t = useT();
  return (
    <div className="page legal-page">
      <header className="legal-top">
        <div className="shell legal-top__inner">
          <Link className="legal-brand" to="/">
            <img src="/logo-yellow.png" width={40} height={40} alt="" />
            <span>{brand.name}</span>
          </Link>
          <nav className="legal-top__nav" aria-label={t("common.navLegal")}>
            <Link to={brand.legal.supportUrl}>{t("legal.navSupport")}</Link>
            <Link to={brand.legal.privacyUrl}>{t("legal.navPrivacy")}</Link>
            <Link to={brand.legal.termsUrl}>{t("legal.navTerms")}</Link>
            <a href={brand.platformUrl}>{t("common.platform")}</a>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      {children}
      <SiteFooter showStores={false} />
    </div>
  );
}

function LegalDoc({
  kicker,
  title,
  summary,
  sections,
}: {
  kicker: string;
  title: string;
  summary: string;
  sections: LegalSection[];
}) {
  const t = useT();

  useEffect(() => {
    document.title = `${title} — ${brand.name}`;
    return () => {
      document.title = "RASHMAT — Train with creators on the mat";
    };
  }, [title]);

  return (
    <LegalChrome>
      <main className="shell legal">
        <p className="kicker">{kicker}</p>
        <h1 className="legal__title">{title}</h1>
        <p className="legal__meta">{t("legal.effective", { date: brand.legal.effectiveDate })}</p>
        <p className="body legal__summary">{summary}</p>

        <div className="legal__body">
          {sections.map((section) => (
            <section key={section.title} className="legal__section">
              <h2>{section.title}</h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
              {section.bullets?.length ? (
                <ul>
                  {section.bullets.map((b) => (
                    <li key={b.slice(0, 48)}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <p className="legal__contact">
          {t("legal.questions")}{" "}
          <a href={`mailto:${brand.supportEmail}`}>{brand.supportEmail}</a>
          {" · "}
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
        </p>
      </main>
    </LegalChrome>
  );
}

export function PrivacyPage() {
  const t = useT();
  const { locale } = useI18n();
  return (
    <LegalDoc
      kicker={t("legal.privacyKicker")}
      title={t("legal.privacyTitle")}
      summary={t("legal.privacySummary")}
      sections={privacySections(locale)}
    />
  );
}

export function TermsPage() {
  const t = useT();
  const { locale } = useI18n();
  return (
    <LegalDoc
      kicker={t("legal.termsKicker")}
      title={t("legal.termsTitle")}
      summary={t("legal.termsSummary")}
      sections={termsSections(locale)}
    />
  );
}

export function SupportPage() {
  const t = useT();

  useEffect(() => {
    document.title = `${t("legal.supportTitle")} — ${brand.name}`;
    return () => {
      document.title = "RASHMAT — Train with creators on the mat";
    };
  }, [t]);

  const cards = [
    {
      title: t("legal.supportAppTitle"),
      body: t("legal.supportAppBody"),
    },
    {
      title: t("legal.supportStudioTitle"),
      body: t("legal.supportStudioBody"),
    },
    {
      title: t("legal.supportPrivacyTitle"),
      body: t("legal.supportPrivacyBody"),
    },
  ] as const;

  return (
    <LegalChrome>
      <main className="shell legal support-page">
        <p className="kicker">{t("legal.supportKicker")}</p>
        <h1 className="legal__title">{t("legal.supportTitle")}</h1>
        <p className="body legal__summary">{t("legal.supportSummary")}</p>

        <a className="support-email" href={`mailto:${brand.supportEmail}`}>
          <span className="support-email__label">{t("legal.supportEmailLabel")}</span>
          <span className="support-email__addr">{brand.supportEmail}</span>
          <span className="support-email__hint">{t("legal.supportEmailHint")}</span>
        </a>

        <div className="support-cards">
          {cards.map((card) => (
            <section key={card.title} className="support-card">
              <h2>{card.title}</h2>
              <p>{card.body}</p>
            </section>
          ))}
        </div>

        <p className="legal__contact">
          <Link to={brand.legal.deleteAccountUrl}>{t("legal.deleteAccountTitle")}</Link>
          {" · "}
          <Link to={brand.legal.privacyUrl}>{t("legal.navPrivacy")}</Link>
          {" · "}
          <Link to={brand.legal.termsUrl}>{t("legal.navTerms")}</Link>
          {" · "}
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
        </p>
      </main>
    </LegalChrome>
  );
}

export function DeleteAccountPage() {
  const t = useT();

  useEffect(() => {
    document.title = `${t("legal.deleteAccountTitle")} — ${brand.name}`;
    return () => {
      document.title = "RASHMAT — Train with creators on the mat";
    };
  }, [t]);

  const sections = [
    {
      title: t("legal.deleteAccountInAppTitle"),
      body: t("legal.deleteAccountInAppBody"),
    },
    {
      title: t("legal.deleteAccountEmailTitle"),
      body: t("legal.deleteAccountEmailBody"),
    },
    {
      title: t("legal.deleteAccountWhatTitle"),
      body: t("legal.deleteAccountWhatBody"),
    },
    {
      title: t("legal.deleteAccountRetainTitle"),
      body: t("legal.deleteAccountRetainBody"),
    },
    {
      title: t("legal.deleteAccountPartialTitle"),
      body: t("legal.deleteAccountPartialBody"),
    },
  ] as const;

  return (
    <LegalChrome>
      <main className="shell legal">
        <p className="kicker">{t("legal.deleteAccountKicker")}</p>
        <h1 className="legal__title">{t("legal.deleteAccountTitle")}</h1>
        <p className="body legal__summary">{t("legal.deleteAccountSummary")}</p>

        <a className="support-email" href={`mailto:${brand.supportEmail}?subject=Delete%20account`}>
          <span className="support-email__label">{t("legal.supportEmailLabel")}</span>
          <span className="support-email__addr">{brand.supportEmail}</span>
          <span className="support-email__hint">{t("legal.deleteAccountEmailTitle")}</span>
        </a>

        <div className="legal__body">
          {sections.map((section) => (
            <section key={section.title} className="legal__section">
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>

        <p className="legal__contact">
          <Link to={brand.legal.privacyUrl}>{t("legal.navPrivacy")}</Link>
          {" · "}
          <Link to={brand.legal.supportUrl}>{t("legal.navSupport")}</Link>
          {" · "}
          <a href={`mailto:${brand.supportEmail}`}>{brand.supportEmail}</a>
        </p>
      </main>
    </LegalChrome>
  );
}
