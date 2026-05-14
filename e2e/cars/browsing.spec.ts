import { test, expect } from "@playwright/test";
import { LandingPage, SearchPage, CarDetailPage } from "../pages/car-browsing.page";

test.describe("Landing Page", () => {
  let landing: LandingPage;

  test.beforeEach(async ({ page }) => {
    landing = new LandingPage(page);
    await landing.navigate();
  });

  test("featured cars section is visible", async () => {
    await expect(landing.featuredCars).toBeVisible();
  });

  test("car cards are rendered", async () => {
    await expect(landing.carCards.first()).toBeVisible();
    const count = await landing.carCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("each car card shows title, price, and view details button", async () => {
    const card = landing.carCards.first();
    await expect(card.getByTestId("car-title")).toBeVisible();
    await expect(card.getByTestId("car-price")).toBeVisible();
    await expect(card.getByTestId("view-details")).toBeVisible();
  });

  test("view details navigates to car detail page", async ({ page }) => {
    await landing.clickViewDetails(0);
    await page.waitForURL(/\/car\/car-\d+/);
  });
});

test.describe("Car Search", () => {
  let search: SearchPage;

  test.beforeEach(async ({ page }) => {
    search = new SearchPage(page);
    await search.navigate();
  });

  test("start state is shown when no query", async () => {
    await expect(search.startState).toBeVisible();
    await expect(search.searchInput).toBeVisible();
    await expect(search.searchButton).toBeDisabled();
  });

  test("search button enabled when input has text", async () => {
    await search.searchInput.fill("Toyota");
    await expect(search.searchButton).toBeEnabled();
  });

  test("search returns results", async () => {
    await search.search("Toyota");
    await expect(search.searchResults).toBeVisible();
    const count = await search.carCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("no results shows empty state", async () => {
    await search.search("nothing");
    await expect(search.noResults).toBeVisible();
    await expect(search.page.getByText("No Cars Found")).toBeVisible();
  });

  test("clear search button clears input", async () => {
    await search.searchInput.fill("test");
    await search.clearButton.click();
    await expect(search.searchInput).toHaveValue("");
  });
});

test.describe("Car Detail", () => {
  let detail: CarDetailPage;

  test.beforeEach(async ({ page }) => {
    detail = new CarDetailPage(page);
    await detail.navigate("car-1");
  });

  test("image gallery has navigation controls", async () => {
    await expect(detail.galleryCounter).toBeVisible();
  });

  test("next button advances gallery", async ({ page }) => {
    const counterBefore = await detail.galleryCounter.textContent();
    if (await detail.galleryNext.isVisible()) {
      await detail.galleryNext.click();
      await page.waitForTimeout(600);
      const counterAfter = await detail.galleryCounter.textContent();
      expect(counterBefore).not.toBe(counterAfter);
    }
  });

  test("get appointment button is visible", async () => {
    await expect(detail.appointmentButton).toBeVisible();
  });

  test("specifications section is visible", async () => {
    await expect(
      detail.page.getByRole("heading", { name: "Key Specifications" }),
    ).toBeVisible();
  });

  test("description section is visible", async () => {
    await expect(
      detail.page.getByRole("heading", { name: "Description" }),
    ).toBeVisible();
  });
});
