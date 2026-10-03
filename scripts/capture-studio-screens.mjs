/**
 * One-off: capture Creator Studio web screenshots into public/screens/.
 * Usage (from web/): EMAIL=… PASSWORD=… npx -p playwright@1.55.0 node scripts/capture-studio-screens.mjs
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BASE = process.env.STUDIO_BASE || "http://127.0.0.1:5173";
const OUT = path.join(ROOT, "public/screens");
const email = process.env.EMAIL;
const password = process.env.PASSWORD;

if (!email || !password) {
  console.error("Set EMAIL and PASSWORD");
  process.exit(1);
}

async function dismissTour(page) {
  for (let i = 0; i < 10; i++) {
    const btn = page
      .locator(
        'button:has-text("Skip"), button:has-text("Saltar"), button:has-text("Done"), button:has-text("Concluir"), button:has-text("Next"), button:has-text("Seguinte"), button:has-text("Got it"), button:has-text("Entendi")',
      )
      .first();
    if (!(await btn.isVisible().catch(() => false))) break;
    const label = ((await btn.innerText().catch(() => "")) || "").toLowerCase();
    await btn.click().catch(() => {});
    await page.waitForTimeout(300);
    if (
      label.includes("skip") ||
      label.includes("saltar") ||
      label.includes("done") ||
      label.includes("concluir") ||
      label.includes("got") ||
      label.includes("entendi")
    ) {
      break;
    }
  }
  await page.keyboard.press("Escape").catch(() => {});
  await page.evaluate(() => {
    document.querySelectorAll("[class*='tour']").forEach((el) => {
      const cn = String(el.className || "");
      if (!cn.includes("tour")) return;
      const style = getComputedStyle(el);
      if (style.position === "fixed") el.style.setProperty("display", "none", "important");
    });
  }).catch(() => {});
}

async function shot(page, file) {
  await dismissTour(page);
  await page.waitForTimeout(500);
  const dest = path.join(OUT, file);
  await page.screenshot({ path: dest, type: "png" });
  console.log("saved", file);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();
fs.mkdirSync(OUT, { recursive: true });

await page.goto(`${BASE}/studio/login`, { waitUntil: "networkidle" });
await page.fill('input[type="email"]', email);
await page.fill('input[type="password"]', password);
await page.click('button[type="submit"]');
await page.waitForURL(/\/studio(\/|$|\?)/, { timeout: 45000 });
await page.waitForTimeout(1400);
await dismissTour(page);

const routes = [
  ["studio-web-dashboard.png", "/studio"],
  ["studio-web-programs.png", "/studio/programs"],
  ["studio-web-cms.png", "/studio/cms"],
  ["studio-web-students.png", "/studio/students"],
  ["studio-web-followers.png", "/studio/followers"],
  ["studio-web-library.png", "/studio/library"],
  ["studio-web-settings.png", "/studio/settings"],
  ["studio-web-new.png", "/studio/programs/new"],
];

for (const [file, route] of routes) {
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await shot(page, file);
}

await page.goto(`${BASE}/studio/programs`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const link = page.locator('a[href*="/studio/programs/"]').filter({ hasNotText: "new" }).first();
if (await link.count()) {
  await link.click();
  await page.waitForURL(/\/studio\/programs\/[^n]/, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1100);
  await shot(page, "studio-web-program.png");
} else {
  console.log("skip program detail — no link");
}

await context.clearCookies();
await page.evaluate(() => localStorage.clear());
await page.goto(`${BASE}/studio/login`, { waitUntil: "networkidle" });
await page.waitForTimeout(700);
await shot(page, "studio-web-login.png");

await browser.close();
console.log("done");
