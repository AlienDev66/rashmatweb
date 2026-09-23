export type TourStep = {
  id: string;
  /** Path where this step should be visible */
  route: string;
  title: string;
  body: string;
};

/** First-run walkthrough across Studio sections. */
export const STUDIO_TOUR: TourStep[] = [
  {
    id: "dash",
    route: "/studio",
    title: "Dashboard",
    body: "Your command center. See programs, students, and jump into the wizard or CMS in one tap.",
  },
  {
    id: "programs",
    route: "/studio/programs",
    title: "Programs",
    body: "Your catalog. Search, publish, duplicate, or delete camps. Duplicate is the fastest way to ship a variant.",
  },
  {
    id: "wizard",
    route: "/studio/programs/new",
    title: "Program wizard",
    body: "Pick a BJJ / No-Gi / Striking template. We auto-build weeks × days and seed starter drills so you don’t start from zero.",
  },
  {
    id: "cms",
    route: "/studio/cms",
    title: "CMS editor",
    body: "Programs → sessions → drills. Use quick-adds, starter blocks, and duplicate day to stay on the mats instead of in forms.",
  },
  {
    id: "students",
    route: "/studio/students",
    title: "Students",
    body: "See who enrolled, completion %, and drop-off. This is the creator-side of progress — protect this loop.",
  },
  {
    id: "library",
    route: "/studio/library",
    title: "Library & playbook",
    body: "Templates, drill presets, and the white-glove onboarding playbook for your first creators.",
  },
  {
    id: "settings",
    route: "/studio/settings",
    title: "Settings",
    body: "Account and links. Replay this tour anytime from here when you bring a new coach into Studio.",
  },
];

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
