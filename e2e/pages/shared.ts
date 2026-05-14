import type { Page } from "@playwright/test";

/**
 * Shared helpers for verifying toast notifications and URL assertions.
 */
export function assertToast(page: Page, message: string | RegExp) {
  return page.getByText(message).first().waitFor({ state: "visible", timeout: 5000 });
}

export async function waitForUrl(page: Page, pattern: string | RegExp) {
  await page.waitForURL(pattern, { timeout: 10000 });
}

/**
 * Log in as a test user. Uses the mock backend (success@test.com / Password1!).
 */
export async function loginAsUser(page: Page) {
  await page.goto("/auth/login");
  await page.getByTestId("email").fill("success@test.com");
  await page.getByTestId("password").fill("Password1!");
  await page.getByRole("button", { name: /login/i }).click();
  await page.waitForURL("/", { timeout: 10000 });
}
