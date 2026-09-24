export type TourStep = {
  id: string;
  /** Path where this step should be visible */
  route: string;
  title: string;
  body: string;
};

type TFn = (key: string, params?: Record<string, string | number>) => string;

const STEP_ROUTES: { id: string; route: string }[] = [
  { id: "dash", route: "/studio" },
  { id: "programs", route: "/studio/programs" },
  { id: "wizard", route: "/studio/programs/new" },
  { id: "cms", route: "/studio/cms" },
  { id: "students", route: "/studio/students" },
  { id: "library", route: "/studio/library" },
  { id: "settings", route: "/studio/settings" },
];

/** First-run walkthrough across Studio sections (localized). */
export function getStudioTour(t: TFn): TourStep[] {
  return STEP_ROUTES.map(({ id, route }) => ({
    id,
    route,
    title: t(`tour.steps.${id}.title`),
    body: t(`tour.steps.${id}.body`),
  }));
}

export const TOUR_STORAGE_KEY = "rashmat.studio.tour.v1";

export type TourState = {
  /** Completed or skipped the first-run tour */
  done: boolean;
  /** Last step index reached (for resume) */
  step: number;
};

export function loadTourState(): TourState {
  try {
    const raw = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!raw) return { done: false, step: 0 };
    const parsed = JSON.parse(raw) as TourState;
    return {
      done: Boolean(parsed.done),
      step: typeof parsed.step === "number" ? parsed.step : 0,
    };
  } catch {
    return { done: false, step: 0 };
  }
}

export function saveTourState(state: TourState) {
  localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(state));
}
