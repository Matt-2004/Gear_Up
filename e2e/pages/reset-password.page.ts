import type { Page } from "@playwright/test";

export class ResetPasswordPage {
  constructor(readonly page: Page) {}

  get newPasswordInput() {
    return this.page.getByTestId("new-password");
  }
  get confirmPasswordInput() {
    return this.page.getByTestId("confirm-password");
  }
  get submitButton() {
    return this.page.getByRole("button", { name: /change password/i });
  }
  get heading() {
    return this.page.getByRole("heading", { name: /create new password/i });
  }

  async navigate(token: string) {
    await this.page.goto(`/auth/password/reset?token=${encodeURIComponent(token)}`);
  }

  async fillAndSubmit(newPassword: string, confirmPassword: string) {
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.submitButton.click();
  }

  async expectRedirectedToLogin() {
    await this.page.waitForURL(/\/auth\/login/, { timeout: 10000 });
  }
}
