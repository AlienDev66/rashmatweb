import {
  athletesImage,
  brand,
  creatorsImage,
  heroImage,
  igImage,
} from "./brand";

const root = document.querySelector<HTMLDivElement>("#app");
if (!root) throw new Error("#app missing");

const igSvg = `
  <svg class="btn__ig" viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
    <defs>
      <linearGradient id="ig" x1="3" y1="20" x2="20" y2="3">
        <stop stop-color="#FAAD4F" />
        <stop offset=".35" stop-color="#DD2A7B" />
        <stop offset=".62" stop-color="#9537B0" />
        <stop offset="1" stop-color="#515BD4" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig)" />
    <circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" stroke-width="1.6" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="#fff" />
  </svg>
`;

root.innerHTML = `
  <div class="scroll-progress" aria-hidden="true"><i></i></div>

  <main class="page">
    <section class="hero" aria-label="${brand.name}">
      <div class="hero__stage" aria-hidden="true">
        <div class="hero__bg" style="--img: url('${heroImage}')"></div>
        <div class="hero__grain"></div>
        <div class="hero__veil"></div>
      </div>

      <div class="shell hero__frame">
        <header class="hero__brand" data-reveal="hero">
          <img class="hero__mark" src="/logo-yellow.png" width="72" height="72" alt="" />
          <div class="hero__brand-text">
            <span class="hero__word">${brand.name}</span>
            <span class="hero__tag">Martial arts · Creators · Progress</span>
          </div>
        </header>

        <div class="hero__copy">
          <p class="hero__kicker" data-reveal="hero" data-d="1">
            TRAIN ON THE <span class="accent">MAT</span>
          </p>
          <h1 class="hero__title" data-reveal="hero" data-d="2">
            <span class="outline">BUILD</span>
            <span class="solid">YOUR GAME</span>
          </h1>
          <p class="hero__sub" data-reveal="hero" data-d="3">
            Structured programs from real martial arts creators — drill, track your week,
            and show up ready for live rounds.
          </p>
          <div class="hero__ctas" data-reveal="hero" data-d="4">
            <a class="btn btn--accent" href="${brand.platformUrl}">
              Enter the platform
            </a>
            <a
              class="btn btn--ghost"
              href="${brand.social.instagram}"
              target="_blank"
              rel="noopener noreferrer"
            >
              ${igSvg}
              ${brand.social.handle}
            </a>
          </div>
        </div>
      </div>

      <div class="hero__marquee" aria-hidden="true">
        <div class="hero__marquee-track">
          <span>BJJ</span><span>NO-GI</span><span>MUAY THAI</span><span>MMA</span>
          <span>WRESTLING</span><span>STRIKING</span><span>LIVE ROUNDS</span>
          <span>BJJ</span><span>NO-GI</span><span>MUAY THAI</span><span>MMA</span>
          <span>WRESTLING</span><span>STRIKING</span><span>LIVE ROUNDS</span>
        </div>
      </div>
    </section>

    <section class="band" data-reveal>
      <div class="shell band__inner">
        <p class="band__kicker">WHAT YOU GET</p>
        <ul class="band__list">
          <li>
            <span class="band__n">01</span>
            <div>
              <strong>Creator programs</strong>
                <p>Follow creators who publish real systems — not random clips.</p>
            </div>
          </li>
          <li>
            <span class="band__n">02</span>
            <div>
              <strong>Week on the mats</strong>
              <p>See your training days, rest, and next session in one hub.</p>
            </div>
          </li>
          <li>
            <span class="band__n">03</span>
            <div>
              <strong>Progress that sticks</strong>
              <p>Log rounds, finish sessions, and watch XP + streaks build.</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="split" data-reveal>
      <div class="shell split__grid">
        <div class="split__copy">
          <p class="kicker">FOR ATHLETES</p>
          <h2 class="display">Show up with a plan — not guesswork.</h2>
          <p class="body">
            Pick a program, open today’s session, drill with video, and close the loop.
            Built for gi, no-gi, and striking — the same cadence you need between classes.
          </p>
          <a class="btn btn--accent btn--inline" href="${brand.platformUrl}">Start training →</a>
        </div>
        <div class="split__visual">
          <div class="split__img" style="--img: url('${athletesImage}')"></div>
        </div>
      </div>
    </section>

    <section class="split split--flip" data-reveal>
      <div class="shell split__grid">
        <div class="split__copy">
          <p class="kicker">FOR CREATORS</p>
          <h2 class="display">Publish drills. See who shows up.</h2>
          <p class="body">
            Creator Studio is the same RASHMAT platform — ship programs, structure weeks,
            and track student progress without leaving the brand.
          </p>
          <a class="btn btn--accent btn--inline" href="${brand.studioUrl}">Open Creator Studio →</a>
        </div>
        <div class="split__visual">
          <div class="split__img" style="--img: url('${creatorsImage}')"></div>
        </div>
      </div>
    </section>

    <section class="ig" data-reveal>
      <div class="ig__stage" aria-hidden="true">
        <div class="ig__bg" style="--img: url('${igImage}')"></div>
        <div class="ig__veil"></div>
      </div>
      <div class="shell ig__frame">
        <p class="kicker">${brand.social.handle}</p>
        <h2 class="display display--lg">Behind the drills.<br />On Instagram first.</h2>
        <p class="body ig__body">
          Follow the brand while the platform grows — mats, creators, and the culture.
        </p>
        <a
          class="btn btn--ghost btn--inline"
          href="${brand.social.instagram}"
          target="_blank"
          rel="noopener noreferrer"
        >
          ${igSvg}
          Open Instagram
        </a>
      </div>
    </section>

    <footer class="foot">
      <div class="shell foot__inner">
        <div class="foot__brand">
          <img src="/logo-yellow.png" width="44" height="44" alt="" />
          <span>${brand.name}</span>
        </div>
        <nav class="foot__nav" aria-label="Footer">
          <a href="${brand.platformUrl}">Platform</a>
          <a href="${brand.studioUrl}">Studio</a>
          <a href="${brand.social.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:${brand.email}">${brand.email}</a>
        </nav>
        <p class="foot__meta">${brand.domain}</p>
      </div>
    </footer>
  </main>
`;

/* —— Hero entrance —— */
requestAnimationFrame(() => {
  document.documentElement.classList.add("is-ready");
});

/* —— Scroll progress —— */
const bar = document.querySelector<HTMLElement>(".scroll-progress i");
const onScrollProgress = () => {
  if (!bar) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? window.scrollY / max : 0;
  bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
};
window.addEventListener("scroll", onScrollProgress, { passive: true });
onScrollProgress();

/* —— Reveal on scroll —— */
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

/* —— Soft parallax on hero stage (keeps ken-burns on .hero__bg) —— */
const heroStage = document.querySelector<HTMLElement>(".hero__stage");
const onParallax = () => {
  if (!heroStage) return;
  const y = Math.min(90, window.scrollY * 0.22);
  heroStage.style.transform = `translate3d(0, ${y}px, 0)`;
};
window.addEventListener("scroll", onParallax, { passive: true });
onParallax();
