import type { Page } from "@playwright/test";

export class RegisterPage {
  constructor(readonly page: Page) {}

  get firstNameInput() {
    return this.page.getByTestId("first-name");
  }
  get lastNameInput() {
    return this.page.getByTestId("last-name");
  }
  get usernameInput() {
    return this.page.getByTestId("username");
  }
  get emailInput() {
    return this.page.getByTestId("email");
  }
  get passwordInput() {
    return this.page.getByTestId("password");
  }
  get confirmPasswordInput() {
    return this.page.getByTestId("confirm-password");
  }
  get agreeToTerms() {
    return this.page.getByTestId("agree-to-terms");
  }
  get submitButton() {
    return this.page.getByRole("button", { name: /register/i });
  }
  get loginLink() {
    return this.page.getByRole("link", { name: /(sign in here|login now)/i }).first();
  }

  async navigate() {
    await this.page.goto("/auth/register");
  }

  async fillAllFields(options: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    await this.firstNameInput.fill(options.firstName);
    await this.lastNameInput.fill(options.lastName);
    await this.usernameInput.fill(options.username);
    await this.emailInput.fill(options.email);
    await this.passwordInput.fill(options.password);
    await this.confirmPasswordInput.fill(options.confirmPassword);
  }

  async agreeAndSubmit() {
    await this.agreeToTerms.check();
    await this.submitButton.click();
  }

  get passwordError() {
    return this.page.getByText(/password must be at least 8 characters/i);
  }
  get passwordMismatchError() {
    return this.page.getByText(/passwords do not match/i);
  }
  get termsError() {
    return this.page.getByText(/you must agree to the terms/i);
  }
  get emailFormatError() {
    return this.page.getByText(/invalid email format/i);
  }

  async expectRedirectedToLogin() {
    await this.page.waitForURL(/\/auth\/login/, { timeout: 10000 });
  }
}
