import { Link } from "react-router-dom";
import { useAuth } from "../../auth";
import { useT } from "../../i18n";
import { DRILL_QUICK_ADDS, PROGRAM_TEMPLATES } from "../../lib/templates";
import { useStudioTour } from "../../tour/StudioTour";

export function StudioLibraryPage() {
  const { profile } = useAuth();
  const { start } = useStudioTour();
  const t = useT();

  if (!profile?.is_creator) {
    return (
      <main className="studio-page studio-page--narrow">
        <Link to="/studio">{t("common.dashboardBack")}</Link>
      </main>
    );
  }

  return (
    <main className="studio-page">
      <header className="studio-page-head">
        <div>
          <p className="studio-kicker">{t("studio.library.kicker")}</p>
          <h1>{t("studio.library.title")}</h1>
          <p className="studio-muted">{t("studio.library.sub")}</p>
        </div>
        <div className="studio-actions">
          <button type="button" className="studio-btn studio-btn--ghost" onClick={start}>
            {t("studio.library.replayTour")}
          </button>
          <Link className="studio-btn studio-btn--accent" to="/studio/programs/new">
            {t("studio.library.useInWizard")}
          </Link>
        </div>
      </header>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>{t("studio.library.templatesTitle")}</h2>
          <span className="studio-muted">{t("studio.library.templatesHint")}</span>
        </div>
        <div className="wizard-templates">
          {PROGRAM_TEMPLATES.map((tpl) => (
            <Link key={tpl.id} to="/studio/programs/new" className="library-card">
              <strong>{t(tpl.nameKey)}</strong>
              <span>{t(tpl.blurbKey)}</span>
              <em>
                {t("studio.library.templateMeta", {
                  weeks: tpl.weeks,
                  days: tpl.daysPerWeek,
                  patterns: tpl.dayPatterns.length,
                  sport: t(tpl.sportKey),
                })}
              </em>
            </Link>
          ))}
        </div>
      </section>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>{t("studio.library.presetsTitle")}</h2>
          <Link className="studio-muted" to="/studio/cms">
            {t("studio.library.presetsOpenCms")}
          </Link>
        </div>
        <p className="studio-muted" style={{ marginBottom: "0.85rem" }}>
          {t("studio.library.presetsHint")}
        </p>
        <ul className="library-drills">
          {DRILL_QUICK_ADDS.map((d) => (
            <li key={d.name}>
              <strong>{d.nameKey ? t(d.nameKey) : d.name}</strong>
              <span>{d.reps}</span>
              <em>{t("studio.library.presetRest", { seconds: d.rest_seconds })}</em>
            </li>
          ))}
        </ul>
      </section>

      <details className="studio-panel studio-panel--details">
        <summary className="studio-panel-head studio-panel-head--summary">
          <h2>{t("studio.library.automationsTitle")}</h2>
          <span className="studio-muted">{t("studio.library.automationsHint")}</span>
        </summary>
        <ul className="library-auto">
          <li>
            <strong>{t("studio.library.auto1Title")}</strong>
            <span>{t("studio.library.auto1Body")}</span>
          </li>
          <li>
            <strong>{t("studio.library.auto2Title")}</strong>
            <span>{t("studio.library.auto2Body")}</span>
          </li>
          <li>
            <strong>{t("studio.library.auto3Title")}</strong>
            <span>{t("studio.library.auto3Body")}</span>
          </li>
          <li>
            <strong>{t("studio.library.auto4Title")}</strong>
            <span>{t("studio.library.auto4Body")}</span>
          </li>
          <li>
            <strong>{t("studio.library.auto5Title")}</strong>
            <span>{t("studio.library.auto5Body")}</span>
          </li>
        </ul>
      </details>
    </main>
  );
}
