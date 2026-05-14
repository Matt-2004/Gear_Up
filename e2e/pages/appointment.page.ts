import type { Page } from "@playwright/test";

export class AppointmentPage {
  constructor(readonly page: Page) {}

  get dateInput() {
    return this.page.getByTestId("appointment-date");
  }
  get timeInput() {
    return this.page.getByTestId("appointment-time");
  }
  get locationInput() {
    return this.page.getByTestId("appointment-location");
  }
  get notesTextarea() {
    return this.page.getByTestId("appointment-notes");
  }
  get submitButton() {
    return this.page.getByTestId("appointment-submit");
  }

  async navigate(carId: string) {
    await this.page.goto(`/car/${carId}/appointment`);
  }

  async fillForm(options: {
    date: string;
    time: string;
    location: string;
    notes?: string;
  }) {
    await this.dateInput.fill(options.date);
    await this.timeInput.fill(options.time);
    await this.locationInput.fill(options.location);
    if (options.notes) {
      await this.notesTextarea.fill(options.notes);
    }
  }

  async submit() {
    await this.submitButton.click();
  }
}
