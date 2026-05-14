import { chromium, Page } from "@playwright/test";

const BASE = "http://localhost:3000";
const OUT = "public/readme";

async function screenshot(page: Page, name: string) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  console.log(`  ✓ ${name}.png`);
}

async function login(page: Page) {
  await page.goto(`${BASE}/auth/login`);
  await page.getByTestId("email").fill("success@test.com");
  await page.getByTestId("password").fill("Password1!");
  await page.getByRole("button", { name: /login/i }).click();
  await page.waitForURL(BASE + "/", { timeout: 10000 }).catch(() => {});
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });

  console.log("Desktop screenshots (1440×900):");

  // --- Public pages (no auth needed) ---
  const d1 = await desktop.newPage();
  await d1.goto(BASE + "/", { waitUntil: "networkidle" });
  await screenshot(d1, "home-page");
  await d1.close();

  const d2 = await desktop.newPage();
  await d2.goto(BASE + "/car/search?query=Toyota", {
    waitUntil: "networkidle",
  });
  await screenshot(d2, "car-search");
  await d2.close();

  const d3 = await desktop.newPage();
  await d3.goto(BASE + "/car/car-1", { waitUntil: "networkidle" });
  await screenshot(d3, "car-detail");
  await d3.close();

  // --- Authenticated pages ---
  const d4 = await desktop.newPage();
  await login(d4);
  await d4.goto(BASE + "/car/car-1/appointment", { waitUntil: "networkidle" });
  await screenshot(d4, "appointment-flow");
  await d4.close();

  const d5 = await desktop.newPage();
  await login(d5);
  await d5.goto(BASE + "/post/discover", { waitUntil: "networkidle" });
  await screenshot(d5, "community-posts");
  await d5.close();

  const d6 = await desktop.newPage();
  await d6.goto(BASE + "/auth/login", { waitUntil: "networkidle" });
  await screenshot(d6, "login-page");
  await d6.close();

  const d7 = await desktop.newPage();
  await d7.goto(BASE + "/auth/register", { waitUntil: "networkidle" });
  await screenshot(d7, "register-page");
  await d7.close();

  // Mobile shots
  console.log("Mobile screenshots (390×844):");
  const m1 = await mobile.newPage();
  await m1.goto(BASE + "/", { waitUntil: "networkidle" });
  await screenshot(m1, "mobile-view");
  await m1.close();

  await browser.close();
  console.log("\nDone — screenshots saved to public/readme/");
})();
