import type { Page } from "@playwright/test";

export class ResetPasswordEmailPage {
  constructor(
    readonly page: Page,
    readonly variant: "reset-password" | "verification",
  ) {}

  get emailInput() {
    return this.page.getByTestId("email");
  }

  get buttonName() {
    return this.variant === "reset-password"
      ? /send reset link/i
      : /send verification email/i;
  }

  get button() {
    return this.page.getByRole("button", { name: this.buttonName });
  }

  get heading() {
    return this.page.getByRole("heading", {
      name:
        this.variant === "reset-password"
          ? /reset password/i
          : /email verification/i,
    });
  }

  async navigate() {
    await this.page.goto(
      this.variant === "reset-password"
        ? "/auth/email/reset-password"
        : "/auth/email/verification",
    );
  }

  async submitEmail(email: string) {
    await this.emailInput.fill(email);
    await this.button.click();
  }

  async expectRedirectedToLogin() {
    await this.page.waitForURL(/\/auth\/login/, { timeout: 10000 });
  }
}
