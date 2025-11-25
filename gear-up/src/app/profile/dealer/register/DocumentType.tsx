"use client";

import React from "react";
import clsx from "clsx";
import Image from "next/image";

interface DocumentTypeProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

const DOCUMENT_TYPES = [
  {
    id: "passport",
    label: "Passport",
    description: "International travel document",
    pathIcon: "/passport.png",
  },
  {
    id: "national_id",
    label: "National ID Card",
    description: "Government-issued ID card",
    pathIcon: "/nationalID.png",
  },
  {
    id: "drivers_license",
    label: "Driver's License",
    description: "Valid driving permit",
    pathIcon: "/driving-license.png",
  },
  {
    id: "utility_bill",
    label: "Utility Bill ",
    description: "Recent utilit bill",
    pathIcon: "/pay.png",
  },
  {
    id: "other",
    label: "Other",
    description: "Valid driving permit",
    pathIcon: "/clipboard.png",
  },
];

const DocumentType: React.FC<DocumentTypeProps> = ({
  selectedType,
  onSelect,
}) => {
  return (
    <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full">
      <h3 className="text-2xl font-bold mb-3 text-white">
        Select Document Type
      </h3>
      <p className="text-gray-400 mb-6">
        Choose the type of identification document you will be uploading
      </p>

      <div className="grid grid-cols-1 gap-4">
        {DOCUMENT_TYPES.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={() => onSelect(doc.id)}
            className={clsx(
              "p-6 cursor-pointer rounded-lg border-2 transition-all duration-200 text-left",
              selectedType === doc.id
                ? "border-blue-500 bg-blue-900/30"
                : "border-gray-700 bg-gray-750 hover:border-gray-600 hover:bg-gray-700",
            )}
          >
            <div className="flex items-start gap-4">
              <Image alt={doc.id} src={doc.pathIcon} width={50} height={100} />

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {doc.label}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {doc.description}
                    </p>
                  </div>
                  {selectedType === doc.id && (
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DocumentType;
