"use client";

import { DocId } from "@/app/features/profiles/dealer/types/kycRegister.types";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
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
  const { kycData, updateKycData, isStepValid } = useKycSubmit();
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
      className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.04)]"
    >
      <h3 className="mb-1 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
        Select Document Type
      </h3>
      <p className="mb-7 text-sm text-zinc-500">
        Choose the type of identification document you will be uploading
      </p>

      <div className="grid gap-3">
        {DOCUMENT_TYPES.map((doc) => (
          <label
            key={doc.id}
            className={clsx(
              "block cursor-pointer rounded-xl border px-5 py-4 transition-all duration-300",
              selected === doc.id
                ? "border-primary/40 bg-primary-50/50 shadow-[0_0_0_1px_rgba(0,0,0,0.02)]"
                : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50",
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
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                  <Image
                    alt={doc.id as string}
                    src={doc.pathIcon}
                    width={24}
                    height={24}
                  />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">
                    {doc.label}
                  </h4>
                  <p className="text-xs text-zinc-500">{doc.description}</p>
                </div>
              </div>
              {selected === doc.id && (
                <CircleCheckBig className="h-5 w-5 text-primary shrink-0" />
              )}
            </div>
          </label>
        ))}
      </div>
      <StepNavigation disableContinue={!isStepValid(1)} />
    </form>
  );
};

export default DocumentType;
