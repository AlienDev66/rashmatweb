import { useI18n } from "../i18n";
import type { Locale } from "../i18n/types";
import { LOCALE_LABELS, LOCALES } from "../i18n/types";

type Props = {
  className?: string;
  /** compact = EN | PT chips */
  variant?: "select" | "chips";
};

export function LanguageSwitcher({ className = "", variant = "chips" }: Props) {
  const { locale, setLocale, t } = useI18n();

  if (variant === "select") {
    return (
      <label className={`lang-switch lang-switch--select ${className}`.trim()}>
        <span className="lang-switch__label">{t("lang.switch")}</span>
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
          aria-label={t("lang.switch")}
        >
          {LOCALES.map((code) => (
            <option key={code} value={code}>
              {LOCALE_LABELS[code]}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <div className={`lang-switch ${className}`.trim()} role="group" aria-label={t("lang.switch")}>
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          className={`lang-switch__chip${locale === code ? " is-active" : ""}`}
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
