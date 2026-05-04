"use client";

import { DocId } from "@/app/features/profiles/dealer/types/kycRegister.types";
import clsx from "clsx";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useKycSubmit } from "@/app/features/profiles/dealer/context/KycFormContext";
import { CircleCheckBig } from "lucide-react";
import StepNavigation from "../add-car-form/StepNavigation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  const { kycData, updateKycData } = useKycSubmit();
  const [selected, setSelected] = useState<DocId>(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get("step") ?? 1);

  useEffect(() => {
    setSelected(kycData.DocumentType);
  }, [kycData.DocumentType]);

  const handleSelect = (docId: DocId) => {
    setSelected(docId);
    updateKycData({ DocumentType: docId });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`${pathname}?step=${currentStep + 1}`);
      }}
      className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      <h3 className="mb-1 text-3xl font-bold text-gray-900">
        Select Document Type
      </h3>
      <p className="mb-6 text-sm text-gray-500">
        Choose the type of identification document you will be uploading
      </p>

      <div className="grid gap-4">
        {DOCUMENT_TYPES.map((doc) => (
          <label
            key={doc.id}
            className={clsx(
              "block cursor-pointer px-4 py-2 rounded-xl border bg-foreground transition-all duration-200 hover:border-primary",
              selected === doc.id
                ? "border-primary-500 ring-primary bg-white shadow-sm ring-1"
                : " border-gray-200 ",
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
            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <Image
                  alt={doc.id as string}
                  src={doc.pathIcon}
                  width={40}
                  height={40}
                />

                <h4 className="text-lg items-center text-gray-900">
                  {doc.label}
                </h4>
              </div>
              {selected === doc.id && (
                <CircleCheckBig className="text-primary" />
              )}
            </div>
          </label>
        ))}
      </div>
      <StepNavigation label="Submit" />
    </form>
  );
};

export default DocumentType;
