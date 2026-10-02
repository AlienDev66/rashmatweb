import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth";
import { brand } from "../brand";
import { useT } from "../i18n";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { createProgramCheckout, formatPriceCents } from "../lib/stripeConnect";

type PublicProgram = {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  level: string;
  weeks: number;
  days_per_week: number;
  minutes: number;
  status: string;
  is_premium: boolean;
  price_cents: number | null;
  currency: string;
};

export function ProgramSharePage() {
  const { id = "" } = useParams();
  const [search] = useSearchParams();
  const t = useT();
  const { user, ready } = useAuth();
  const [program, setProgram] = useState<PublicProgram | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyBusy, setBuyBusy] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [enrolled, setEnrolled] = useState(false);

  const deepLink = `rashmat://program/${id}`;
  const paid = search.get("paid");

  useEffect(() => {
    if (paid === "1") setFlash(t("share.paidOk"));
    if (paid === "0") setFlash(t("share.paidCancel"));
  }, [paid, t]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!id) {
        setError("errors.missingProgramId");
        setLoading(false);
        return;
      }
      if (!isSupabaseConfigured) {
        setError("errors.supabaseMissing");
        setLoading(false);
        return;
      }
      const { data, error: err } = await supabase
        .from("programs")
        .select(
          "id, title, description, cover_url, level, weeks, days_per_week, minutes, status, is_premium, price_cents, currency",
        )
        .eq("id", id)
        .maybeSingle();
      if (cancelled) return;
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      if (!data || data.status !== "published") {
        setError("errors.programUnavailable");
        setLoading(false);
        return;
      }
      setProgram(data as PublicProgram);
      setLoading(false);
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!user || !id || !isSupabaseConfigured) {
        setEnrolled(false);
        return;
      }
      const { data } = await supabase
        .from("user_program_enrollments")
        .select("program_id")
        .eq("user_id", user.id)
        .eq("program_id", id)
        .maybeSingle();
      if (!cancelled) setEnrolled(Boolean(data));
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [user, id, paid]);

  const openApp = () => {
    window.location.href = deepLink;
  };

  const onBuy = async () => {
    if (!program) return;
    if (!user) {
      window.location.href = `/studio/login?next=${encodeURIComponent(`/p/${program.id}`)}`;
      return;
    }
    setBuyBusy(true);
    const result = await createProgramCheckout(program.id);
    setBuyBusy(false);
    if (result.already) {
      setEnrolled(true);
      setFlash(t("share.alreadyOwned"));
      return;
    }
    if (result.error || !result.url) {
      setFlash(result.error ?? t("errors.failed"));
      return;
    }
    window.location.href = result.url;
  };

  const priced =
    program?.is_premium && program.price_cents != null && program.price_cents > 0;
  const priceLabel = priced
    ? formatPriceCents(program!.price_cents, program!.currency)
    : null;

  return (
    <div className="share-page">
      <header className="share-top">
        <Link to="/" className="studio-brand">
          <img src="/logo-yellow.png" width={40} height={40} alt="" />
          <span>{brand.name}</span>
        </Link>
      </header>

      <main className="share-main">
        {loading || !ready ? <p className="studio-muted">{t("share.loading")}</p> : null}
        {error ? (
          <div className="share-card">
            <h1>{t("share.unavailable")}</h1>
            <p className="studio-muted">{t(error)}</p>
            <Link className="studio-btn studio-btn--accent" to="/">
              {t("share.backToSite")}
            </Link>
          </div>
        ) : null}
        {program ? (
          <div className="share-card">
            <div
              className="share-cover"
              style={
                program.cover_url
                  ? { ["--cover" as string]: `url('${program.cover_url}')` }
                  : undefined
              }
            />
            <p className="studio-kicker">{t("share.kicker")}</p>
            <h1>{program.title}</h1>
            <p className="studio-muted">
              {t("share.meta", {
                weeks: program.weeks,
                days: program.days_per_week,
                minutes: program.minutes,
                level: t(`studio.levels.${program.level}`),
              })}
            </p>
            {priceLabel ? (
              <p className="share-price">{t("share.price", { price: priceLabel })}</p>
            ) : null}
            {program.description ? <p className="share-desc">{program.description}</p> : null}
            {flash ? <p className="studio-flash">{flash}</p> : null}

            <div className="share-actions">
              {enrolled ? (
                <button type="button" className="studio-btn studio-btn--accent" onClick={openApp}>
                  {t("share.openApp")}
                </button>
              ) : priced ? (
                <button
                  type="button"
                  className="studio-btn studio-btn--accent"
                  disabled={buyBusy}
                  onClick={() => void onBuy()}
                >
                  {buyBusy ? t("common.loading") : t("share.buyAccess")}
                </button>
              ) : (
                <button type="button" className="studio-btn studio-btn--accent" onClick={openApp}>
                  {t("share.openApp")}
                </button>
              )}
              <a className="studio-btn studio-btn--ghost" href={brand.platformUrl}>
                {t("share.getApp")}
              </a>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
