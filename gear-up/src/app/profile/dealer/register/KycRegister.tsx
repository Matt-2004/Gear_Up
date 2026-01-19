"use client"

import DocumentType from "./DocumentType"
import KycUpload from "./KycUpload"
import { ProgressSteps } from "./ProgressSteps"
import Confirmation from "./Review"
import SelfieImageUpload from "./SelfileImageUpload"

// Content shows depend on params

// Next button only handle submition

// FormAction

interface StepState {
	id: string
	type: string
	label: string
	path: string
}

export type ISteps = StepState[]

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
]

const KycRegister = ({ step }: { step: string }) => {
	// Passing useState to child components to get data

	return (
		<div className="flex min-h-screen flex-col items-center bg-gray-900 px-4 py-12 text-white">
			<div className="w-full max-w-6xl">
				{/* Header */}
				<div className="mb-12 text-center">
					<h1 className="mb-3 text-3xl font-bold md:text-4xl">
						KYC Verification
					</h1>
					<p className="text-gray-400 md:text-lg">
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
					<p className="text-sm text-gray-500">
						Need help? Contact our{" "}
						<a
							href="/support"
							className="text-blue-400 underline hover:text-blue-300"
						>
							support team
						</a>
					</p>
				</div>
			</div>
		</div>
	)
}

interface IRenderStepContentProps {
	step: string
}

const RenderStepContent = ({ step }: IRenderStepContentProps) => {
	return (
		<>
			{step === "1" && <DocumentType />}
			{step === "2" && <KycUpload />}
			{step === "3" && <SelfieImageUpload />}
			{step === "4" && <Confirmation />}
		</>
	)
}

export default KycRegister
