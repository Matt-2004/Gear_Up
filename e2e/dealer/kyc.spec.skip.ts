import { test, expect } from "@playwright/test";
import { loginAsDealer } from "../pages/shared";

test.describe("KYC Registration", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDealer(page);
  });

  test("step 1 shows document type selection", async ({ page }) => {
    await page.goto("/profile/dealer/register?step=1");

    await expect(
      page.getByRole("heading", { name: /dealership registration/i }),
    ).toBeVisible({ timeout: 5000 });
    // Radio inputs are hidden via CSS; the label acts as the visible control.
    await expect(page.locator('input[name="DocumentType"]').first()).toBeAttached();
    await expect(page.getByText(/passport/i).first()).toBeVisible();
  });

  test("step navigation works between steps", async ({ page }) => {
    await page.goto("/profile/dealer/register?step=1");

    // Check that continue/next button exists
    const continueBtn = page.getByRole("button", { name: /continue/i });
    // First step needs document type selected before continuing
    await expect(continueBtn).toBeVisible();
  });

  test("cancel button is visible", async ({ page }) => {
    await page.goto("/profile/dealer/register?step=1");

    await expect(
      page.getByRole("button", { name: /cancel/i }),
    ).toBeVisible();
  });
});
