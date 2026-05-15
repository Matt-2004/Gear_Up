"use client";

import DocumentType from "./DocumentType";
import KycUpload from "./KycUpload";
import { ProgressSteps } from "./ProgressSteps";
import SelfieImageUpload from "./SelfileImageUpload";
import KycReview from "./KycReview";

// Content shows depend on params

// Next button only handle submition

// FormAction

interface StepState {
  id: string;
  type: string;
  label: string;
  path: string;
}

export type ISteps = StepState[];

export const Steps: ISteps = [
  {
    id: "1",
    type: "DocumentType",
    label: "Document Type",
    path: "?step=1",
  },
  {
    id: "2",
    type: "KycUpload",
    label: "Upload Documents",
    path: "?step=2",
  },
  {
    id: "3",
    type: "SelfieUplaod",
    label: "Selfie Verification",
    path: "?step=3",
  },
  {
    id: "4",
    type: "review",
    label: "Review & Submit",
    path: "?step=4",
  },
];

const KycRegister = ({ step }: { step: string }) => {
  // Passing useState to child components to get data

  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-4 py-12 sm:py-16">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <div className="mb-5 inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5">
            <span className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
              Dealer Registration
            </span>
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
            Dealership Registration
          </h1>
          <p className="text-zinc-500 md:text-lg">
            Complete your identity verification to access all features
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10 flex justify-center">
          <ProgressSteps Steps={Steps} currentStep={step || "1"} />
        </div>

        {/* Step Content */}
        <div className="flex flex-col items-center">
          <div className="mb-8 w-full max-w-2xl">
            <RenderStepContent step={step} />
          </div>

          {/* Navigation */}
        </div>

        {/* Help Text */}
        <div className="mt-14 text-center">
          <p className="text-sm text-zinc-400">
            Need help? Contact our{" "}
            <a
              href="/support"
              className="text-zinc-600 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-900 hover:decoration-zinc-400 font-medium"
            >
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

interface IRenderStepContentProps {
  step: string;
}

const RenderStepContent = ({ step }: IRenderStepContentProps) => {
  return (
    <>
      {step === "1" && <DocumentType />}
      {step === "2" && <KycUpload />}
      {step === "3" && <SelfieImageUpload />}
      {step === "4" && <KycReview />}
    </>
  );
};

export default KycRegister;
