import { useCallback } from "react"
import { useToast, ToastType } from "@/app/hooks/useToast"

interface AuthToastConfig {
	onSuccess?: {
		message: string
		redirectPath?: string
	}
	onError?: {
		message: string
	}
}

/**
 * Custom hook to manage authentication-specific toast notifications
 * Provides callbacks for handling success and error states independently
 */
export const useAuthToast = (config: AuthToastConfig) => {
	const { addToastMessage, removeToastMessage, ToastComponent } = useToast({
		toastType: null,
		message: null,
	})

	const showSuccessToast = useCallback(
		(message?: string) => {
			const toastMessage =
				message || config.onSuccess?.message || "Operation successful!"
			addToastMessage("success", toastMessage)
		},
		[addToastMessage, config.onSuccess?.message],
	)

	const showErrorToast = useCallback(
		(message?: string) => {
			const toastMessage =
				message || config.onError?.message || "An error occurred."
			addToastMessage("error", toastMessage)
		},
		[addToastMessage, config.onError?.message],
	)

	const showInfoToast = useCallback(
		(message: string) => {
			addToastMessage("info", message)
		},
		[addToastMessage],
	)

	const hideToast = useCallback(() => {
		setTimeout(() => {
			removeToastMessage()
		}, 2500)
	}, [removeToastMessage])

	return {
		ToastComponent,
		showSuccessToast,
		showErrorToast,
		showInfoToast,
		hideToast,
	}
}
