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
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-primary-50 via-white to-primary-100/30 px-4 py-12">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full bg-primary-100 px-4 py-2 border border-primary-200">
            <span className="text-sm font-semibold text-primary-700">
              Dealer Registration
            </span>
          </div>
          <h1 className="mb-3 text-3xl font-bold md:text-4xl text-gray-900">
            Dealership Registration
          </h1>
          <p className="text-gray-600 md:text-lg">
            Complete your identity verification to access all features
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex justify-center">
          <ProgressSteps Steps={Steps} />
        </div>

        {/* Step Content */}
        <div className="flex flex-col items-center">
          <div className="mb-8 w-full max-w-2xl">
            <RenderStepContent step={step} />
          </div>

          {/* Navigation */}
        </div>

        {/* Help Text */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact our{" "}
            <a
              href="/support"
              className="text-primary-600 underline hover:text-primary-700 transition-colors font-medium"
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
