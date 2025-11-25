"use client";

import React, { useState } from "react";
import clsx from "clsx";
import Image from "next/image";

interface FileItem {
  id: string;
  file: File | null;
  preview: string;
  label: string;
}

interface KycUploadProps {
  documentType: string;
  onUploadFiles: (files: File[]) => void;
}

const KycUpload: React.FC<KycUploadProps> = ({
  documentType,
  onUploadFiles,
}) => {
  const [fileItems, setFileItems] = useState<FileItem[]>([
    { id: "1", file: null, preview: "", label: "Front Side" },
    { id: "2", file: null, preview: "", label: "Back Side" },
  ]);

  const getDocumentLabel = () => {
    const labels: Record<string, string> = {
      passport: "Passport",
      national_id: "National ID Card",
      drivers_license: "Driver's License",
    };
    return labels[documentType] || "Document";
  };

  const handleFileChange = (id: string, file: File | null) => {
    const updatedItems = fileItems.map((item) => {
      if (item.id === id && file) {
        const preview = URL.createObjectURL(file);
        return { ...item, file, preview };
      }
      return item;
    });

    setFileItems(updatedItems);

    // Send array of files to parent (filter out nulls)
    const validFiles = updatedItems
      .filter((item) => item.file !== null)
      .map((item) => item.file!);
    onUploadFiles(validFiles);
  };

  const handleAddFile = () => {
    const newId = (fileItems.length + 1).toString();
    setFileItems([
      ...fileItems,
      {
        id: newId,
        file: null,
        preview: "",
        label: `Additional Document ${fileItems.length - 1}`,
      },
    ]);
  };

  const handleRemoveFile = (id: string) => {
    if (fileItems.length > 2) {
      const updatedItems = fileItems.filter((item) => item.id !== id);
      setFileItems(updatedItems);

      // Update parent with remaining files
      const validFiles = updatedItems
        .filter((item) => item.file !== null)
        .map((item) => item.file!);
      onUploadFiles(validFiles);
    }
  };

  const handleLabelChange = (id: string, label: string) => {
    setFileItems(
      fileItems.map((item) => (item.id === id ? { ...item, label } : item)),
    );
  };

  return (
    <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full">
      <h3 className="text-2xl font-bold mb-3 text-white">
        Upload {getDocumentLabel()}
      </h3>
      <p className="text-gray-400 mb-6">
        Please upload clear photos of your {getDocumentLabel().toLowerCase()}.
        You can add multiple documents.
      </p>

      <div className="space-y-4">
        {fileItems.map((item) => (
          <div
            key={item.id}
            className="border border-gray-700 rounded-lg p-4 bg-gray-750"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Document Label
                </label>
                <input
                  disabled={true}
                  type="text"
                  value={item.label}
                  onChange={(e) => handleLabelChange(item.id, e.target.value)}
                  placeholder="e.g., Front Side, Back Side"
                  className="w-full px-3 py-2 bg-gray-900  border-gray-600 rounded-md text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              {fileItems.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveFile(item.id)}
                  className="ml-3 text-red-400 hover:text-red-300 text-sm font-medium"
                >
                  Remove
                </button>
              )}
            </div>

            <div
              className={clsx(
                "border-2 border-dashed rounded-lg p-6 transition-all duration-200",
                item.file
                  ? "border-green-500 bg-green-900/20"
                  : "border-gray-600 hover:border-gray-500",
              )}
            >
              {item.preview ? (
                <div className="relative">
                  <Image
                    src={item.preview}
                    alt={`${item.label} preview`}
                    className="w-full h-48 object-contain rounded-lg"
                    width={50}
                    height={50}
                  />
                  <div className="mt-3 flex items-center justify-between bg-gray-900 p-2 rounded-lg">
                    <span className="text-sm text-gray-300 truncate flex-1">
                      {item.file?.name}
                    </span>
                    <label className="ml-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer text-sm font-medium transition-colors">
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
                <label className="flex flex-col items-center cursor-pointer">
                  <svg
                    className="w-12 h-12 text-gray-500 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-gray-400 mb-1 text-sm">
                    Click to upload
                  </span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) =>
                      handleFileChange(item.id, e.target.files?.[0] || null)
                    }
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        ))}

        {/* Add More Files Button */}
        <button
          type="button"
          onClick={handleAddFile}
          className="w-full py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Another Document
        </button>
      </div>

      {/* Upload Summary */}
      <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-blue-200 font-medium">Upload Summary</p>
          <span className="text-sm text-blue-300">
            {fileItems.filter((item) => item.file).length} / {fileItems.length}{" "}
            uploaded
          </span>
        </div>
        <p className="text-xs text-blue-300">
          Total size:{" "}
          {(
            fileItems.reduce((sum, item) => sum + (item.file?.size || 0), 0) /
            1024 /
            1024
          ).toFixed(2)}{" "}
          MB
        </p>
      </div>

      {/* Upload Tips */}
      <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0"
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
            <p className="text-sm text-yellow-200 font-medium">Upload Tips</p>
            <ul className="text-sm text-yellow-300 mt-1 space-y-1 list-disc list-inside">
              <li>Ensure all text is clearly readable</li>
              <li>Avoid glare and shadows</li>
              <li>Include all corners of the document</li>
              <li>Use landscape orientation for best results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycUpload;
