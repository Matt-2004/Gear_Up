import {
  AlertCircle,
  Camera,
  CheckCircle,
  CreditCard,
  FileText,
} from "lucide-react";
import { useKycSubmit } from "../../context/KycFormContext";
import { useToast } from "@/app/features/toast/hooks/useToast";
import StepNavigation from "../add-car-form/StepNavigation";
import { useState } from "react";

const KycReview = () => {
  const { kycData, submitKycData, isStepValid } = useKycSubmit();
  const { handleToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      // If we're on the last step, submit the form
      const res = await submitKycData();
      handleToast(res, "/");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!kycData.SelfieImage || !kycData.Kyc || !kycData.DocumentType) {
    return (
      <div className="w-full max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="h-8 w-8" />
          <h1 className="text-xl font-semibold">
            KYC data are missing!! Please complete all previous steps.
          </h1>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.04)]"
    >
      <div className="mb-8 flex items-center gap-4">
        <div className="rounded-xl bg-primary-50 p-3">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
            Review Your Information
          </h3>
          <p className="text-sm text-zinc-500">
            Please verify all details before submission
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4">
          <div className="flex items-center gap-3">
            <CreditCard className="h-4 w-4 text-zinc-400" />
            <span className="text-sm text-zinc-600">Document Type</span>
          </div>
          <span className="text-sm font-semibold text-zinc-900 capitalize">
            {(kycData.DocumentType && kycData.DocumentType.replace("_", " ")) ||
              "Not selected"}
          </span>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-zinc-400" />
              <span className="text-sm text-zinc-600">Document Files</span>
            </div>
            <span className="text-sm font-semibold text-zinc-900">
              {kycData.Kyc.length > 0
                ? `${kycData.Kyc.length} file(s)`
                : "✗ Missing"}
            </span>
          </div>
          {kycData.Kyc.length > 0 && (
            <ul className="mt-2 space-y-2">
              {kycData.Kyc.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-2.5 text-sm"
                >
                  <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                  <span className="flex-1 text-zinc-700">{file.name}</span>
                  <span className="text-xs text-zinc-400">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4">
          <div className="flex items-center gap-3">
            <Camera className="h-4 w-4 text-zinc-400" />
            <span className="text-sm text-zinc-600">Selfie Photo</span>
          </div>
          <span className="text-sm font-semibold text-zinc-900">
            {kycData.SelfieImage ? (
              <span className="flex items-center gap-1.5 text-primary">
                <CheckCircle className="h-4 w-4" />
                {kycData.SelfieImage.name}
              </span>
            ) : (
              <span className="text-red-500">✗ Missing</span>
            )}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
          <p className="text-sm text-zinc-600">
            Please review all information carefully. Once submitted, you cannot
            edit your KYC application. Click Submit to complete your
            verification.
          </p>
        </div>
      </div>

      <StepNavigation
        isSubmitForm={true}
        isSubmitting={isSubmitting}
        disableContinue={!isStepValid(4)}
        submitLabel="Submit"
      />
    </form>
  );
};

export default KycReview;
