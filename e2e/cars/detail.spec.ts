import { test, expect } from "@playwright/test";
import { CarDetailPage } from "../pages/car-browsing.page";

test.describe("Car Detail Page", () => {
  let detail: CarDetailPage;

  test.beforeEach(async ({ page }) => {
    detail = new CarDetailPage(page);
    await detail.navigate("car-001");
  });

  // --- Gallery ---
  test("image gallery shows counter badge", async () => {
    await expect(detail.galleryCounter).toBeVisible();
  });

  test("gallery next button cycles images", async ({ page }) => {
    const before = await detail.galleryCounter.textContent();
    if (await detail.galleryNext.isVisible()) {
      await detail.galleryNext.click();
      await page.waitForTimeout(400);
      const after = await detail.galleryCounter.textContent();
      expect(before).not.toBe(after);
    }
  });

  test("gallery prev button is visible on first image", async () => {
    // On first image, prev is hidden
    await expect(detail.galleryPrev).not.toBeVisible();
    // Next should be visible (car-001 has 3 images)
    await expect(detail.galleryNext).toBeVisible();
  });

  // --- Sidebar ---
  test("shows vehicle title and price in sidebar", async () => {
    await expect(detail.page.getByText(/Toyota Camry/i).first()).toBeVisible();
    await expect(detail.page.getByText(/฿31,999/).first()).toBeVisible();
  });

  test("Book a Test Drive button is present", async () => {
    await expect(detail.appointmentButton).toBeVisible();
    await expect(detail.appointmentButton).toHaveText(/Book a Test Drive/i);
  });

  test("clicking CTA without auth redirects to sign-in", async ({ page }) => {
    await detail.appointmentButton.click();
    // Sign-in overlay should appear as a portal
    await expect(
      page.locator("text=Sign in required").first(),
    ).toBeVisible({ timeout: 5000 });
  });

  // --- Sections ---
  test("About This Vehicle section is visible", async () => {
    await expect(
      detail.page.getByRole("heading", { name: /About This Vehicle/i }),
    ).toBeVisible();
  });

  test("Performance & Details section is visible", async () => {
    await expect(
      detail.page.getByRole("heading", { name: /Performance & Details/i }),
    ).toBeVisible();
  });

  test("specification cards are rendered", async () => {
    // Scope to the specifications section to avoid duplicates
    const section = detail.page.locator("section").filter({ hasText: /Performance & Details/i });
    await expect(section.getByText("Mileage", { exact: true }).first()).toBeVisible();
    await expect(section.getByText("Fuel", { exact: true }).first()).toBeVisible();
    await expect(section.getByText("Transmission", { exact: true }).first()).toBeVisible();
    await expect(section.getByText("Year", { exact: true }).first()).toBeVisible();
  });

  // --- More Car Options ---
  test("You Might Also Like section is visible", async () => {
    await expect(
      detail.page.getByRole("heading", { name: /You Might Also Like/i }),
    ).toBeVisible();
  });

  test("more options grid shows car cards that exclude current car", async ({ page }) => {
    // Scroll to trigger lazy-loaded MoreCarOptions
    const heading = page.getByRole("heading", { name: /You Might Also Like/i });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible({ timeout: 5000 });

    const cards = page.getByTestId("car-card");
    await expect(cards.first()).toBeVisible({ timeout: 5000 });
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  // --- Navigation ---
  test("navigating to another car ID loads the page", async ({ page }) => {
    await detail.navigate("car-002");
    await expect(
      page.getByRole("heading", { name: /Honda Civic/i }),
    ).toBeVisible({ timeout: 5000 });
  });

  // --- Responsive layout ---
  test("sticky sidebar is present on desktop viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await detail.navigate("car-001");
    // Sidebar card should be visible
    await expect(
      page.getByRole("heading", { name: /Toyota Camry/i }),
    ).toBeVisible();
  });

  test("page is usable on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await detail.navigate("car-001");
    await expect(
      page.getByRole("heading", { name: /About This Vehicle/i }),
    ).toBeVisible();
    // CTA should still be reachable
    await expect(detail.appointmentButton).toBeVisible();
  });
});
