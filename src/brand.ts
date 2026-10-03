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

/** Individual app screenshots for device frames. Bump `v` when assets change. */
const screenV = "20261003c";
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

export const igImage = "/ig-section.jpg";
