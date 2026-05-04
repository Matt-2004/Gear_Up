"use client";

import { IKycFormData } from "@/app/features/profiles/dealer/types/kycRegister.types";
import { MainResponse } from "@/app/shared/types.ts/main-response";
import { kycRegister } from "@/app/shared/utils/API/UserAPI";
import { ErrorResponse } from "@/app/shared/utils/errors/errorResponse";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface KycRegisterContextType {
  kycData: IKycFormData;
  updateKycData: (data: Partial<IKycFormData>) => void;
  isSubmitting: boolean;
  submitKycData: () => Promise<MainResponse<null>>;
  isStepValid: (step: number) => boolean;
  resetForm: () => void;
}

export const KycFormContext = createContext<KycRegisterContextType | undefined>(
  undefined,
);

export default function KycFormProvider({ children }: { children: ReactNode }) {
  const [kycData, setKycData] = useState<IKycFormData>({
    DocumentType: null,
    Kyc: null,
    SelfieImage: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateKycData = useCallback((data: Partial<IKycFormData>) => {
    setKycData((prev) => ({ ...prev, ...data }));
  }, []);

  // Validate if current step data is filled
  const isStepValid = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1: // Document Type
          // if data is not null -> null, if null -> false

          return kycData.DocumentType !== null;
        case 2: // KYC Upload
          return (
            kycData.Kyc !== null &&
            kycData.Kyc.length === 2 &&
            kycData.Kyc[0] !== null &&
            kycData.Kyc[1] !== null
          );
        case 3: // Selfie Upload
          return kycData.SelfieImage !== null;
        case 4: // Review - all data must be present
          return (
            kycData.DocumentType !== null &&
            kycData.Kyc !== null &&
            kycData.Kyc.length === 2 &&
            kycData.Kyc[0] !== null &&
            kycData.Kyc[1] !== null &&
            kycData.SelfieImage !== null
          );
        default:
          return false;
      }
    },
    [kycData],
  );

  // Submit KYC data to backend
  const submitKycData = useCallback(async (): Promise<MainResponse<null>> => {
    console.log("Calling submitKycData");
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Add document type
      if (kycData.DocumentType) {
        formData.append("DocumentType", kycData.DocumentType);
      }

      // Add KYC documents
      if (kycData.Kyc) {
        formData.append("Kyc", kycData.Kyc[0]);
        formData.append("Kyc", kycData.Kyc[1]);
      }

      // Add selfie image
      if (kycData.SelfieImage) {
        formData.append("SelfieImage", kycData.SelfieImage);
      }

      const response = await kycRegister(formData);

      // Check if response indicates an error
      if (response.isSuccess === false || response.status >= 400) {
        throw new Error(response.message || "Failed to submit KYC data");
      }

      localStorage.removeItem("kyc_verficiation");
      return response;
    } catch (error: any) {
      const err = error as ErrorResponse;

      return {
        isSuccess: false,
        message: err.message,
        data: null,
        status: err.status,
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [kycData, isStepValid]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setKycData({
      DocumentType: null,
      Kyc: null,
      SelfieImage: null,
    });

    localStorage.removeItem("kyc_verficiation");
  }, []);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("kyc_verficiation");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Note: Files cannot be restored from localStorage
        // Only restore DocumentType if it exists
        if (parsed.DocumentType) {
          setKycData((prev) => ({
            ...prev,
            DocumentType: parsed.DocumentType,
          }));
        }
      } catch (error) {
        console.error("Error loading saved KYC data:", error);
      }
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    // Only save DocumentType to localStorage (files cannot be serialized)
    const dataToSave = {
      DocumentType: kycData.DocumentType,
    };
    localStorage.setItem("kyc_verficiation", JSON.stringify(dataToSave));
  }, [kycData]);

  return (
    <KycFormContext.Provider
      value={{
        kycData,
        updateKycData,
        isSubmitting,
        submitKycData,
        isStepValid,
        resetForm,
      }}
    >
      {children}
    </KycFormContext.Provider>
  );
}

export const useKycSubmit = () => {
  const context = useContext(KycFormContext);

  if (!context) {
    throw new Error("useKycFormContext must be used inside a Provider");
  }
  return context;
};
