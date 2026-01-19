import clsx from "clsx"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Steps } from "./KycRegister"

export const StepNavigation = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const step = Number(searchParams.get("step") ?? 1)
	const currentPath = usePathname()

	const onBack = () => {
		if (step > 1) {
			router.push(`${currentPath}?step=${step - 1}`)
		}
		// redirect to previous path
	}

	const onNext = () => {
		if (step < Steps.length) {
			setTimeout(() => router.push(`${currentPath}?step=${step + 1}`), 500)
		}
	}
	console.log("currentStep:: ", step)

	return (
		<div className="mt-8 flex w-full max-w-2xl items-center justify-between gap-4">
			<button
				type="button"
				onClick={() => onBack()}
				disabled={step === 0}
				className={clsx(
					"rounded-lg px-6 py-3 font-medium transition-all duration-200",
					step === 0
						? "cursor-not-allowed bg-gray-800 text-gray-600"
						: "bg-gray-700 text-white hover:bg-gray-600",
				)}
			>
				<span className="flex items-center justify-center gap-2">
					<ChevronLeft />
					Back
				</span>
			</button>

			<button
				type="submit"
				onClick={() => onNext()}
				className={clsx(
					"rounded-lg px-8 py-3 font-medium transition-all duration-200",
					"bg-gray-700 text-white hover:bg-gray-600",
				)}
			>
				<span className="flex items-center justify-center gap-2">
					Next
					<ChevronRight />
				</span>
			</button>
		</div>
	)
}
