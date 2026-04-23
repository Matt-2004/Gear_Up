"use client";

import { DocId } from "@/types/kycRegister.types";
import clsx from "clsx";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useKycRegisterContext } from "@/app/profile/dealer/register/context/KycRegisterContext";
import { StepNavigation } from "./StepNavigation";

interface IDocType {
  id: DocId;
  label: string;
  description: string;
  pathIcon: string;
}

const DOCUMENT_TYPES: IDocType[] = [
  {
    id: "Passport",
    label: "Passport",
    description: "International travel document",
    pathIcon: "/passport.png",
  },
  {
    id: "NationalId",
    label: "National ID Card",
    description: "Government-issued ID card",
    pathIcon: "/nationalID.png",
  },
  {
    id: "DriverLicense",
    label: "Driver's License",
    description: "Valid driving permit",
    pathIcon: "/driving-license.png",
  },
  {
    id: "UtilityBill",
    label: "Utility Bill ",
    description: "Recent utilit bill",
    pathIcon: "/pay.png",
  },
  {
    id: "Other",
    label: "Other",
    description: "Valid driving permit",
    pathIcon: "/clipboard.png",
  },
];

const DocumentType = () => {
  const { kycData, updateKycData } = useKycRegisterContext();
  const [selected, setSelected] = useState<DocId>(kycData.DocumentType ?? null);

  const handleSelect = (docId: DocId) => {
    setSelected(docId);
    updateKycData({ DocumentType: docId });
  };

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Data is already saved via handleSelect
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-2xl rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg"
    >
      <h3 className="mb-3 text-2xl font-bold text-gray-900">
        Select Document Type
      </h3>
      <p className="mb-6 text-gray-600">
        Choose the type of identification document you will be uploading
      </p>

      <div className="grid grid-cols-1 gap-4">
        {DOCUMENT_TYPES.map((doc) => (
          <label
            key={doc.id}
            className={clsx(
              "block cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-md",
              selected === doc.id
                ? "border-primary-500 bg-primary-50 ring-primary-200 shadow-md ring-2"
                : "hover:border-primary-300 hover:bg-primary-50/30 border-gray-200 bg-gray-50",
            )}
          >
            <input
              type="radio"
              name="DocumentType"
              value={doc.id as string}
              checked={selected === doc.id}
              onChange={() => handleSelect(doc.id)}
              className="hidden"
            />{" "}
            <div className="flex items-start gap-4">
              <Image
                alt={doc.id as string}
                src={doc.pathIcon}
                width={50}
                height={50}
              />

              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">
                  {doc.label}
                </h4>
                <p className="mt-1 text-sm text-gray-600">{doc.description}</p>
              </div>
            </div>
          </label>
        ))}
      </div>
      <StepNavigation />
    </form>
  );
};

export default DocumentType;
