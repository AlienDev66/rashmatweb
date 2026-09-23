import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  athletesImage,
  brand,
  creatorsImage,
  heroImage,
  igImage,
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
                Structured programs from real martial arts creators — drill, track your week, and
                show up ready for live rounds.
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
            <p className="band__kicker">WHAT YOU GET</p>
            <ul className="band__list">
              <li>
                <span className="band__n">01</span>
                <div>
                  <strong>Creator programs</strong>
                  <p>Follow creators who publish real systems — not random clips.</p>
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

        <section className="split" data-reveal>
          <div className="shell split__grid">
            <div className="split__copy">
              <p className="kicker">FOR ATHLETES</p>
              <h2 className="display">Show up with a plan — not guesswork.</h2>
              <p className="body">
                Pick a program, open today&apos;s session, drill with video, and close the loop.
                Built for gi, no-gi, and striking — the same cadence you need between classes.
              </p>
              <a className="btn btn--accent btn--inline" href={brand.platformUrl}>
                Start training →
              </a>
            </div>
            <div className="split__visual">
              <div
                className="split__img"
                style={{ ["--img" as string]: `url('${athletesImage}')` }}
              />
            </div>
          </div>
        </section>

        <section className="split split--flip" data-reveal>
          <div className="shell split__grid">
            <div className="split__copy">
              <p className="kicker">FOR CREATORS</p>
              <h2 className="display">Publish drills. See who shows up.</h2>
              <p className="body">
                Creator Studio is the same RASHMAT platform — ship programs, structure weeks, and
                track student progress without leaving the brand.
              </p>
              <Link className="btn btn--accent btn--inline" to={brand.studioUrl}>
                Open Creator Studio →
              </Link>
            </div>
            <div className="split__visual">
              <div
                className="split__img"
                style={{ ["--img" as string]: `url('${creatorsImage}')` }}
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
