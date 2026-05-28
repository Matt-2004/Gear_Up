import { test, expect } from "@playwright/test";
import { DealerInventoryPage } from "../pages/dealer-inventory.page";
import { loginAsDealer } from "../pages/shared";

test.describe("Dealer Inventory", () => {
  let inventory: DealerInventoryPage;

  test.beforeEach(async ({ page }) => {
    await loginAsDealer(page);
    inventory = new DealerInventoryPage(page);
  });

  test("dashboard header and add vehicle button are visible", async () => {
    await inventory.navigate();

    await expect(inventory.header).toBeVisible({ timeout: 8000 });
    await expect(inventory.addVehicleButton).toBeVisible();
    await expect(inventory.addVehicleButton).toHaveText(/add vehicle/i);
  });

  test("stat cards are rendered", async () => {
    await inventory.navigate();

    await expect(inventory.statCards.first()).toBeVisible({ timeout: 8000 });
    const count = await inventory.statCards.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("add vehicle button links to add car page", async ({ page }) => {
    await inventory.navigate();
    await inventory.addVehicleButton.click();

    await page.waitForURL(/\/profile\/dealer\/cars\/add\?step=1/, {
      timeout: 8000,
    });
  });
});
