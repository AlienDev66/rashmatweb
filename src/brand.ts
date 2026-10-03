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

export const athletesImage = "/section-plan.jpg";

export const creatorsImage = "/section-creators.jpg";

/** Atmosphere behind the CSS phone fan. */
export const mocksStage = "/mocks-stage.png";

/** Individual app screenshots for device frames. */
export const appScreens = {
  welcomeHero: "/screens/welcome-hero.jpg",
  signIn: "/screens/sign-in.png",
  hub: "/screens/hub.jpg",
  recover: "/screens/recover.png",
  programs: "/screens/programs.jpg",
  profile: "/screens/profile.png",
  creators: "/screens/creators.png",
  creatorProfile: "/screens/creator-profile.jpg",
  programOverview: "/screens/program-overview.jpg",
  programDays: "/screens/program-days.jpg",
  sessionPreview: "/screens/session-preview.jpg",
  complete: "/screens/complete.jpg",
  studio: "/screens/studio.png",
  library: "/screens/library.png",
} as const;

export const igImage = "/ig-section.jpg";
