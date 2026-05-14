import { test, expect } from "@playwright/test";
import { AdminPage } from "../pages/admin.page";

test.describe("Admin Panel", () => {
  let admin: AdminPage;

  test.beforeEach(async ({ page }) => {
    admin = new AdminPage(page);
  });

  test("admin login form is visible", async ({ page }) => {
    await page.goto("/profile/admin/login");

    await expect(admin.emailInput).toBeVisible();
    await expect(admin.passwordInput).toBeVisible();
    await expect(admin.loginButton).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /admin login/i }),
    ).toBeVisible();
  });

  test("car verification tab shows car list", async ({ page }) => {
    await admin.navigateToTab("car-verification");

    await expect(
      page.getByRole("heading", { name: /car verification/i }),
    ).toBeVisible({ timeout: 5000 });
  });

  test("kyc verification tab shows kyc list", async ({ page }) => {
    await admin.navigateToTab("kyc-verification");

    await expect(
      page.getByRole("heading", { name: /document verification/i }),
    ).toBeVisible({ timeout: 5000 });
  });
});
