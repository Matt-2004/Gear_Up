import { timeFormat, formatRelativeTime } from "@/app/shared/utils/timeFormat";

describe("timeFormat", () => {
  it('should return DD/MM/YYYY when format is "Date"', () => {
    const date = new Date(2025, 0, 15);

    const result = timeFormat(date, "Date");

    expect(result).toBe("15/01/2025");
  });

  it('should return DD/MM/YYYY HH:MM when format is "Hour"', () => {
    const date = new Date(2025, 0, 15, 9, 30);

    const result = timeFormat(date, "Hour");

    expect(result).toBe("15/01/2025 09:30");
  });

  it("should correctly pad single-digit months and days", () => {
    const date = new Date(2025, 2, 5);

    const result = timeFormat(date, "Date");

    expect(result).toBe("05/03/2025");
  });

  it("should correctly pad single-digit hours and minutes", () => {
    const date = new Date(2025, 5, 1, 3, 5);

    const result = timeFormat(date, "Hour");

    expect(result).toBe("01/06/2025 03:05");
  });

  it("should handle December (month 11)", () => {
    const date = new Date(2025, 11, 25);

    expect(timeFormat(date, "Date")).toBe("25/12/2025");
    expect(timeFormat(date, "Hour")).toBe("25/12/2025 00:00");
  });
});

describe("formatRelativeTime", () => {
  const NOW = new Date("2025-06-15T12:00:00.000Z");

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return minute unit when diff is less than 60 minutes", () => {
    const fiveMinutesAgo = new Date(NOW.getTime() - 5 * 60 * 1000).toISOString();

    const result = formatRelativeTime(fiveMinutesAgo);

    expect(result).toEqual({ value: 5, unit: "minute" });
  });

  it("should return hour unit when diff is 60+ minutes but less than 24 hours", () => {
    const twoHoursAgo = new Date(NOW.getTime() - 2 * 60 * 60 * 1000).toISOString();

    const result = formatRelativeTime(twoHoursAgo);

    expect(result).toEqual({ value: 2, unit: "hour" });
  });

  it("should return day unit when diff is 24+ hours", () => {
    const threeDaysAgo = new Date(NOW.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();

    const result = formatRelativeTime(threeDaysAgo);

    expect(result).toEqual({ value: 3, unit: "day" });
  });

  it("should return 0 minutes for the current time", () => {
    const result = formatRelativeTime(NOW.toISOString());

    expect(result).toEqual({ value: 0, unit: "minute" });
  });

  it("should return 0 minutes for a very recent time", () => {
    const justNow = new Date(NOW.getTime() - 30 * 1000).toISOString();

    const result = formatRelativeTime(justNow);

    expect(result).toEqual({ value: 0, unit: "minute" });
  });

  it("should return 59 minutes for a diff just under 1 hour", () => {
    const fiftyNineMinsAgo = new Date(NOW.getTime() - 59 * 60 * 1000).toISOString();

    const result = formatRelativeTime(fiftyNineMinsAgo);

    expect(result).toEqual({ value: 59, unit: "minute" });
  });

  it("should return 23 hours for a diff just under 24 hours", () => {
    const twentyThreeHoursAgo = new Date(
      NOW.getTime() - 23 * 60 * 60 * 1000
    ).toISOString();

    const result = formatRelativeTime(twentyThreeHoursAgo);

    expect(result).toEqual({ value: 23, unit: "hour" });
  });
});
