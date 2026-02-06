import { useToast } from "@/app/hooks/useToast"
import clsx from "clsx"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { Steps } from "./KycRegister"
import { useKycRegisterContext } from "./context/KycRegisterContext"

export const StepNavigation = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const step = Number(searchParams.get("step") ?? 1)
	const currentPath = usePathname()
	const { isStepValid, isSubmitting, submitKycData, submitError } = useKycRegisterContext()
	const { ToastComponent, addToastMessage, removeToastMessage } = useToast({
		toastType: null,
		message: null,
	})

	const onBack = () => {
		if (step > 1) {
			router.push(`${currentPath}?step=${step - 1}`)
		}
		// redirect to previous path
	}

	const onNext = () => {
		if (step < Steps.length && isStepValid(step)) {
			setTimeout(() => router.push(`${currentPath}?step=${step + 1}`), 500)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		// If we're on the last step, submit the form
		if (step === Steps.length) {
			const success = await submitKycData()
			if (success) {
				addToastMessage("success", "KYC submitted successfully! Redirecting...")
				setTimeout(() => {
					removeToastMessage()
					router.push("/profile/dealer/dashboard")
				}, 2500)
			} else {
				addToastMessage("error", submitError || "Failed to submit KYC. Please try again.")
				setTimeout(() => {
					removeToastMessage()
				}, 2500)
			}
		} else {
			// Otherwise, go to next step
			if (isStepValid(step)) {
				onNext()
			}
		}
	}

	// Auto-dismiss toast after 4 seconds
	useEffect(() => {
		if (submitError) {
			const timer = setTimeout(() => {
				removeToastMessage()
			}, 2500)
			return () => clearTimeout(timer)
		}
	}, [submitError, removeToastMessage])

	const isButtonDisabled = !isStepValid(step) || isSubmitting

	return (
		<>
			<ToastComponent />
			<div className="mt-8 w-full max-w-2xl">
				{submitError && (
					<div className="mb-4 rounded-lg border-2 border-red-200 bg-red-50 p-3 text-sm text-red-800">
						{submitError}
					</div>
				)}

				<div className="flex items-center justify-between gap-4">
					<button
						type="button"
						onClick={() => onBack()}
						disabled={step === 1 || isSubmitting}
						className={clsx("rounded-xl px-6 py-3 font-medium transition-all duration-200 border-2",
							step === 1 || isSubmitting
								? "cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400"
								: "bg-white text-gray-700 cursor-pointer border-gray-100 hover:border-gray-200 shadow-sm shadow-gray-300 ",)}
					>
						<span className="flex items-center justify-center gap-2">
							<ChevronLeft />
							Back
						</span>
					</button>

					<button
						type="submit"
						onClick={handleSubmit}
						disabled={isButtonDisabled}
						className={clsx(
							"rounded-xl px-8 py-3 font-medium transition-all duration-200 border-2",
							isButtonDisabled
								? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300 shadow-sm shadow-gray-300"
								: "bg-primary-600 text-white cursor-pointer hover:bg-primary-700 border-primary-600 hover:border-primary-700 shadow-md hover:shadow-lg",
						)}
					>
						<span className="flex items-center justify-center gap-2">
							{isSubmitting ? (
								<>
									<Loader2 className="h-5 w-5 animate-spin" />
									Submitting...
								</>
							) : (
								<>
									{step === Steps.length ? "Submit" : "Next"}
									<ChevronRight />
								</>
							)}
						</span>
					</button>
				</div>
			</div>
		</>
	)
}