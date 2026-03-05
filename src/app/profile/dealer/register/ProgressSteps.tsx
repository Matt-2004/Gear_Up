import clsx from "clsx"
import { useSearchParams } from "next/navigation"
import { Fragment } from "react"

import { ISteps } from "./KycRegister"

export const ProgressSteps = ({ Steps }: { Steps: ISteps }) => {
	const searchPath = useSearchParams().get("step") ?? "1"

	const stepIndex = Steps.findIndex(
		(step) => step.id === searchPath.toString().toLowerCase(),
	)

	return (
		<form className="w-full max-w-4xl">
			<div className="flex items-center justify-between">
				{Steps.map((step, index) => (
					<Fragment key={step.id}>
						{/* Step Circle + Label */}
						<div className="flex flex-col items-center">
							<div
								className={clsx(
									"flex h-12 w-12 items-center justify-center rounded-full border-2 font-semibold transition-all duration-300",
									index < stepIndex
										? "border-primary-600 bg-primary-600 text-white shadow-md"
										: stepIndex === index
											? "border-primary-500 bg-primary-500 text-white ring-4 ring-primary-200 shadow-lg"
											: "border-gray-300 bg-white text-gray-400",
								)}
							>
								{index < stepIndex ? (
									<svg
										className="h-6 w-6"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								) : (
									index + 1
								)}
							</div>
							<p
								className={clsx(
									"mt-3 text-sm font-medium transition-colors",
									index < stepIndex
										? "text-primary-600"
										: stepIndex === index
											? "text-primary-700 font-semibold"
											: "text-gray-500",
								)}
							>
								{step.label}
							</p>
						</div>

						{/* Connector Line */}
						{index < Steps.length - 1 && (
							<div className="mx-4 mb-8 h-1 flex-1 rounded-full bg-gray-200 transition-all duration-300">
								<div
									className={clsx(
										"h-full rounded-full transition-all duration-500",
										index < stepIndex
											? "bg-primary-500"
											: stepIndex > index
												? "bg-primary-400"
												: "bg-gray-200",
									)}
								/>
							</div>
						)}
					</Fragment>
				))}
			</div>
		</form>
	)
}
