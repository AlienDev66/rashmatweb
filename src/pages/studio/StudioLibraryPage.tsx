import { Link } from "react-router-dom";
import { useAuth } from "../../auth";
import { DRILL_QUICK_ADDS, PROGRAM_TEMPLATES } from "../../lib/templates";

export function StudioLibraryPage() {
  const { profile } = useAuth();

  if (!profile?.is_creator) {
    return (
      <main className="studio-page studio-page--narrow">
        <Link to="/studio">← Dashboard</Link>
      </main>
    );
  }

  return (
    <main className="studio-page">
      <header className="studio-page-head">
        <div>
          <p className="studio-kicker">Automation</p>
          <h1>Library</h1>
          <p className="studio-muted">
            Templates and drill presets used by the wizard and CMS — designed so creators barely
            start from zero.
          </p>
        </div>
        <Link className="studio-btn studio-btn--accent" to="/studio/programs/new">
          Use in wizard
        </Link>
      </header>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>Program templates</h2>
        </div>
        <div className="wizard-templates">
          {PROGRAM_TEMPLATES.map((t) => (
            <Link key={t.id} to={`/studio/programs/new`} className="library-card">
              <strong>{t.name}</strong>
              <span>{t.blurb}</span>
              <em>
                {t.weeks}w · {t.daysPerWeek}d/w · {t.dayPatterns.length} day patterns · {t.sport}
              </em>
            </Link>
          ))}
        </div>
      </section>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>One-tap drill presets</h2>
          <span className="studio-muted">Available inside the CMS session editor</span>
        </div>
        <ul className="library-drills">
          {DRILL_QUICK_ADDS.map((d) => (
            <li key={d.name}>
              <strong>{d.name}</strong>
              <span>{d.reps}</span>
              <em>rest {d.rest_seconds}s</em>
            </li>
          ))}
        </ul>
      </section>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>Built-in automations</h2>
        </div>
        <ul className="library-auto">
          <li>
            <strong>Auto-schedule</strong>
            <span>weeks × days/week → full session calendar with titled days</span>
          </li>
          <li>
            <strong>Seed drills</strong>
            <span>template patterns rotate across the block so every day starts useful</span>
          </li>
          <li>
            <strong>Fill missing days</strong>
            <span>expand a program later without rebuilding by hand</span>
          </li>
          <li>
            <strong>Duplicate day / program</strong>
            <span>clone structure + drills, then tweak</span>
          </li>
          <li>
            <strong>Starter block</strong>
            <span>warm-up → technique → positional → live → cool-down in one click</span>
          </li>
        </ul>
      </section>
    </main>
  );
}
