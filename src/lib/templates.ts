/** Client-side program templates — zero friction starters for creators. */

export type DrillPreset = {
  name: string;
  reps: string;
  rest_seconds: number;
};

export type SessionBlueprint = {
  title: string;
  minutes: number;
  drills: DrillPreset[];
};

export type ProgramTemplate = {
  id: string;
  name: string;
  blurb: string;
  sport: string;
  level: string;
  weeks: number;
  daysPerWeek: number;
  minutes: number;
  tags: string[];
  /** Pattern of session types rotating across days */
  dayPatterns: SessionBlueprint[];
};

export const DRILL_QUICK_ADDS: DrillPreset[] = [
  { name: "Mobility warm-up", reps: "5 min continuous", rest_seconds: 0 },
  { name: "Technique reps", reps: "Reps: 8 8 8", rest_seconds: 45 },
  { name: "Positional rounds", reps: "3 x 3 min", rest_seconds: 60 },
  { name: "Live rounds", reps: "4 x 5 min", rest_seconds: 90 },
  { name: "Cool-down stretch", reps: "4 min", rest_seconds: 0 },
];

export const PROGRAM_TEMPLATES: ProgramTemplate[] = [
  {
    id: "blank",
    name: "Blank schedule",
    blurb: "Empty days — you fill drills later.",
    sport: "General",
    level: "All levels",
    weeks: 4,
    daysPerWeek: 3,
    minutes: 45,
    tags: ["RASHMAT"],
    dayPatterns: [
      { title: "Training day", minutes: 45, drills: [] },
    ],
  },
  {
    id: "bjj-fundamentals",
    name: "BJJ Fundamentals",
    blurb: "Guard, passes, and positional sparring — auto-built weeks.",
    sport: "BJJ",
    level: "Beginner",
    weeks: 4,
    daysPerWeek: 3,
    minutes: 60,
    tags: ["RASHMAT", "BJJ", "Gi"],
    dayPatterns: [
      {
        title: "Guard retention",
        minutes: 60,
        drills: [
          { name: "Hip escape series", reps: "Reps: 8 8 8", rest_seconds: 45 },
          { name: "Closed guard breaks", reps: "Reps: 6 6 6", rest_seconds: 45 },
          { name: "Positional sparring — bottom", reps: "4 x 3 min", rest_seconds: 60 },
        ],
      },
      {
        title: "Passing pressure",
        minutes: 60,
        drills: [
          { name: "Knee-cut entries", reps: "Reps: 8 8 8", rest_seconds: 45 },
          { name: "Side control transitions", reps: "Reps: 6 6", rest_seconds: 45 },
          { name: "Positional sparring — top", reps: "4 x 3 min", rest_seconds: 60 },
        ],
      },
      {
        title: "Live rounds",
        minutes: 55,
        drills: [
          { name: "Specific sparring", reps: "3 x 4 min", rest_seconds: 60 },
          { name: "Open sparring", reps: "4 x 5 min", rest_seconds: 90 },
          { name: "Cool-down", reps: "4 min", rest_seconds: 0 },
        ],
      },
    ],
  },
  {
    id: "nogi-pressure",
    name: "No-Gi Pressure",
    blurb: "Wrestling entries, half guard, and submissions.",
    sport: "No-Gi",
    level: "Intermediate",
    weeks: 6,
    daysPerWeek: 3,
    minutes: 55,
    tags: ["RASHMAT", "No-Gi"],
    dayPatterns: [
      {
        title: "Wrestling to pass",
        minutes: 55,
        drills: [
          { name: "Snap-down to front headlock", reps: "Reps: 8 8", rest_seconds: 40 },
          { name: "Body-lock passes", reps: "Reps: 6 6 6", rest_seconds: 45 },
          { name: "Top pressure rounds", reps: "5 x 3 min", rest_seconds: 60 },
        ],
      },
      {
        title: "Half guard attacks",
        minutes: 55,
        drills: [
          { name: "Knee-shield retention", reps: "Reps: 8 8", rest_seconds: 40 },
          { name: "Underhook sweeps", reps: "Reps: 6 6 6", rest_seconds: 45 },
          { name: "Bottom half rounds", reps: "5 x 3 min", rest_seconds: 60 },
        ],
      },
      {
        title: "Submission focus",
        minutes: 50,
        drills: [
          { name: "Rear naked choke entries", reps: "Reps: 8 8 8", rest_seconds: 40 },
          { name: "Armbar from mount", reps: "Reps: 6 6", rest_seconds: 45 },
          { name: "Live rounds", reps: "4 x 5 min", rest_seconds: 90 },
        ],
      },
    ],
  },
  {
    id: "striking-padwork",
    name: "Striking Padwork",
    blurb: "Combos, defense, and conditioning rounds.",
    sport: "Striking",
    level: "Beginner",
    weeks: 4,
    daysPerWeek: 4,
    minutes: 45,
    tags: ["RASHMAT", "Striking", "Muay Thai"],
    dayPatterns: [
      {
        title: "Jab–cross foundation",
        minutes: 45,
        drills: [
          { name: "Shadow box warm-up", reps: "3 min", rest_seconds: 30 },
          { name: "1–2 on pads", reps: "6 rounds x 2 min", rest_seconds: 45 },
          { name: "Footwork ladders", reps: "4 min", rest_seconds: 30 },
        ],
      },
      {
        title: "Kick entries",
        minutes: 45,
        drills: [
          { name: "Teep + low kick", reps: "5 rounds x 2 min", rest_seconds: 45 },
          { name: "Check–counter", reps: "4 rounds x 2 min", rest_seconds: 45 },
          { name: "Light sparring", reps: "3 x 3 min", rest_seconds: 60 },
        ],
      },
      {
        title: "Clinch & knees",
        minutes: 45,
        drills: [
          { name: "Plum entries", reps: "Reps: 10 10", rest_seconds: 40 },
          { name: "Knee combinations", reps: "5 rounds x 2 min", rest_seconds: 45 },
          { name: "Conditioning finishers", reps: "4 min", rest_seconds: 0 },
        ],
      },
      {
        title: "Round simulation",
        minutes: 50,
        drills: [
          { name: "Pad rounds", reps: "6 x 3 min", rest_seconds: 60 },
          { name: "Defense drills", reps: "4 x 2 min", rest_seconds: 45 },
          { name: "Cool-down", reps: "5 min", rest_seconds: 0 },
        ],
      },
    ],
  },
];

export function buildSessionPlan(
  template: ProgramTemplate,
  weeks: number,
  daysPerWeek: number,
): { day: number; title: string; minutes: number; drills: DrillPreset[] }[] {
  const total = weeks * daysPerWeek;
  const patterns = template.dayPatterns.length
    ? template.dayPatterns
    : [{ title: "Training day", minutes: template.minutes, drills: [] as DrillPreset[] }];

  const out: { day: number; title: string; minutes: number; drills: DrillPreset[] }[] = [];
  for (let i = 0; i < total; i++) {
    const week = Math.floor(i / daysPerWeek) + 1;
    const dayInWeek = (i % daysPerWeek) + 1;
    const pattern = patterns[i % patterns.length];
    out.push({
      day: i + 1,
      title: `W${week}D${dayInWeek} · ${pattern.title}`,
      minutes: pattern.minutes,
      drills: pattern.drills,
    });
  }
  return out;
}
