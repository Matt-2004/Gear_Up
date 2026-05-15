"use client";

import CarImage from "@/app/shared/ui/Image";
import clsx from "clsx";
import { TriangleAlert, Upload } from "lucide-react";
import { useState } from "react";
import { useKycSubmit } from "@/app/features/profiles/dealer/context/KycFormContext";
import StepNavigation from "../add-car-form/StepNavigation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface FileItem {
  id: string;
  file: File | null;
  description: string;
  preview: string;
  label: string;
}

const KycUpload = () => {
  const { kycData, updateKycData, isStepValid } = useKycSubmit();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get("step") ?? 1);
  const firstImagePreview = kycData.Kyc && kycData.Kyc[0];
  const secondImagePreview = kycData.Kyc && kycData.Kyc[1];
  const [fileItems, setFileItems] = useState<FileItem[]>([
    {
      id: "1",
      file: firstImagePreview ?? null,
      description: "Upload the front of your document",
      preview: firstImagePreview ? URL.createObjectURL(firstImagePreview) : "",
      label: "Front Side",
    },
    {
      id: "2",
      file: secondImagePreview ?? null,
      description: "Upload the back of your document",
      preview: secondImagePreview
        ? URL.createObjectURL(secondImagePreview)
        : "",
      label: "Back Side",
    },
  ]);

  const handleFileChange = (id: string, file: File | null) => {
    const updatedItems = fileItems.map((item) => {
      if (item.id === id && file) {
        const preview = URL.createObjectURL(file);
        return { ...item, file, preview };
      }
      return item;
    });

    setFileItems(updatedItems);
    const validFiles = updatedItems
      .filter((item) => item.file !== null)
      .map((item) => item.file!);
    updateKycData({ Kyc: [validFiles[0], validFiles[1]] });

    // update the data in context
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`${pathname}?step=${currentStep + 1}`);
      }}
      className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.04)]"
    >
      <h3 className="mb-1 text-2xl font-bold tracking-tight text-zinc-900">
        Verify Your Identity
      </h3>
      <p className="text-sm text-zinc-500">
        {/* Please upload clear photos of your {getDocumentLabel().toLowerCase()}. */}
        You can add multiple documents.
      </p>

      <div className="mt-6 space-y-5">
        {fileItems.map((item) => (
          <div key={item.id} className="">
            <div className="mb-3 flex items-center justify-between">
              {fileItems.length > 2 && (
                <button
                  type="button"
                  // onClick={() => handleRemoveFile(item.id)}
                  className="ml-3 text-sm font-medium text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              )}
            </div>

            <div
              className={clsx(
                "rounded-lg transition-all duration-200 h-full w-full",
                item.file
                  ? "border-green-500/60 bg-transparent"
                  : "border-zinc-200 hover:border-zinc-300",
              )}
            >
              {item.preview ? (
                <div className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                  {/* Image Area */}
                  <div className="relative h-80 w-full overflow-hidden bg-zinc-100">
                    <CarImage
                      src={item.preview}
                      alt={`${item.label} preview`}
                      className="h-full w-full object-contain transition-transform pt-4 duration-300 group-hover:scale-105"
                      width={384}
                      height={320}
                    />
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-zinc-200" />

                  {/* Footer */}
                  <div className="flex items-center gap-2 bg-white px-3 py-2.5">
                    <span className="flex-1 truncate text-sm text-zinc-700">
                      {item.file?.name ?? "No file selected"}
                    </span>

                    <label className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600 active:scale-95">
                      Change
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          handleFileChange(item.id, e.target.files?.[0] || null)
                        }
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <DefaultImageUpload
                  id={item.id}
                  label={item.label}
                  description={item.description}
                  handleFileChange={handleFileChange}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Summary */}
      <UploadSummary fileItems={fileItems} />

      {/* Upload Tips */}
      <UploadTips />
      <Disclaimer />
      {/* Step Navigation*/}
      <StepNavigation disableContinue={!isStepValid(2)} />
    </form>
  );
};

export const DefaultImageUpload = ({
  id,
  description,
  label,
  handleFileChange,
}: {
  id: string;
  description: string;
  label: string;
  handleFileChange: (id: string, file: File | null) => void;
}) => {
  return (
    <label className="group flex w-full cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/80 p-10 text-center transition-all duration-300 hover:border-primary/40 hover:bg-primary-50/30 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
      <div className="rounded-full bg-primary-50 p-4">
        <Upload className="h-6 w-6 text-primary" />
      </div>
      <h1 className="mt-3 font-semibold text-zinc-900">{label}</h1>
      <h3 className="mt-1 text-sm text-zinc-500 w-[75%]">{description}</h3>
      <span className="mb-1 mt-3 cursor-pointer rounded-full bg-primary-50 px-4 py-1 text-xs font-semibold uppercase text-primary transition-colors group-hover:bg-primary-100">
        Click to upload
      </span>
      <span className="mt-1 text-xs text-zinc-400">
        PNG, JPG, PDF up to 10MB
      </span>
      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => handleFileChange(id, e.target.files?.[0] || null)}
        className="hidden"
      />
    </label>
  );
};

const UploadSummary = ({ fileItems }: { fileItems: FileItem[] }) => {
  const uploadedCount = fileItems.filter((item) => item.file).length;
  const progressPct = Math.round((uploadedCount / fileItems.length) * 100);

  return (
    <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-700">Upload Summary</p>
        <span className="text-sm font-medium text-zinc-500">
          {progressPct}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500">
          {uploadedCount} of {fileItems.length} files uploaded
        </p>
        <p className="text-xs text-zinc-500">
          {(
            fileItems.reduce((sum, item) => sum + (item.file?.size || 0), 0) /
            1024 /
            1024
          ).toFixed(2)}{" "}
          MB
        </p>
      </div>
    </div>
  );
};

const Disclaimer = () => {
  return (
    <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
      <div>
        <p className="text-sm font-medium text-amber-800">Disclaimer</p>
        <p className="mt-1 text-xs text-amber-700">
          Reloading or leaving this page will clear all uploaded images. Please
          complete your submission before navigating away.
        </p>
      </div>
    </div>
  );
};

const UploadTips = () => {
  return (
    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <div>
          <p className="text-sm font-medium text-amber-800">Upload Tips</p>
          <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-amber-700">
            <li>Ensure all text is clearly readable</li>
            <li>Avoid glare and shadows</li>
            <li>Include all corners of the document</li>
            <li>Use landscape orientation for best results</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KycUpload;
