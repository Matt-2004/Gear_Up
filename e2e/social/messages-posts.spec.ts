import { test, expect } from "@playwright/test";
import { loginAsUser } from "../pages/shared";

test.describe("Messaging", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  test("messages page renders conversation list", async ({ page }) => {
    await page.goto("/messages");

    await expect(
      page.getByPlaceholder(/search conversations/i),
    ).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Posts", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  test("discover feed renders posts", async ({ page }) => {
    await page.goto("/post/discover");

    // The discover page should show the post after login
    await expect(page.getByText(/check out this amazing car/i)).toBeVisible({
      timeout: 8000,
    });
  });

  test("post detail page shows content", async ({ page }) => {
    await page.goto("/post/post-1");

    await expect(
      page.getByText(/check out this amazing car/i),
    ).toBeVisible({ timeout: 8000 });
  });
});
