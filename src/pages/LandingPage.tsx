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
  /** Welcome: hero photo + CSS chrome (screenshot was missing the image). */
  welcome?: boolean;
};

function PhoneMock({ src, alt, label, className = "", welcome }: PhoneProps) {
  return (
    <figure className={`phone ${className}`}>
      <div className="phone__device" aria-hidden={!welcome}>
        <div className="phone__bezel">
          <span className="phone__island" />
          {welcome ? (
            <div className="phone__screen phone__screen--welcome">
              <img src={src} alt="" className="phone__shot" />
              <div className="phone__welcome">
                <p className="phone__welcome-kicker">
                  TRAIN ON THE <span>MAT</span>
                </p>
                <p className="phone__welcome-title">
                  <span className="phone__welcome-outline">BUILD</span>
                  <span className="phone__welcome-solid">YOUR GAME</span>
                </p>
                <p className="phone__welcome-sub">
                  Train with creators who live your sport.
                </p>
                <span className="phone__welcome-cta">FIND YOUR JOURNEY</span>
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
                <span className="hero__tag">Martial arts · Creators · Progress</span>
              </div>
            </header>

            <div className="hero__copy">
              <p className="hero__kicker" data-reveal="hero" data-d="1">
                TRAIN ON THE <span className="accent">MAT</span>
              </p>
              <h1 className="hero__title" data-reveal="hero" data-d="2">
                <span className="outline">BUILD</span>
                <span className="solid">YOUR GAME</span>
              </h1>
              <p className="hero__sub" data-reveal="hero" data-d="3">
                Train with creators who live your sport — drill, track your week, and show up ready
                for live rounds.
              </p>
              <div className="hero__ctas" data-reveal="hero" data-d="4">
                <a className="btn btn--accent" href={brand.platformUrl}>
                  Enter the platform
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
              <span>BJJ</span>
              <span>NO-GI</span>
              <span>MUAY THAI</span>
              <span>MMA</span>
              <span>WRESTLING</span>
              <span>STRIKING</span>
              <span>LIVE ROUNDS</span>
              <span>BJJ</span>
              <span>NO-GI</span>
              <span>MUAY THAI</span>
              <span>MMA</span>
              <span>WRESTLING</span>
              <span>STRIKING</span>
              <span>LIVE ROUNDS</span>
            </div>
          </div>
        </section>

        <section className="band" data-reveal>
          <div className="shell band__inner">
            <div className="band__head">
              <p className="band__kicker">WHAT YOU GET</p>
              <h2 className="band__title">One hub. Real systems. Measurable weeks.</h2>
            </div>
            <ul className="band__list">
              <li>
                <span className="band__n">01</span>
                <div>
                  <strong>Train with creators</strong>
                  <p>Follow creators and unlock real systems — not random clips.</p>
                </div>
              </li>
              <li>
                <span className="band__n">02</span>
                <div>
                  <strong>Week on the mats</strong>
                  <p>See your training days, rest, and next session in one hub.</p>
                </div>
              </li>
              <li>
                <span className="band__n">03</span>
                <div>
                  <strong>Progress that sticks</strong>
                  <p>Log rounds, finish sessions, and watch XP + streaks build.</p>
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
              <p className="kicker">FOR ATHLETES</p>
              <h2 className="display">
                Show up with a plan —
                <br />
                <span className="accent">not guesswork.</span>
              </h2>
              <p className="body">
                Pick a program, open today&apos;s session, drill with video, and close the loop.
                Built for gi, no-gi, and striking — the same cadence you need between classes.
              </p>
              <ul className="feature__points">
                <li>Session video + rest timers</li>
                <li>Week strip with rest days</li>
                <li>XP, streaks, follow creators</li>
              </ul>
              <a className="btn btn--accent btn--inline" href={brand.platformUrl}>
                Start training →
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
              <p className="kicker">FOR CREATORS</p>
              <h2 className="display">
                Publish drills.
                <br />
                <span className="accent">See who shows up.</span>
              </h2>
              <p className="body">
                Creator Studio is the RASHMAT web CMS — ship programs, structure weeks, track
                students, and see who follows your profile.
              </p>
              <ul className="feature__points">
                <li>Programs → sessions → drills</li>
                <li>Storage video uploads</li>
                <li>Students + followers</li>
              </ul>
              <Link className="btn btn--accent btn--inline" to={brand.studioUrl}>
                Open Creator Studio →
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
              <p className="kicker">INSIDE THE APP</p>
              <h2 className="display">
                From welcome to
                <br />
                <span className="accent">live rounds.</span>
              </h2>
              <p className="body">
                Hub, session player, creators you follow, XP, and the rules library — the athlete
                product in one glance.
              </p>
            </div>

            <div className="phone-fan" role="list">
              <PhoneMock
                className="phone--fan phone--f1"
                src={appScreens.welcomeHero}
                alt="Welcome — Build your game"
                label="Welcome"
                welcome
              />
              <PhoneMock
                className="phone--fan phone--f2"
                src={appScreens.signIn}
                alt="Sign in to RASHMAT"
                label="Sign in"
              />
              <PhoneMock
                className="phone--fan phone--f3 phone--featured"
                src={appScreens.hub}
                alt="Training hub with week strip and start session"
                label="Training hub"
              />
              <PhoneMock
                className="phone--fan phone--f4"
                src={appScreens.recover}
                alt="Session rest timer"
                label="Session player"
              />
              <PhoneMock
                className="phone--fan phone--f5"
                src={appScreens.programs}
                alt="Programs catalog"
                label="Programs"
              />
              <PhoneMock
                className="phone--fan phone--f6"
                src={appScreens.profile}
                alt="Profile with XP and achievements"
                label="Profile"
              />
            </div>

            <div className="phone-rail" role="list">
              <PhoneMock
                className="phone--rail"
                src={appScreens.creators}
                alt="Creators directory — follow and train"
                label="Follow creators"
              />
              <PhoneMock
                className="phone--rail"
                src={appScreens.complete}
                alt="Session complete with XP share card"
                label="XP & share"
              />
              <PhoneMock
                className="phone--rail"
                src={appScreens.studio}
                alt="Creator Studio dashboard"
                label="Creator Studio"
              />
              <PhoneMock
                className="phone--rail"
                src={appScreens.library}
                alt="Rules library"
                label="Rules library"
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
              Behind the drills.
              <br />
              On Instagram first.
            </h2>
            <p className="body ig__body">
              Follow the brand while the platform grows — mats, creators, and the culture.
            </p>
            <a
              className="btn btn--ghost btn--inline"
              href={brand.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IgIcon />
              Open Instagram
            </a>
          </div>
        </section>

        <footer className="foot">
          <div className="shell foot__inner">
            <div className="foot__brand">
              <img src="/logo-yellow.png" width={44} height={44} alt="" />
              <span>{brand.name}</span>
            </div>
            <nav className="foot__nav" aria-label="Footer">
              <a href={brand.platformUrl}>Platform</a>
              <Link to={brand.studioUrl}>Studio</Link>
              <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href={`mailto:${brand.email}`}>{brand.email}</a>
            </nav>
            <p className="foot__meta">{brand.domain}</p>
          </div>
        </footer>
      </main>
    </>
  );
}
