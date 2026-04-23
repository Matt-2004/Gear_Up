"use client";

import CarImage from "@/components/Common/Image";
import clsx from "clsx";
import { ImageUp } from "lucide-react";
import { useState } from "react";
import { StepNavigation } from "./StepNavigation";
import { useKycRegisterContext } from "@/app/profile/dealer/register/context/KycRegisterContext";

interface FileItem {
  id: string;
  file: File | null;
  preview: string;
  label: string;
}

const KycUpload = () => {
  const { kycData, updateKycData } = useKycRegisterContext();
  const firstImagePreview = kycData.Kyc && kycData.Kyc[0];
  const secondImagePreview = kycData.Kyc && kycData.Kyc[1];
  const [fileItems, setFileItems] = useState<FileItem[]>([
    {
      id: "1",
      file: firstImagePreview ?? null,
      preview: firstImagePreview ? URL.createObjectURL(firstImagePreview) : "",
      label: "Front Side",
    },
    {
      id: "2",
      file: secondImagePreview ?? null,
      preview: secondImagePreview
        ? URL.createObjectURL(secondImagePreview)
        : "",
      label: "Back Side",
    },
  ]);

  // const getDocumentLabel = () => {
  // 	const labels: Record<string, string> = {
  // 		passport: "Passport",
  // 		national_id: "National ID Card",
  // 		drivers_license: "Driver's License",
  // 	}
  // 	return labels[documentType] || "Document"
  // }
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

  const handleLabelChange = (id: string, label: string) => {
    setFileItems(
      fileItems.map((item) => (item.id === id ? { ...item, label } : item)),
    );
  };

  return (
    <div className="w-full max-w-2xl rounded-xl bg-white shadow-lg border-2 border-gray-200 p-8">
      <h3 className="mb-3 text-2xl font-bold text-gray-900">
        {/* Upload {getDocumentLabel()} */}
      </h3>
      <p className="mb-6 text-gray-600">
        {/* Please upload clear photos of your {getDocumentLabel().toLowerCase()}. */}
        You can add multiple documents.
      </p>

      <div className="space-y-4">
        {fileItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-750 rounded-lg  shadow-md border border-gray-100	 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex-1 ">
                <label className=" block text-sm font-medium text-gray-700">
                  Document Label
                </label>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
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
                "rounded-lg border-2 border-dashed p-6 transition-all duration-200",
                item.file
                  ? "border-green-500 bg-green-900/20"
                  : "border-gray-200 hover:border-gray-500",
              )}
            >
              {item.preview ? (
                <div className="relative">
                  <CarImage
                    src={item.preview}
                    alt={`${item.label} preview`}
                    className="h-48 w-full rounded-lg object-contain"
                    width={50}
                    height={50}
                  />
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-900 p-2">
                    <span className="flex-1 truncate text-sm text-gray-300">
                      {item.file?.name}
                    </span>
                    <label className="ml-3 cursor-pointer rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium transition-colors hover:bg-blue-700">
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

      {/* Step Navigation*/}
      <StepNavigation />
    </div>
  );
};

const DefaultImageUpload = ({
  id,
  handleFileChange,
}: {
  id: string;
  handleFileChange: (id: string, file: File | null) => void;
}) => {
  return (
    <label className="flex cursor-pointer flex-col items-center">
      <ImageUp className="m-4 h-9 w-9 text-primary-500" />
      <span className="mb-1 text-sm text-gray-700">Click to upload</span>
      <span className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</span>
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
    <div className="mt-6 rounded-lg border-2 border-primary-200 bg-primary-50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-primary-800">Upload Summary</p>
        <span className="text-sm text-primary-700">
          {fileItems.filter((item) => item.file).length} / {fileItems.length}{" "}
          uploaded
        </span>
      </div>
      <p className="text-xs text-primary-700">
        Total size:{" "}
        {(
          fileItems.reduce((sum, item) => sum + (item.file?.size || 0), 0) /
          1024 /
          1024
        ).toFixed(2)}{" "}
        MB
      </p>
    </div>
  );
};

const UploadTips = () => {
  return (
    <div className="mt-4 rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <svg
          className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <p className="text-sm font-medium text-amber-900">Upload Tips</p>
          <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-amber-800">
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

// const ImagePreview = () => {
// 	return ()
// }

export default KycUpload;
