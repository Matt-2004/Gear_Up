import { renderHook, act } from "@testing-library/react";
import { ReactNode } from "react";
import KycFormProvider, { useKycSubmit } from "./KycFormContext";
import { kycRegister } from "@/app/shared/utils/API/UserAPI";

jest.mock("@/app/shared/utils/API/UserAPI", () => ({
  kycRegister: jest.fn(),
}));

const mockedKycRegister = kycRegister as jest.Mock;

function wrapper({ children }: { children: ReactNode }) {
  return <KycFormProvider>{children}</KycFormProvider>;
}

function renderKycHook() {
  return renderHook(() => useKycSubmit(), { wrapper });
}

describe("KycFormContext", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("initial state", () => {
    it("initializes with null form data", () => {
      const { result } = renderKycHook();
      expect(result.current.kycData.DocumentType).toBeNull();
      expect(result.current.kycData.Kyc).toBeNull();
      expect(result.current.kycData.SelfieImage).toBeNull();
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe("updateKycData", () => {
    it("updates a single field without clearing others", () => {
      const { result } = renderKycHook();
      act(() => {
        result.current.updateKycData({ DocumentType: "Passport" });
      });
      expect(result.current.kycData.DocumentType).toBe("Passport");
      // other fields remain null
      expect(result.current.kycData.Kyc).toBeNull();
    });

    it("updates multiple fields in one call", () => {
      const { result } = renderKycHook();
      const fakeFile = new File([""], "test.jpg", { type: "image/jpeg" });
      act(() => {
        result.current.updateKycData({
          DocumentType: "DriverLicense",
          Kyc: [fakeFile, fakeFile],
        });
      });
      expect(result.current.kycData.DocumentType).toBe("DriverLicense");
      expect(result.current.kycData.Kyc).toHaveLength(2);
    });
  });

  describe("isStepValid", () => {
    it("returns false for step 1 when DocumentType is null", () => {
      const { result } = renderKycHook();
      expect(result.current.isStepValid(1)).toBe(false);
    });

    it("returns true for step 1 when DocumentType is set", () => {
      const { result } = renderKycHook();
      act(() => {
        result.current.updateKycData({ DocumentType: "Passport" });
      });
      expect(result.current.isStepValid(1)).toBe(true);
    });

    it("returns false for step 2 when Kyc is null", () => {
      const { result } = renderKycHook();
      expect(result.current.isStepValid(2)).toBe(false);
    });

    it("returns true for step 2 when both KYC files are set", () => {
      const { result } = renderKycHook();
      const fakeFile = new File([""], "test.jpg", { type: "image/jpeg" });
      act(() => {
        result.current.updateKycData({ Kyc: [fakeFile, fakeFile] });
      });
      expect(result.current.isStepValid(2)).toBe(true);
    });

    it("returns false for step 3 when SelfieImage is null", () => {
      const { result } = renderKycHook();
      expect(result.current.isStepValid(3)).toBe(false);
    });

    it("returns true for step 3 when SelfieImage is set", () => {
      const { result } = renderKycHook();
      const fakeFile = new File([""], "selfie.jpg", { type: "image/jpeg" });
      act(() => {
        result.current.updateKycData({ SelfieImage: fakeFile });
      });
      expect(result.current.isStepValid(3)).toBe(true);
    });

    it("returns false for step 4 when not all data is present", () => {
      const { result } = renderKycHook();
      act(() => {
        result.current.updateKycData({ DocumentType: "Passport" });
      });
      expect(result.current.isStepValid(4)).toBe(false);
    });

    it("returns true for step 4 when all data is complete", () => {
      const { result } = renderKycHook();
      const fakeFile = new File([""], "test.jpg", { type: "image/jpeg" });
      act(() => {
        result.current.updateKycData({
          DocumentType: "Passport",
          Kyc: [fakeFile, fakeFile],
          SelfieImage: fakeFile,
        });
      });
      expect(result.current.isStepValid(4)).toBe(true);
    });
  });

  describe("submitKycData", () => {
    it("calls kycRegister API and returns success", async () => {
      mockedKycRegister.mockResolvedValue({
        isSuccess: true,
        message: "KYC submitted",
        status: 200,
        data: null,
      });
      const fakeFile = new File([""], "doc.jpg", { type: "image/jpeg" });
      const { result } = renderKycHook();
      act(() => {
        result.current.updateKycData({
          DocumentType: "Passport",
          Kyc: [fakeFile, fakeFile],
          SelfieImage: fakeFile,
        });
      });
      let response!: { isSuccess: boolean };
      await act(async () => {
        response = await result.current.submitKycData();
      });
      expect(mockedKycRegister).toHaveBeenCalled();
      const formData = mockedKycRegister.mock.calls[0][0] as FormData;
      expect(formData.get("DocumentType")).toBe("Passport");
      expect(response!.isSuccess).toBe(true);
      expect(result.current.isSubmitting).toBe(false);
    });

    it("returns error when API fails", async () => {
      mockedKycRegister.mockImplementation(() => {
        const err = new Error("Server unavailable") as Error & {
          status?: number;
        };
        err.status = 500;
        throw err;
      });
      const { result } = renderKycHook();
      let response!: { isSuccess: boolean; message: string };
      await act(async () => {
        response = await result.current.submitKycData();
      });
      expect(response.isSuccess).toBe(false);
      expect(result.current.isSubmitting).toBe(false);
    });

    it("sets isSubmitting to true during submission", async () => {
      let resolveKyc!: (value: unknown) => void;
      mockedKycRegister.mockReturnValue(
        new Promise((resolve) => {
          resolveKyc = resolve;
        }),
      );
      const fakeFile = new File([""], "doc.jpg", { type: "image/jpeg" });
      const { result } = renderKycHook();
      act(() => {
        result.current.updateKycData({
          DocumentType: "Passport",
          Kyc: [fakeFile, fakeFile],
          SelfieImage: fakeFile,
        });
      });
      let submitPromise!: Promise<unknown>;
      act(() => {
        submitPromise = result.current.submitKycData();
      });
      expect(result.current.isSubmitting).toBe(true);
      await act(async () => {
        resolveKyc({
          isSuccess: true,
          message: "KYC submitted",
          status: 200,
          data: null,
        });
        await submitPromise;
      });
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe("resetForm", () => {
    it("clears all form data", () => {
      const { result } = renderKycHook();
      act(() => {
        result.current.updateKycData({
          DocumentType: "Passport",
          SelfieImage: new File([""], "selfie.jpg"),
        });
      });
      act(() => {
        result.current.resetForm();
      });
      expect(result.current.kycData.DocumentType).toBeNull();
      expect(result.current.kycData.SelfieImage).toBeNull();
    });
  });

  describe("localStorage persistence", () => {
    it("restores DocumentType from localStorage on mount", () => {
      localStorage.setItem(
        "kyc_verficiation",
        JSON.stringify({ DocumentType: "NationalId" }),
      );
      const { result } = renderKycHook();
      expect(result.current.kycData.DocumentType).toBe("NationalId");
    });

    it("handles corrupted localStorage data gracefully", () => {
      localStorage.setItem("kyc_verficiation", "not-valid-json");
      expect(() => {
        const { result } = renderKycHook();
        expect(result.current.kycData.DocumentType).toBeNull();
      }).not.toThrow();
    });
  });

  describe("useKycSubmit outside provider", () => {
    it("throws when used outside KycFormProvider", () => {
      expect(() => renderHook(() => useKycSubmit())).toThrow(
        "useKycFormContext must be used inside a Provider",
      );
    });
  });
});
