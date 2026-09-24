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
import { useT } from "../i18n";
import {
  getStudioTour,
  loadTourState,
  saveTourState,
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
  enabled: boolean;
}) {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const steps = useMemo(() => getStudioTour(t), [t]);

  useEffect(() => {
    if (!enabled) return;
    const state = loadTourState();
    if (!state.done) {
      setIndex(state.step);
      setActive(true);
    }
  }, [enabled]);

  useEffect(() => {
    if (!active) return;
    const step = steps[index];
    if (!step) return;
    if (location.pathname !== step.route) {
      navigate(step.route, { replace: true });
    }
  }, [active, index, location.pathname, navigate, steps]);

  const persist = useCallback((next: { done: boolean; step: number }) => {
    saveTourState(next);
  }, []);

  const start = useCallback(() => {
    setIndex(0);
    setActive(true);
    persist({ done: false, step: 0 });
    navigate(steps[0].route);
  }, [navigate, persist, steps]);

  const skip = useCallback(() => {
    setActive(false);
    persist({ done: true, step: index });
  }, [index, persist]);

  const next = useCallback(() => {
    if (index >= steps.length - 1) {
      setActive(false);
      persist({ done: true, step: steps.length - 1 });
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    persist({ done: false, step: nextIndex });
    navigate(steps[nextIndex].route);
  }, [index, navigate, persist, steps]);

  const back = useCallback(() => {
    if (index <= 0) return;
    const prev = index - 1;
    setIndex(prev);
    persist({ done: false, step: prev });
    navigate(steps[prev].route);
  }, [index, navigate, persist, steps]);

  const value = useMemo<TourContextValue>(
    () => ({
      active,
      step: active ? steps[index] ?? null : null,
      index,
      total: steps.length,
      start,
      next,
      back,
      skip,
    }),
    [active, index, start, next, back, skip, steps],
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useStudioTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useStudioTour must be used within StudioTourProvider");
  return ctx;
}

export function StudioTourOverlay() {
  const t = useT();
  const { active, step, index, total, next, back, skip } = useStudioTour();
  if (!active || !step) return null;

  const isLast = index >= total - 1;

  return (
    <div className="tour-root" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <div className="tour-backdrop" onClick={skip} />
      <div className="tour-card">
        <div className="tour-progress">
          <span>{t("tour.progress", { current: index + 1, total })}</span>
          <button type="button" className="tour-skip" onClick={skip}>
            {t("tour.skip")}
          </button>
        </div>
        <p className="tour-kicker">{t("tour.kicker")}</p>
        <h2 id="tour-title">{step.title}</h2>
        <p className="tour-body">{step.body}</p>
        <div className="tour-actions">
          <button
            type="button"
            className="studio-btn studio-btn--ghost"
            disabled={index === 0}
            onClick={back}
          >
            {t("common.back")}
          </button>
          <button type="button" className="studio-btn studio-btn--accent" onClick={next}>
            {isLast ? t("common.finish") : t("common.next")}
          </button>
        </div>
      </div>
    </div>
  );
}
