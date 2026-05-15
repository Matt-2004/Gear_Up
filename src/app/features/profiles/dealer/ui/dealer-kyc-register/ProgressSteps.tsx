import clsx from "clsx"
import { Fragment } from "react"

import { ISteps } from "./KycRegister"

export const ProgressSteps = ({ Steps, currentStep = "1" }: { Steps: ISteps; currentStep?: string }) => {
	const stepIndex = Steps.findIndex(
		(step) => step.id === currentStep,
	)

	return (
		<form className="w-full max-w-4xl">
			<div className="flex items-center justify-between w-full overflow-x-auto hide-scrollbar sm:overflow-visible">
				{Steps.map((step, index) => (
					<Fragment key={step.id}>
						{/* Step Circle + Label */}
						<div className="flex flex-col items-center">
							<div
								className={clsx(
									"flex h-11 w-11 items-center justify-center rounded-full border-2 font-semibold text-sm transition-all duration-500",
									index < stepIndex
										? "border-primary bg-primary text-white"
										: stepIndex === index
											? "border-primary bg-white text-primary shadow-[0_0_0_4px_rgba(var(--tw-shadow-color,var(--primary)),0.1)]"
											: "border-zinc-200 bg-white text-zinc-300",
								)}
							>
								{index < stepIndex ? (
									<svg
										className="h-5 w-5"
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
									"mt-3 text-xs font-medium transition-colors duration-300",
									index < stepIndex
										? "text-primary"
										: stepIndex === index
											? "text-zinc-900 font-semibold"
											: "text-zinc-300",
								)}
							>
								{step.label}
							</p>
						</div>

						{/* Connector Line */}
						{index < Steps.length - 1 && (
							<div className="mx-4 mb-8 h-px flex-1 bg-zinc-200 transition-all duration-300">
								<div
									className={clsx(
										"h-full transition-all duration-500",
										index < stepIndex
											? "bg-primary"
											: "bg-transparent",
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
