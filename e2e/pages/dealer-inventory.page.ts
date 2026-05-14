import type { Page } from "@playwright/test";

export class DealerInventoryPage {
  constructor(readonly page: Page) {}

  get header() {
    return this.page.getByTestId("dealer-dashboard-header").first();
  }
  get addVehicleButton() {
    return this.page.getByTestId("add-vehicle-button");
  }
  get statCards() {
    return this.page.getByTestId("stat-card");
  }

  async navigate() {
    await this.page.goto("/profile/dealer?tab=car-management");
  }
}
