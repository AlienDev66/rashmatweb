import { isSupabaseConfigured, supabase } from "./supabase";

export type StripeMode = "test" | "live";

/** localhost → Stripe test; production host → Stripe live. */
export function stripeModeForBrowser(): StripeMode {
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" ? "test" : "live";
}

export function creatorPayoutsReady(profile: {
  stripe_charges_enabled?: boolean | null;
  stripe_charges_enabled_live?: boolean | null;
} | null | undefined): boolean {
  if (!profile) return false;
  return stripeModeForBrowser() === "test"
    ? Boolean(profile.stripe_charges_enabled)
    : Boolean(profile.stripe_charges_enabled_live);
}

export type ConnectStatus = {
  url: string | null;
  ready: boolean;
  mode?: StripeMode;
  charges_enabled?: boolean;
  details_submitted?: boolean;
  error?: string;
};

export async function startStripeConnectOnboarding(): Promise<ConnectStatus> {
  if (!isSupabaseConfigured) {
    return { url: null, ready: false, error: "errors.supabaseMissing" };
  }
  const { data, error } = await supabase.functions.invoke("stripe-connect-onboard", {
    method: "POST",
    body: { returnOrigin: window.location.origin },
  });
  if (error) {
    return { url: null, ready: false, error: error.message };
  }
  const payload = data as ConnectStatus & { error?: string };
  if (payload?.error) {
    return { url: null, ready: false, error: payload.error };
  }
  return {
    url: payload.url ?? null,
    ready: Boolean(payload.ready),
    mode: payload.mode,
    charges_enabled: payload.charges_enabled,
    details_submitted: payload.details_submitted,
  };
}

export async function createProgramCheckout(programId: string) {
  if (!isSupabaseConfigured) {
    return { url: null as string | null, error: "errors.supabaseMissing", already: false };
  }
  const { data, error } = await supabase.functions.invoke("stripe-checkout", {
    method: "POST",
    body: { programId, returnOrigin: window.location.origin },
  });
  if (error) {
    return { url: null, error: error.message, already: false };
  }
  const payload = data as {
    url?: string;
    error?: string;
    already?: boolean;
  };
  if (payload?.error) {
    return {
      url: null,
      error: payload.error,
      already: Boolean(payload.already),
    };
  }
  return { url: payload.url ?? null, error: null as string | null, already: false };
}

export function formatPriceCents(cents: number | null | undefined, currency = "eur") {
  if (cents == null || cents <= 0) return null;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}
