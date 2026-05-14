import { test, expect } from "@playwright/test";
import { RegisterPage } from "../pages/register.page";

test.describe("Sign Up", () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.navigate();
  });

  test("successful registration redirects to login", async ({ page }) => {
    await registerPage.fillAllFields({
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      email: "success@test.com",
      password: "Password1!",
      confirmPassword: "Password1!",
    });
    await registerPage.agreeAndSubmit();

    await expect(
      page.getByText(/registration successful/i).first(),
    ).toBeVisible({ timeout: 5000 });
    await registerPage.expectRedirectedToLogin();
  });

  test("password too short shows inline validation error", async () => {
    // Error appears inline as soon as the field has a value — no click needed
    await registerPage.passwordInput.fill("Short1!");

    await expect(registerPage.passwordError).toBeVisible();
    await expect(registerPage.submitButton).toBeDisabled();
  });

  test("mismatched passwords show inline validation error", async () => {
    // Fill only schema-required fields to isolate the password mismatch
    await registerPage.emailInput.fill("john@test.com");
    await registerPage.passwordInput.fill("Password1!");
    await registerPage.confirmPasswordInput.fill("Different1!");
    await registerPage.agreeToTerms.check();

    await expect(registerPage.passwordMismatchError).toBeVisible();
    await expect(registerPage.submitButton).toBeDisabled();
  });

  test("not agreeing to terms keeps submit button disabled", async () => {
    await registerPage.emailInput.fill("john@test.com");
    await registerPage.passwordInput.fill("Password1!");
    await registerPage.confirmPasswordInput.fill("Password1!");
    // Do NOT check agreeToTerms

    await expect(registerPage.submitButton).toBeDisabled();
  });

  test("invalid email format shows inline validation error", async () => {
    await registerPage.emailInput.fill("not-an-email");

    await expect(registerPage.emailFormatError).toBeVisible();
    await expect(registerPage.submitButton).toBeDisabled();
  });

  test("all form fields accept input", async () => {
    await registerPage.firstNameInput.fill("Jane");
    await registerPage.lastNameInput.fill("Smith");
    await registerPage.usernameInput.fill("janesmith");
    await registerPage.emailInput.fill("jane@test.com");
    await registerPage.passwordInput.fill("Password1!");
    await registerPage.confirmPasswordInput.fill("Password1!");

    await expect(registerPage.firstNameInput).toHaveValue("Jane");
    await expect(registerPage.lastNameInput).toHaveValue("Smith");
    await expect(registerPage.usernameInput).toHaveValue("janesmith");
    await expect(registerPage.emailInput).toHaveValue("jane@test.com");
  });

  test("login link navigates to login page", async () => {
    await registerPage.loginLink.click();
    await registerPage.expectRedirectedToLogin();
  });
});
