import { test, expect } from "@playwright/test";
import { loginAsUser } from "../pages/shared";

test.describe("Dealer Appointments", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  test("appointment management tab is visible", async ({ page }) => {
    await page.goto("/profile/dealer?tab=appointment-management");

    await expect(
      page.getByRole("button", { name: /appointments/i }),
    ).toBeVisible({ timeout: 5000 });
  });

  test("filter dropdown is visible", async ({ page }) => {
    await page.goto("/profile/dealer?tab=appointment-management");

    // The filter dropdown allows filtering by status
    const filterTrigger = page.getByText(/all appointments|filter/i).first();
    await expect(filterTrigger).toBeVisible({ timeout: 5000 });
  });
});
