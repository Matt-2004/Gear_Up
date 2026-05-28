import { test, expect } from "@playwright/test";
import { ResetPasswordEmailPage } from "../pages/reset-password-email.page";

test.describe("Email Validation — Reset Password", () => {
  let emailPage: ResetPasswordEmailPage;

  test.beforeEach(async ({ page }) => {
    emailPage = new ResetPasswordEmailPage(page, "reset-password");
    await emailPage.navigate();
  });

  test("heading and form are visible", async () => {
    await expect(emailPage.heading).toBeVisible();
    await expect(emailPage.emailInput).toBeVisible();
    await expect(emailPage.button).toBeVisible();
    await expect(emailPage.button).toHaveText(/send reset link/i);
  });

  test("successful submission redirects to login", async ({ page }) => {
    await emailPage.submitEmail("user@test.com");

    await expect(
      page.getByText(/password reset link sent/i).first(),
    ).toBeVisible({ timeout: 5000 });
    await emailPage.expectRedirectedToLogin();
  });

  test("invalid email shows inline validation error", async () => {
    await emailPage.emailInput.fill("not-an-email");

    // Error appears inline — button stays disabled, no click needed
    await expect(
      emailPage.page.getByText(/invalid email format/i),
    ).toBeVisible();
    await expect(emailPage.button).toBeDisabled();
  });
});

test.describe("Email Validation — Verification", () => {
  let emailPage: ResetPasswordEmailPage;

  test.beforeEach(async ({ page }) => {
    emailPage = new ResetPasswordEmailPage(page, "verification");
    await emailPage.navigate();
  });

  test("heading and button text match verification variant", async () => {
    await expect(emailPage.heading).toBeVisible();
    await expect(emailPage.button).toBeVisible();
    await expect(emailPage.button).toHaveText(/send verification email/i);
  });

  test("successful submission redirects to login", async ({ page }) => {
    await emailPage.submitEmail("user@test.com");

    // Both variants call the same API endpoint, so the message is the same
    await expect(
      page.getByText(/password reset link sent/i).first(),
    ).toBeVisible({ timeout: 5000 });
    await emailPage.expectRedirectedToLogin();
  });
});
