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
  const { kycData, updateKycData } = useKycSubmit();
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
      className="w-full max-w-2xl rounded-xl bg-white shadow-sm border border-gray-200 p-8"
    >
      <h3 className="mb-1 text-2xl font-bold text-gray-900">
        Verify Your Identity
      </h3>
      <p className="text-sm text-gray-500">
        {/* Please upload clear photos of your {getDocumentLabel().toLowerCase()}. */}
        You can add multiple documents.
      </p>

      <div className="space-y-4">
        {fileItems.map((item) => (
          <div key={item.id} className="">
            <div className="mb-3 flex items-center justify-between">
              {fileItems.length > 2 && (
                <button
                  type="button"
                  // onClick={() => handleRemoveFile(item.id)}
                  className="ml-3 text-sm font-medium text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>

            <div
              className={clsx(
                "rounded-lg transition-all duration-200 h-full w-full",
                item.file
                  ? "border-green-500 bg-foreground"
                  : "border-gray-200 hover:border-gray-500",
              )}
            >
              {item.preview ? (
                <div className="group relative  overflow-hidden rounded-xl border border-gray-200 bg-foreground shadow-sm">
                  {/* Image Area */}
                  <div className="relative h-80 w-full overflow-hidden bg-foreground">
                    <CarImage
                      src={item.preview}
                      alt={`${item.label} preview`}
                      className="h-full w-full object-contain transition-transform pt-4 duration-300 group-hover:scale-105"
                      width={384}
                      height={320}
                    />
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-gray-200" />

                  {/* Footer */}
                  <div className="flex items-center gap-2 bg-foreground px-3 py-2.5">
                    <span className="flex-1 truncate text-sm text-gray-900">
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
      <StepNavigation label="Submit" />
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
    <label className="group space-y-2 hover:border-primary hover:bg-primary-50/40 focus-within:ring-primary/30 flex w-full cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-gray-300 bg-[#E8E9E0] p-10 text-center transition-all duration-200 hover:shadow-md focus-within:ring-4">
      <div className="p-4 bg-primary-50/70 rounded-full">
        <Upload className=" h-6 w-6 text-primary" />
      </div>
      <h1 className="font-semibold text-gray-900">{label}</h1>
      <h3 className="text-sm w-[75%] text-gray-500">{description}</h3>
      <span className="mb-1 cursor-pointer uppercase px-4 text-xs font-semibold py-1 rounded-full text-primary  bg-primary-50/70 group-hover:bg-foreground group-hover:text-gray-900">
        Click to upload
      </span>
      <span className="text-xs text-gray-500 mt-1">
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
  return (
    <div className="mt-6 rounded-lg border border-primary-200 bg-primary-50 p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-primary-800">Upload Summary</p>
        <span className="text-sm font-medium text-primary-700">
          {Math.round(
            (fileItems.filter((item) => item.file).length / fileItems.length) *
              100,
          )}
          %
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-primary-200">
        <div
          className="h-full rounded-full bg-primary-600 transition-all duration-500 ease-out"
          style={{
            width: `${Math.round((fileItems.filter((item) => item.file).length / fileItems.length) * 100)}%`,
          }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-primary-700">
          {fileItems.filter((item) => item.file).length} of {fileItems.length}{" "}
          files uploaded
        </p>
        <p className="text-xs text-primary-700">
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
    <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
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
    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
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
