import { isSupabaseConfigured, supabase } from "./supabase";

export type StripeMode = "test" | "live";

const functionsBase = () => {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  return `${url.replace(/\/$/, "")}/functions/v1`;
};

/** Call Edge Function and surface JSON `{ error }` on non-2xx. */
async function invokeFunction<T extends Record<string, unknown>>(
  name: string,
  body: Record<string, unknown>,
): Promise<{ data: T | null; error: string | null }> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) return { data: null, error: "Unauthorized" };

  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  const res = await fetch(`${functionsBase()}/${name}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: anon,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  let payload: T & { error?: string } = {} as T & { error?: string };
  try {
    payload = (await res.json()) as T & { error?: string };
  } catch {
    if (!res.ok) return { data: null, error: `Edge Function HTTP ${res.status}` };
  }

  if (!res.ok || payload?.error) {
    return {
      data: payload,
      error: payload?.error || `Edge Function HTTP ${res.status}`,
    };
  }
  return { data: payload, error: null };
}

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
  const { data, error } = await invokeFunction<ConnectStatus & { error?: string }>(
    "stripe-connect-onboard",
    { returnOrigin: window.location.origin },
  );
  if (error) {
    return { url: null, ready: false, error };
  }
  const payload = data!;
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
  const { data, error } = await invokeFunction<{
    url?: string;
    error?: string;
    already?: boolean;
  }>("stripe-checkout", {
    programId,
    returnOrigin: window.location.origin,
  });
  if (error) {
    return {
      url: null,
      error,
      already: Boolean(data?.already),
    };
  }
  return { url: data?.url ?? null, error: null as string | null, already: false };
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
