/** Canonical RASHMAT brand (web marketing + platform). */
export const brand = {
  name: "RASHMAT",
  domain: "rashmat.com",
  url: "https://rashmat.com",
  email: "hello@rashmat.com",
  supportEmail: "support@rashmat.com",
  social: {
    instagram: "https://www.instagram.com/rashmatapp/",
    handle: "@rashmatapp",
  },
  /**
   * Athlete entry from the marketing site.
   * Soft launch: /get-app (store + deep link). Switch to https://app.rashmat.com
   * when Expo web is deployed on that host.
   */
  platformUrl: "/get-app",
  /** Deep-link scheme for installed native apps. */
  scheme: "rashmat",
  /** Web Creator Studio (this package). */
  studioUrl: "/studio",
  /**
   * Native store listings.
   * iOS: App Store Connect Apple ID 6818224124 (update slug when public).
   */
  stores: {
    ios: "https://apps.apple.com/app/id6818224124",
    android: "https://play.google.com/store/apps/details?id=com.rashmat.app",
  },
  legal: {
    privacyUrl: "/privacy",
    termsUrl: "/terms",
    supportUrl: "/support",
    deleteAccountUrl: "/delete-account",
    effectiveDate: "September 30, 2026",
    governingLaw: "Portugal",
  },
} as const;

/** Full-bleed hero — local brand still (gi + black belt). */
export const heroImage = "/hero-landing.jpg";

export const athletesImage = "/section-plan.jpg?v=20261003e";

/** Cropped — previous asset had a baked black letterbox on the right. */
export const creatorsImage = "/section-creators.jpg?v=20261003e";

/**
 * Atmosphere behind the CSS phone fan.
 * Prefer a clean still — avoid composites with baked UI/copy or letterbox bars.
 */
export const mocksStage = "/section-plan.jpg?v=20261003e";

/** Individual app screenshots for device frames. Bump `v` when assets change. */
const screenV = "20261003d";
export const appScreens = {
  welcomeHero: `/screens/welcome-hero.jpg?v=${screenV}`,
  signIn: `/screens/sign-in.png?v=${screenV}`,
  hub: `/screens/hub.jpg?v=${screenV}`,
  recover: `/screens/recover.png?v=${screenV}`,
  programs: `/screens/programs.jpg?v=${screenV}`,
  profile: `/screens/profile.png?v=${screenV}`,
  creators: `/screens/creators.png?v=${screenV}`,
  creatorProfile: `/screens/creator-profile.jpg?v=${screenV}`,
  programOverview: `/screens/program-overview.jpg?v=${screenV}`,
  programDays: `/screens/program-days.jpg?v=${screenV}`,
  sessionPreview: `/screens/session-preview.jpg?v=${screenV}`,
  complete: `/screens/complete.jpg?v=${screenV}`,
  studio: `/screens/studio.png?v=${screenV}`,
  library: `/screens/library.png?v=${screenV}`,
} as const;

/** Creator Studio (web CMS) desktop captures — browser frames on the landing. */
const studioWebV = "20261003a";
export const studioWebScreens = {
  dashboard: `/screens/studio-web-dashboard.png?v=${studioWebV}`,
  programs: `/screens/studio-web-programs.png?v=${studioWebV}`,
  program: `/screens/studio-web-program.png?v=${studioWebV}`,
  students: `/screens/studio-web-students.png?v=${studioWebV}`,
  wizard: `/screens/studio-web-new.png?v=${studioWebV}`,
  cms: `/screens/studio-web-cms.png?v=${studioWebV}`,
  followers: `/screens/studio-web-followers.png?v=${studioWebV}`,
  library: `/screens/studio-web-library.png?v=${studioWebV}`,
  settings: `/screens/studio-web-settings.png?v=${studioWebV}`,
  login: `/screens/studio-web-login.png?v=${studioWebV}`,
} as const;

export const igImage = "/ig-section.jpg";
