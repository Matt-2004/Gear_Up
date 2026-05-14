import type { Page } from "@playwright/test";

export class AdminPage {
  constructor(readonly page: Page) {}

  get emailInput() {
    return this.page.locator('input[name="email"]');
  }
  get passwordInput() {
    return this.page.locator('input[name="password"]');
  }
  get loginButton() {
    return this.page.getByRole("button", { name: /login/i });
  }

  async loginAdmin(email: string, password: string) {
    await this.page.goto("/profile/admin/login");
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async navigateToTab(tab: "dashboard" | "kyc-verification" | "car-verification") {
    await this.page.goto(`/profile/admin?tab=${tab}`);
  }
}
