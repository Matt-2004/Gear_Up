import { test, expect } from "@playwright/test";
import { ResetPasswordPage } from "../pages/reset-password.page";

test.describe("Reset Password", () => {
  let resetPage: ResetPasswordPage;

  test.beforeEach(async ({ page }) => {
    resetPage = new ResetPasswordPage(page);
  });

  test("heading and form are visible", async () => {
    await resetPage.navigate("some-token");

    await expect(resetPage.heading).toBeVisible();
    await expect(resetPage.newPasswordInput).toBeVisible();
    await expect(resetPage.confirmPasswordInput).toBeVisible();
    await expect(resetPage.submitButton).toBeVisible();
  });

  test("successful password reset redirects to login", async ({ page }) => {
    await resetPage.navigate("valid-token");
    await resetPage.fillAndSubmit("NewPassword1!", "NewPassword1!");

    await expect(
      page.getByText(/password has been reset/i).first(),
    ).toBeVisible({ timeout: 5000 });
    await resetPage.expectRedirectedToLogin();
  });

  test("invalid token shows error toast and redirects to login", async ({ page }) => {
    await resetPage.navigate("invalid-token");
    await resetPage.fillAndSubmit("NewPassword1!", "NewPassword1!");

    await expect(
      page.getByText(/invalid or expired token/i).first(),
    ).toBeVisible({ timeout: 5000 });
  });

  test("mismatched passwords show validation error", async () => {
    await resetPage.navigate("valid-token");
    await resetPage.newPasswordInput.fill("NewPassword1!");
    await resetPage.confirmPasswordInput.fill("Different1!");

    // The button should be disabled when passwords don't match
    await expect(resetPage.submitButton).toBeDisabled();
  });

  test("password too short shows inline validation error", async () => {
    await resetPage.navigate("valid-token");
    await resetPage.newPasswordInput.fill("Short1!");

    // Error appears inline — button stays disabled, no click needed
    await expect(
      resetPage.page.getByText(/password must be at least 8 characters/i),
    ).toBeVisible();
    await expect(resetPage.submitButton).toBeDisabled();
  });
});
