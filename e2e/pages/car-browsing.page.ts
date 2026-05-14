import type { Page } from "@playwright/test";

export class LandingPage {
  constructor(readonly page: Page) {}

  get featuredCars() {
    return this.page.getByTestId("featured-cars");
  }
  get carCards() {
    return this.page.getByTestId("car-card");
  }
  get noCars() {
    return this.page.getByTestId("no-cars");
  }

  async navigate() {
    await this.page.goto("/");
  }

  async clickViewDetails(index: number) {
    await this.page.getByTestId("view-details").nth(index).click();
  }
}

export class SearchPage {
  constructor(readonly page: Page) {}

  get searchInput() {
    return this.page.getByTestId("search-input");
  }
  get searchButton() {
    return this.page.getByTestId("search-button");
  }
  get clearButton() {
    return this.page.getByTestId("clear-search");
  }
  get startState() {
    return this.page.getByTestId("start-state");
  }
  get searchResults() {
    return this.page.getByTestId("search-results");
  }
  get noResults() {
    return this.page.getByTestId("no-results");
  }
  get searchError() {
    return this.page.getByTestId("search-error");
  }
  get carCards() {
    return this.page.getByTestId("car-card");
  }

  async navigate(query?: string) {
    const path = query ? `/car/search?query=${encodeURIComponent(query)}` : "/car/search";
    await this.page.goto(path);
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
    await this.page.waitForURL(/\/car\/search\?query=/);
  }
}

export class CarDetailPage {
  constructor(readonly page: Page) {}

  get galleryPrev() {
    return this.page.getByTestId("gallery-prev");
  }
  get galleryNext() {
    return this.page.getByTestId("gallery-next");
  }
  get galleryCounter() {
    return this.page.getByTestId("gallery-counter");
  }
  get appointmentButton() {
    return this.page.getByTestId("get-appointment");
  }
  get carTitle() {
    return this.page.getByTestId("car-title");
  }
  get carPrice() {
    return this.page.getByTestId("car-price");
  }

  async navigate(carId: string) {
    await this.page.goto(`/car/${carId}`);
  }

  async clickGetAppointment() {
    await this.appointmentButton.click();
  }
}
