import { formatNumber } from "@/app/shared/utils/numberFormatter";

describe("formatNumber", () => {
  it("should format integer numbers with thousand separators", () => {
    const result = formatNumber(1000);

    expect(result).toBe("1,000");
  });

  it("should strip decimal part from numbers", () => {
    const result = formatNumber(1234.56);

    expect(result).toBe("1,234");
  });

  it("should handle zero", () => {
    const result = formatNumber(0);

    expect(result).toBe("0");
  });

  it("should handle negative numbers", () => {
    const result = formatNumber(-5000);

    expect(result).toBe("-5,000");
  });

  it("should handle large numbers", () => {
    const result = formatNumber(1000000);

    expect(result).toBe("1,000,000");
  });

  it("should strip decimal part from negative decimal numbers", () => {
    const result = formatNumber(-1234.56);

    expect(result).toBe("-1,234");
  });

  it("should handle very large numbers", () => {
    const result = formatNumber(1234567890);

    expect(result).toBe("1,234,567,890");
  });
});
