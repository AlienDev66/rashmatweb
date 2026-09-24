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

      <section className="studio-panel" id="playbook">
        <div className="studio-panel-head">
          <h2>{t("studio.library.playbookTitle")}</h2>
          <span className="studio-muted">{t("studio.library.playbookHint")}</span>
        </div>
        <div className="playbook">
          <p>
            <strong>{t("studio.library.thesisLabel")}</strong> {t("studio.library.thesisBody")}
          </p>
          <h3>{t("studio.library.offerTitle")}</h3>
          <p className="studio-muted">{t("studio.library.offerBody")}</p>
          <h3>{t("studio.library.whiteGloveTitle")}</h3>
          <ol className="playbook-steps">
            <li>
              <strong>{t("studio.library.day0Title")}</strong>
              <span>{t("studio.library.day0Body")}</span>
            </li>
            <li>
              <strong>{t("studio.library.day1Title")}</strong>
              <span>{t("studio.library.day1Body")}</span>
            </li>
            <li>
              <strong>{t("studio.library.day23Title")}</strong>
              <span>{t("studio.library.day23Body")}</span>
            </li>
            <li>
              <strong>{t("studio.library.day4Title")}</strong>
              <span>{t("studio.library.day4Body")}</span>
            </li>
            <li>
              <strong>{t("studio.library.day5Title")}</strong>
              <span>{t("studio.library.day5Body")}</span>
            </li>
            <li>
              <strong>{t("studio.library.day6Title")}</strong>
              <span>{t("studio.library.day6Body")}</span>
            </li>
            <li>
              <strong>{t("studio.library.day7Title")}</strong>
              <span>{t("studio.library.day7Body")}</span>
            </li>
          </ol>
          <h3>{t("studio.library.validateTitle")}</h3>
          <ul className="playbook-metrics">
            <li>{t("studio.library.validate1")}</li>
            <li>{t("studio.library.validate2")}</li>
          </ul>
          <p className="studio-muted">
            {t("studio.library.writeupLabel")} <code>web/docs/CREATOR_ONBOARDING.md</code>
          </p>
        </div>
      </section>

      <section className="studio-panel" id="hotmart">
        <div className="studio-panel-head">
          <h2>{t("studio.library.hotmartTitle")}</h2>
          <span className="studio-muted">{t("studio.library.hotmartHint")}</span>
        </div>
        <div className="playbook">
          <p>
            <strong>{t("studio.library.wedgeLabel")}</strong> {t("studio.library.wedgeBefore")}{" "}
            <em>{t("studio.library.wedgeEm")}</em> {t("studio.library.wedgeAfter")}
          </p>
          <h3>{t("studio.library.phaseTitle")}</h3>
          <p className="studio-muted">{t("studio.library.phaseBody")}</p>
          <h3>{t("studio.library.mapTitle")}</h3>
          <ul className="playbook-metrics">
            <li>{t("studio.library.map1")}</li>
            <li>{t("studio.library.map2")}</li>
            <li>{t("studio.library.map3")}</li>
            <li>{t("studio.library.map4")}</li>
            <li>{t("studio.library.map5")}</li>
          </ul>
          <h3>{t("studio.library.pitchTitle")}</h3>
          <p className="studio-muted">{t("studio.library.pitchBody")}</p>
          <p className="studio-muted">
            {t("studio.library.objectionsLabel")} <code>web/docs/HOTMART_CONVERSION.md</code>
          </p>
        </div>
      </section>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>{t("studio.library.templatesTitle")}</h2>
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
          <span className="studio-muted">{t("studio.library.presetsHint")}</span>
        </div>
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

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>{t("studio.library.automationsTitle")}</h2>
        </div>
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
      </section>
    </main>
  );
}
