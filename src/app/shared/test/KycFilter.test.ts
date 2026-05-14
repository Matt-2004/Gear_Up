import { kycFilter } from "@/app/shared/utils/KycFilter";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { KycModel } from "@/app/features/profiles/dealer/types/kyc.model";

function buildMockResponse(
  overrides?: Partial<CursorResponse<KycModel[]>>,
): CursorResponse<KycModel[]> {
  return {
    items: [],
    nextCursor: null,
    hasMore: false,
    ...overrides,
  };
}

function buildMockKyc(overrides?: Partial<KycModel>): KycModel {
  return {
    kycId: "kyc-1",
    userId: "user-1",
    name: "Test User",
    email: "test@example.com",
    phone: "1234567890",
    dateOfBirth: "1990-01-01",
    status: "Approved",
    documentType: "passport",
    documentUrls: [],
    selfieUrl: "selfie.jpg",
    submittedAt: "2025-01-01T00:00:00.000Z",
    rejectionReason: null,
    ...overrides,
  };
}

describe("kycFilter", () => {
  it("should return undefined when items is null", () => {
    const response = buildMockResponse({
      items: null as unknown as KycModel[],
    });

    const result = kycFilter(response, "approved");

    expect(result).toBeUndefined();
  });

  it("should return undefined when items is undefined", () => {
    const response = buildMockResponse({
      items: undefined as unknown as KycModel[],
    });

    const result = kycFilter(response, "approved");

    expect(result).toBeUndefined();
  });

  it("should return 0 when items array is empty", () => {
    const response = buildMockResponse({ items: [] });

    const result = kycFilter(response, "approved");

    expect(result).toBe(0);
  });

  it("should return 0 when no items match the given status", () => {
    const response = buildMockResponse({
      items: [
        buildMockKyc({ status: "Pending" }),
        buildMockKyc({ status: "Rejected" }),
      ],
    });

    const result = kycFilter(response, "Approved");

    expect(result).toBe(0);
  });

  it("should return the correct count when some items match the status", () => {
    const response = buildMockResponse({
      items: [
        buildMockKyc({ kycId: "1", status: "Approved" }),
        buildMockKyc({ kycId: "2", status: "Pending" }),
        buildMockKyc({ kycId: "3", status: "Approved" }),
        buildMockKyc({ kycId: "4", status: "Rejected" }),
      ],
    });

    const result = kycFilter(response, "Approved");
    expect(result).toBe(2);
  });

  it("should return the total count when all items match the status", () => {
    const response = buildMockResponse({
      items: [
        buildMockKyc({ status: "Approved" }),
        buildMockKyc({ status: "Approved" }),
        buildMockKyc({ status: "Approved" }),
      ],
    });

    const result = kycFilter(response, "Approved");
    expect(result).toBe(3);
  });

  it("should work with different status values", () => {
    const response = buildMockResponse({
      items: [
        buildMockKyc({ kycId: "1", status: "Approved" }),
        buildMockKyc({ kycId: "2", status: "Pending" }),
        buildMockKyc({ kycId: "3", status: "Rejected" }),
        buildMockKyc({ kycId: "4", status: "Pending" }),
      ],
    });

    expect(kycFilter(response, "Approved")).toBe(1);
    expect(kycFilter(response, "Pending")).toBe(2);
    expect(kycFilter(response, "Rejected")).toBe(1);
  });
});
