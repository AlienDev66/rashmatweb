import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  loadTourState,
  saveTourState,
  STUDIO_TOUR,
  type TourStep,
} from "./tours";

type TourContextValue = {
  active: boolean;
  step: TourStep | null;
  index: number;
  total: number;
  start: () => void;
  next: () => void;
  back: () => void;
  skip: () => void;
};

const TourContext = createContext<TourContextValue | null>(null);

export function StudioTourProvider({
  children,
  enabled,
}: {
  children: ReactNode;
  /** Only run when creator is activated */
  enabled: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const state = loadTourState();
    if (!state.done) {
      setIndex(state.step);
      setActive(true);
    }
  }, [enabled]);

  // Keep user on the correct route for the current step
  useEffect(() => {
    if (!active) return;
    const step = STUDIO_TOUR[index];
    if (!step) return;
    if (location.pathname !== step.route) {
      navigate(step.route, { replace: true });
    }
  }, [active, index, location.pathname, navigate]);

  const persist = useCallback((next: { done: boolean; step: number }) => {
    saveTourState(next);
  }, []);

  const start = useCallback(() => {
    setIndex(0);
    setActive(true);
    persist({ done: false, step: 0 });
    navigate(STUDIO_TOUR[0].route);
  }, [navigate, persist]);

  const skip = useCallback(() => {
    setActive(false);
    persist({ done: true, step: index });
  }, [index, persist]);

  const next = useCallback(() => {
    if (index >= STUDIO_TOUR.length - 1) {
      setActive(false);
      persist({ done: true, step: STUDIO_TOUR.length - 1 });
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    persist({ done: false, step: nextIndex });
    navigate(STUDIO_TOUR[nextIndex].route);
  }, [index, navigate, persist]);

  const back = useCallback(() => {
    if (index <= 0) return;
    const prev = index - 1;
    setIndex(prev);
    persist({ done: false, step: prev });
    navigate(STUDIO_TOUR[prev].route);
  }, [index, navigate, persist]);

  const value = useMemo<TourContextValue>(
    () => ({
      active,
      step: active ? STUDIO_TOUR[index] ?? null : null,
      index,
      total: STUDIO_TOUR.length,
      start,
      next,
      back,
      skip,
    }),
    [active, index, start, next, back, skip],
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useStudioTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useStudioTour must be used within StudioTourProvider");
  return ctx;
}

export function StudioTourOverlay() {
  const { active, step, index, total, next, back, skip } = useStudioTour();
  if (!active || !step) return null;

  const isLast = index >= total - 1;

  return (
    <div className="tour-root" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <div className="tour-backdrop" onClick={skip} />
      <div className="tour-card">
        <div className="tour-progress">
          <span>
            {index + 1} / {total}
          </span>
          <button type="button" className="tour-skip" onClick={skip}>
            Skip tour
          </button>
        </div>
        <p className="tour-kicker">Studio guide</p>
        <h2 id="tour-title">{step.title}</h2>
        <p className="tour-body">{step.body}</p>
        <div className="tour-actions">
          <button type="button" className="studio-btn studio-btn--ghost" disabled={index === 0} onClick={back}>
            Back
          </button>
          <button type="button" className="studio-btn studio-btn--accent" onClick={next}>
            {isLast ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
