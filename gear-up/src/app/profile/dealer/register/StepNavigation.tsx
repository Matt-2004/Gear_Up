import clsx from "clsx"
import React from "react"

interface StepNavigationProps {
	currentStep: number
	totalSteps: number
	onNext: () => void
	onBack: () => void
	isLoading?: boolean
	isLastStep?: boolean
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
	currentStep,

	onNext,
	onBack,
	isLoading = false,
	isLastStep = false,
}) => {
	return (
		<div className="mt-8 flex w-full max-w-2xl items-center justify-between gap-4">
			<button
				type="button"
				onClick={onBack}
				disabled={currentStep === 0 || isLoading}
				className={clsx(
					"rounded-lg px-6 py-3 font-medium transition-all duration-200",
					currentStep === 0 || isLoading
						? "cursor-not-allowed bg-gray-800 text-gray-600"
						: "bg-gray-700 text-white hover:bg-gray-600",
				)}
			>
				<span className="flex items-center gap-2">
					<svg
						className="h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					Back
				</span>
			</button>

			<button
				type="button"
				onClick={onNext}
				disabled={isLoading}
				className={clsx(
					"rounded-lg px-8 py-3 font-medium transition-all duration-200",
					isLoading
						? "cursor-not-allowed bg-gray-600 text-gray-400"
						: isLastStep
							? "bg-green-600 text-white hover:bg-green-700"
							: "bg-blue-600 text-white hover:bg-blue-700",
				)}
			>
				{isLoading ? (
					<span className="flex items-center gap-2">
						<svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
								fill="none"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						Submitting...
					</span>
				) : (
					<span className="flex items-center gap-2">
						{isLastStep ? "Submit" : "Next"}
						{!isLastStep && (
							<svg
								className="h-5 w-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						)}
					</span>
				)}
			</button>
		</div>
	)
}
