import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  appScreens,
  athletesImage,
  brand,
  creatorsImage,
  heroImage,
  igImage,
  mocksStage,
} from "../brand";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { SiteFooter } from "../components/SiteFooter";
import { useI18n, useT } from "../i18n";
import { messages } from "../i18n/messages";

const IgIcon = () => (
  <svg className="btn__ig" viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
    <defs>
      <linearGradient id="ig" x1="3" y1="20" x2="20" y2="3">
        <stop stopColor="#FAAD4F" />
        <stop offset=".35" stopColor="#DD2A7B" />
        <stop offset=".62" stopColor="#9537B0" />
        <stop offset="1" stopColor="#515BD4" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig)" />
    <circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="1.6" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="#fff" />
  </svg>
);

type PhoneProps = {
  src: string;
  alt: string;
  label: string;
  className?: string;
  welcome?: boolean;
  welcomeCopy?: {
    kicker: string;
    kickerAccent: string;
    titleOutline: string;
    titleSolid: string;
    sub: string;
    cta: string;
  };
};

function PhoneMock({ src, alt, label, className = "", welcome, welcomeCopy }: PhoneProps) {
  return (
    <figure className={`phone ${className}`}>
      <div className="phone__device" aria-hidden={!welcome}>
        <div className="phone__bezel">
          <span className="phone__island" />
          {welcome && welcomeCopy ? (
            <div className="phone__screen phone__screen--welcome">
              <img src={src} alt="" className="phone__shot" />
              <div className="phone__welcome">
                <p className="phone__welcome-kicker">
                  {welcomeCopy.kicker} <span>{welcomeCopy.kickerAccent}</span>
                </p>
                <p className="phone__welcome-title">
                  <span className="phone__welcome-outline">{welcomeCopy.titleOutline}</span>
                  <span className="phone__welcome-solid">{welcomeCopy.titleSolid}</span>
                </p>
                <p className="phone__welcome-sub">{welcomeCopy.sub}</p>
                <span className="phone__welcome-cta">{welcomeCopy.cta}</span>
              </div>
            </div>
          ) : (
            <img src={src} alt={alt} className="phone__shot" loading="lazy" />
          )}
        </div>
      </div>
      <figcaption className="phone__cap">{label}</figcaption>
    </figure>
  );
}

export function LandingPage() {
  const t = useT();
  const { locale } = useI18n();
  const marquee = messages[locale].landing.marquee;

  useEffect(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.add("is-ready");
    });

    const bar = document.querySelector<HTMLElement>(".scroll-progress i");
    const onScrollProgress = () => {
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    };
    window.addEventListener("scroll", onScrollProgress, { passive: true });
    onScrollProgress();

    const reveals = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    reveals.forEach((el) => io.observe(el));

    const heroStage = document.querySelector<HTMLElement>(".hero__stage");
    const onParallax = () => {
      if (!heroStage) return;
      const y = Math.min(90, window.scrollY * 0.22);
      heroStage.style.transform = `translate3d(0, ${y}px, 0)`;
    };
    window.addEventListener("scroll", onParallax, { passive: true });
    onParallax();

    return () => {
      window.removeEventListener("scroll", onScrollProgress);
      window.removeEventListener("scroll", onParallax);
      io.disconnect();
      document.documentElement.classList.remove("is-ready");
    };
  }, []);

  const welcomeCopy = {
    kicker: t("landing.kicker"),
    kickerAccent: t("landing.kickerAccent"),
    titleOutline: t("landing.titleOutline"),
    titleSolid: t("landing.titleSolid"),
    sub: t("landing.sub"),
    cta: t("landing.athletesCta").replace(" →", "").toUpperCase(),
  };

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <i />
      </div>

      <main className="page">
        <section className="hero" aria-label={brand.name}>
          <div className="hero__stage" aria-hidden="true">
            <div className="hero__bg" style={{ ["--img" as string]: `url('${heroImage}')` }} />
            <div className="hero__grain" />
            <div className="hero__veil" />
          </div>

          <div className="shell hero__frame">
            <header className="hero__brand" data-reveal="hero">
              <img className="hero__mark" src="/logo-yellow.png" width={72} height={72} alt="" />
              <div className="hero__brand-text">
                <span className="hero__word">{brand.name}</span>
                <span className="hero__tag">{t("landing.brandTag")}</span>
              </div>
              <LanguageSwitcher className="hero__lang" />
            </header>

            <div className="hero__copy">
              <p className="hero__kicker" data-reveal="hero" data-d="1">
                {t("landing.kicker")} <span className="accent">{t("landing.kickerAccent")}</span>
              </p>
              <h1 className="hero__title" data-reveal="hero" data-d="2">
                <span className="outline">{t("landing.titleOutline")}</span>
                <span className="solid">{t("landing.titleSolid")}</span>
              </h1>
              <p className="hero__sub" data-reveal="hero" data-d="3">
                {t("landing.sub")}
              </p>
              <div className="hero__ctas" data-reveal="hero" data-d="4">
                <a className="btn btn--accent" href={brand.platformUrl}>
                  {t("landing.ctaPlatform")}
                </a>
                <a
                  className="btn btn--ghost"
                  href={brand.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IgIcon />
                  {brand.social.handle}
                </a>
              </div>
            </div>
          </div>

          <div className="hero__marquee" aria-hidden="true">
            <div className="hero__marquee-track">
              {[...marquee, ...marquee].map((item, i) => (
                <span key={`${item}-${i}`}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="band" data-reveal>
          <div className="shell band__inner">
            <div className="band__head">
              <p className="band__kicker">{t("landing.bandKicker")}</p>
              <h2 className="band__title">{t("landing.bandTitle")}</h2>
            </div>
            <ul className="band__list">
              <li>
                <span className="band__n">01</span>
                <div>
                  <strong>{t("landing.band1Title")}</strong>
                  <p>{t("landing.band1Body")}</p>
                </div>
              </li>
              <li>
                <span className="band__n">02</span>
                <div>
                  <strong>{t("landing.band2Title")}</strong>
                  <p>{t("landing.band2Body")}</p>
                </div>
              </li>
              <li>
                <span className="band__n">03</span>
                <div>
                  <strong>{t("landing.band3Title")}</strong>
                  <p>{t("landing.band3Body")}</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="feature" data-reveal>
          <div
            className="feature__media"
            style={{ ["--img" as string]: `url('${athletesImage}')` }}
            aria-hidden="true"
          />
          <div className="feature__veil feature__veil--left" aria-hidden="true" />
          <div className="shell feature__frame">
            <div className="feature__copy">
              <p className="kicker">{t("landing.athletesKicker")}</p>
              <h2 className="display">
                {t("landing.athletesTitle1")}
                <br />
                <span className="accent">{t("landing.athletesTitle2")}</span>
              </h2>
              <p className="body">{t("landing.athletesBody")}</p>
              <ul className="feature__points">
                <li>{t("landing.athletesP1")}</li>
                <li>{t("landing.athletesP2")}</li>
                <li>{t("landing.athletesP3")}</li>
              </ul>
              <a className="btn btn--accent btn--inline" href={brand.platformUrl}>
                {t("landing.athletesCta")}
              </a>
            </div>
          </div>
        </section>

        <section className="feature feature--flip" data-reveal>
          <div
            className="feature__media"
            style={{ ["--img" as string]: `url('${creatorsImage}')` }}
            aria-hidden="true"
          />
          <div className="feature__veil feature__veil--right" aria-hidden="true" />
          <div className="shell feature__frame feature__frame--end">
            <div className="feature__copy">
              <p className="kicker">{t("landing.creatorsKicker")}</p>
              <h2 className="display">
                {t("landing.creatorsTitle1")}
                <br />
                <span className="accent">{t("landing.creatorsTitle2")}</span>
              </h2>
              <p className="body">{t("landing.creatorsBody")}</p>
              <ul className="feature__points">
                <li>{t("landing.creatorsP1")}</li>
                <li>{t("landing.creatorsP2")}</li>
                <li>{t("landing.creatorsP3")}</li>
              </ul>
              <Link className="btn btn--accent btn--inline" to={brand.studioUrl}>
                {t("landing.creatorsCta")}
              </Link>
            </div>
          </div>
        </section>

        <section className="mocks" data-reveal>
          <div
            className="mocks__stage"
            style={{ ["--stage" as string]: `url('${mocksStage}')` }}
            aria-hidden="true"
          />
          <div className="mocks__veil" aria-hidden="true" />
          <div className="shell mocks__inner">
            <div className="mocks__head">
              <p className="kicker">{t("landing.mocksKicker")}</p>
              <h2 className="display">
                {t("landing.mocksTitle1")}
                <br />
                <span className="accent">{t("landing.mocksTitle2")}</span>
              </h2>
              <p className="body">{t("landing.mocksBody")}</p>
            </div>

            <div className="phone-fan" role="list">
              <PhoneMock
                className="phone--fan phone--f1"
                src={appScreens.welcomeHero}
                alt={t("landing.mockWelcome")}
                label={t("landing.mockWelcome")}
                welcome
                welcomeCopy={welcomeCopy}
              />
              <PhoneMock
                className="phone--fan phone--f2 phone--featured"
                src={appScreens.hub}
                alt={t("landing.mockHub")}
                label={t("landing.mockHub")}
              />
              <PhoneMock
                className="phone--fan phone--f3"
                src={appScreens.sessionPreview}
                alt={t("landing.mockSession")}
                label={t("landing.mockSession")}
              />
              <PhoneMock
                className="phone--fan phone--f4"
                src={appScreens.programOverview}
                alt={t("landing.mockProgram")}
                label={t("landing.mockProgram")}
              />
              <PhoneMock
                className="phone--fan phone--f5"
                src={appScreens.creators}
                alt={t("landing.mockCreators")}
                label={t("landing.mockCreators")}
              />
              <PhoneMock
                className="phone--fan phone--f6"
                src={appScreens.complete}
                alt={t("landing.mockXp")}
                label={t("landing.mockXp")}
              />
            </div>

            <div className="phone-rail" role="list">
              <PhoneMock
                className="phone--rail"
                src={appScreens.creatorProfile}
                alt={t("landing.mockCreatorProfile")}
                label={t("landing.mockCreatorProfile")}
              />
              <PhoneMock
                className="phone--rail"
                src={appScreens.studio}
                alt={t("landing.mockStudio")}
                label={t("landing.mockStudio")}
              />
            </div>
          </div>
        </section>

        <section className="ig" data-reveal>
          <div className="ig__stage" aria-hidden="true">
            <div className="ig__bg" style={{ ["--img" as string]: `url('${igImage}')` }} />
            <div className="ig__veil" />
          </div>
          <div className="shell ig__frame">
            <p className="kicker">{brand.social.handle}</p>
            <h2 className="display display--lg">
              {t("landing.igTitle1")}
              <br />
              {t("landing.igTitle2")}
            </h2>
            <p className="body ig__body">{t("landing.igBody")}</p>
            <a
              className="btn btn--ghost btn--inline"
              href={brand.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IgIcon />
              {t("landing.igCta")}
            </a>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
