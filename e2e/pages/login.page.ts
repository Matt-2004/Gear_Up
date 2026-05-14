import type { Page } from "@playwright/test";

export class LoginPage {
  constructor(readonly page: Page) {}

  get emailInput() {
    return this.page.getByTestId("email");
  }
  get passwordInput() {
    return this.page.getByTestId("password");
  }
  get submitButton() {
    return this.page.getByRole("button", { name: /login/i });
  }
  get rememberMe() {
    return this.page.getByRole("checkbox", { name: /remember me/i });
  }
  get forgotPasswordLink() {
    return this.page.getByRole("link", { name: /forgot password/i });
  }
  get registerLink() {
    return this.page.getByRole("link", { name: /register now/i });
  }

  async navigate() {
    await this.page.goto("/auth/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectProcessingState() {
    await this.page
      .getByRole("button", { name: /processing/i })
      .waitFor({ timeout: 3000 });
  }

  async expectOnLoginPage() {
    await this.page.waitForURL(/\/auth\/login/);
    await this.emailInput.waitFor({ state: "visible" });
  }

  async expectRedirectedToHome() {
    await this.page.waitForURL("/", { timeout: 10000 });
  }

  async expectRedirectedToRegister() {
    await this.page.waitForURL(/\/auth\/register/);
  }

  async expectRedirectedToForgotPassword() {
    await this.page.waitForURL(/\/auth\/email\/reset-password/);
  }
}
