import { useEffect } from "react";
import { Link } from "react-router-dom";
import { brand } from "../brand";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { SiteFooter } from "../components/SiteFooter";
import { useI18n, useT } from "../i18n";
import { privacySections, termsSections, type LegalSection } from "../i18n/legalContent";

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
    <div className="page legal-page">
      <header className="legal-top">
        <div className="shell legal-top__inner">
          <Link className="legal-brand" to="/">
            <img src="/logo-yellow.png" width={40} height={40} alt="" />
            <span>{brand.name}</span>
          </Link>
          <nav className="legal-top__nav" aria-label="Legal">
            <Link to={brand.legal.privacyUrl}>{t("legal.navPrivacy")}</Link>
            <Link to={brand.legal.termsUrl}>{t("legal.navTerms")}</Link>
            <a href={brand.platformUrl}>{t("common.platform")}</a>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

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

      <SiteFooter showStores={false} />
    </div>
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
