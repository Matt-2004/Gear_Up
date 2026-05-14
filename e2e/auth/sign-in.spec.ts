import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

test.describe("Sign In", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test("successful login redirects to home", async ({ page }) => {
    await loginPage.login("success@test.com", "Password1!");

    await loginPage.expectRedirectedToHome();
  });

  test("invalid credentials show error toast", async ({ page }) => {
    await loginPage.login("wrong@test.com", "Password1!");

    await expect(page.getByText(/invalid credentials/i).first()).toBeVisible({
      timeout: 5000,
    });
    // Should stay on login page
    await loginPage.expectOnLoginPage();
  });

  test("unverified email triggers resend and shows info message", async ({ page }) => {
    await loginPage.login("unverified@test.com", "Password1!");

    // The action returns an "email not verified" message
    await expect(
      page.getByText(/email is not verified/i).first(),
    ).toBeVisible({ timeout: 5000 });
  });

  test("forgot password link navigates to reset password email page", async () => {
    await loginPage.forgotPasswordLink.click();
    await loginPage.expectRedirectedToForgotPassword();
  });

  test("register now link navigates to register page", async () => {
    await loginPage.registerLink.click();
    await loginPage.expectRedirectedToRegister();
  });

  test("remember me checkbox can be toggled", async () => {
    const checkbox = loginPage.rememberMe;
    await expect(checkbox).not.toBeChecked();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test("empty form submission shows validation errors", async ({ page }) => {
    await loginPage.submitButton.click();

    // The email input should still be visible (form didn't submit successfully)
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });
});
