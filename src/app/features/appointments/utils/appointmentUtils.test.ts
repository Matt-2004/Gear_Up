import { getStatusColor, formatDate } from "./appointmentUtils";

describe("getStatusColor", () => {
  it("returns yellow for Pending status", () => {
    const result = getStatusColor("Pending");
    expect(result).toContain("bg-yellow-100");
    expect(result).toContain("text-yellow-800");
  });

  it("returns green for Scheduled status", () => {
    const result = getStatusColor("Scheduled");
    expect(result).toContain("bg-green-100");
    expect(result).toContain("text-green-800");
  });

  it("returns red for Cancelled status", () => {
    const result = getStatusColor("Cancelled");
    expect(result).toContain("bg-red-100");
    expect(result).toContain("text-red-800");
  });

  it("returns gray for unknown statuses", () => {
    const result = getStatusColor("Rejected");
    expect(result).toContain("bg-gray-100");
    expect(result).toContain("text-gray-800");
  });
});

describe("formatDate", () => {
  it("formats ISO date string to readable format", () => {
    const result = formatDate("2026-06-15T14:00:00Z");
    expect(result).toContain("2026");
    expect(result).toContain("Jun");
    expect(result).toContain("15");
    expect(result).toContain("Mon");
  });

  it("includes time in the formatted output", () => {
    const result = formatDate("2026-12-25T09:30:00Z");
    expect(result).toContain("Dec");
    expect(result).toContain("25");
  });
});
