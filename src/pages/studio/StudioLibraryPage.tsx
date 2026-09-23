import { Link } from "react-router-dom";
import { useAuth } from "../../auth";
import { DRILL_QUICK_ADDS, PROGRAM_TEMPLATES } from "../../lib/templates";
import { useStudioTour } from "../../tour/StudioTour";

export function StudioLibraryPage() {
  const { profile } = useAuth();
  const { start } = useStudioTour();

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
            Templates, drill presets, and the white-glove playbook for your first creators.
          </p>
        </div>
        <div className="studio-actions">
          <button type="button" className="studio-btn studio-btn--ghost" onClick={start}>
            Replay tour
          </button>
          <Link className="studio-btn studio-btn--accent" to="/studio/programs/new">
            Use in wizard
          </Link>
        </div>
      </header>

      <section className="studio-panel" id="playbook">
        <div className="studio-panel-head">
          <h2>Creator onboarding playbook</h2>
          <span className="studio-muted">First 5–10 · grappling-first</span>
        </div>
        <div className="playbook">
          <p>
            <strong>Thesis:</strong> creator builds program → athlete executes → RASHMAT tracks →
            creator sees evolution. Studio is the moat — protect that loop.
          </p>
          <h3>Offer</h3>
          <p className="studio-muted">
            “Send videos + the system in your head. We turn it into Week → Day → Session → Drill.
            You publish. Athletes follow. You see who finishes.”
          </p>
          <h3>7-day white-glove</h3>
          <ol className="playbook-steps">
            <li>
              <strong>Day 0 — Recruit</strong>
              <span>15-min call. Theme + 4–6 weeks. Promise live program ≤7 days with your help.</span>
            </li>
            <li>
              <strong>Day 1 — Kickoff</strong>
              <span>Activate creator, run Studio tour, pick wizard template, name the camp.</span>
            </li>
            <li>
              <strong>Day 2–3 — Structure (you)</strong>
              <span>Auto-schedule, map curriculum, paste Mux IDs, auto-fill missing days.</span>
            </li>
            <li>
              <strong>Day 4 — Review</strong>
              <span>CMS together: rename drills, reorder, duplicate a strong day. Keep draft.</span>
            </li>
            <li>
              <strong>Day 5 — Smoke test</strong>
              <span>Test athlete completes 1–2 sessions. Confirm Students progress.</span>
            </li>
            <li>
              <strong>Day 6 — Soft publish</strong>
              <span>Publish + one story: “Don’t just watch. Progress.”</span>
            </li>
            <li>
              <strong>Day 7 — Debrief</strong>
              <span>Blockers? Ask for 1 peer intro. Track completion %, not vanity downloads.</span>
            </li>
          </ol>
          <h3>Validate in 30 days</h3>
          <ul className="playbook-metrics">
            <li>≥5 programs from real coaches published</li>
            <li>≥30% of enrolled athletes finish ≥3 sessions</li>
          </ul>
          <p className="studio-muted">
            Full write-up: <code>web/docs/CREATOR_ONBOARDING.md</code>
          </p>
        </div>
      </section>

      <section className="studio-panel" id="hotmart">
        <div className="studio-panel-head">
          <h2>Hotmart / course sellers → RASHMAT</h2>
          <span className="studio-muted">Convert catalog owners</span>
        </div>
        <div className="playbook">
          <p>
            <strong>Wedge:</strong> they already sell videos (Hotmart, Eduzz, Kiwify, Teachable…).
            Buyers binge and quit. RASHMAT turns the best course into a{" "}
            <em>Week → Day → Session → Drill</em> camp with completion tracking.
          </p>
          <h3>Do not ask them to leave Hotmart first</h3>
          <p className="studio-muted">
            Phase 1 = companion training layer (checkout stays). Phase 2 = sell inside RASHMAT when
            payments exist. Lead with completion and reputation, not “migrate your funnel.”
          </p>
          <h3>Map their course</h3>
          <ul className="playbook-metrics">
            <li>Product → Program</li>
            <li>Module → Week (or group modules into weeks)</li>
            <li>Lesson → Session (Day)</li>
            <li>Technique clip → Drill</li>
            <li>Course cover → Upload to Storage (mats, not gym stock)</li>
          </ul>
          <h3>Pitch</h3>
          <p className="studio-muted">
            “Keep selling on Hotmart. We turn your core system into a 4–6 week camp athletes finish —
            you see who completes.”
          </p>
          <p className="studio-muted">
            Full playbook + objections: <code>web/docs/HOTMART_CONVERSION.md</code>
          </p>
        </div>
      </section>

      <section className="studio-panel">
        <div className="studio-panel-head">
          <h2>Program templates</h2>
        </div>
        <div className="wizard-templates">
          {PROGRAM_TEMPLATES.map((t) => (
            <Link key={t.id} to="/studio/programs/new" className="library-card">
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
