import type { Page } from "@playwright/test";

/**
 * Shared helpers for verifying toast notifications and URL assertions.
 */
export function assertToast(page: Page, message: string | RegExp) {
  return page
    .getByText(message)
    .first()
    .waitFor({ state: "visible", timeout: 5000 });
}

export async function waitForUrl(page: Page, pattern: string | RegExp) {
  await page.waitForURL(pattern, { timeout: 10000 });
}

/**
 * Log in as a test user (role=User, unrestricted page access).
 */
export async function loginAsUser(page: Page) {
  await page.goto("/api/test/session?role=User");
  await page.goto("/");
}

/**
 * Log in as a dealer test user (role=Dealer, restricted to /profile/dealer and /messages).
 */
export async function loginAsDealer(page: Page) {
  await page.goto("/api/test/session?role=Dealer");
  await page.goto("/");
}

export async function loginAsAdmin(page: Page) {
  await page.goto("/api/test/session?role=Admin");
  await page.goto("/profile/admin?tab=dashboard");
}
