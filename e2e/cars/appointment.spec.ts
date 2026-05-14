import { test, expect } from "@playwright/test";
import { AppointmentPage } from "../pages/appointment.page";
import { loginAsUser } from "../pages/shared";

test.describe("Appointment Booking", () => {
  let appointment: AppointmentPage;

  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
    appointment = new AppointmentPage(page);
  });

  test("form renders with car summary and fields", async () => {
    await appointment.navigate("car-1");

    await expect(appointment.dateInput).toBeVisible();
    await expect(appointment.timeInput).toBeVisible();
    await expect(appointment.locationInput).toBeVisible();
    await expect(appointment.submitButton).toBeVisible();
    await expect(
      appointment.page.getByRole("heading", { name: /schedule an appointment/i }),
    ).toBeVisible();
  });

  test("submit with valid data shows toast and redirects", async ({ page }) => {
    await appointment.navigate("car-1");
    await appointment.fillForm({
      date: "2026-06-15",
      time: "14:00",
      location: "Bangkok",
    });
    await appointment.submit();

    // After submission, should either show toast or be redirected
    await expect(async () => {
      const redirected = await page
        .waitForURL(/\/car\/car-\d+/, { timeout: 8000 })
        .then(() => true)
        .catch(() => false);
      const toast = await page
        .getByText(/appointment scheduled/i)
        .first()
        .isVisible()
        .catch(() => false);
      expect(redirected || toast).toBe(true);
    }).toPass();
  });

  test("back button navigates back in history", async ({ page }) => {
    await appointment.navigate("car-1");
    await page
      .getByRole("button", { name: /back to car details/i })
      .click();
    // router.back() goes to previous page in history
    await expect(appointment.dateInput).not.toBeVisible({ timeout: 5000 });
  });

  test("car summary card is visible", async () => {
    await appointment.navigate("car-1");
    // The page shows the car info in the left sidebar
    await expect(appointment.page.getByText("Mock Car Detail")).toBeVisible({
      timeout: 5000,
    });
  });
});
