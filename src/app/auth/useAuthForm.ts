import { useEffect, useState } from "react"
import { ZodSchema } from "zod"

interface UseAuthFormResult<T> {
	isPending: boolean
	isButtonActive: boolean
	formData: T
	setFormData: (value: T | ((prev: T) => T)) => void
	errors: Record<string, string>
	handleSubmit: (formData: FormData) => Promise<unknown>
}

/**
 * Custom hook for managing authentication form state and validation.
 * Separates form logic from toast notifications for better modularity.
 *
 * NOTE: Use `onSubmit` (not `action`) on the <form> element so that
 * errors thrown by the submit function propagate correctly to callers.
 */
export const useAuthForm = <T>(
	initialFormData: T,
	schema: ZodSchema,
	submit: (formData: FormData) => Promise<unknown>,
): UseAuthFormResult<T> => {
	const [isPending, setIsPending] = useState(false)
	const [isButtonActive, setIsButtonActive] = useState(false)
	const [formData, setFormData] = useState<T>(initialFormData)
	const [errors, setErrors] = useState<Record<string, string>>({})

	// Validate form data whenever it changes
	useEffect(() => {
		const validationResult = schema.safeParse(formData)

		if (!validationResult.success) {
			const fieldErrors = validationResult.error.flatten()
				.fieldErrors as Record<string, string[]>

			const formattedErrors = Object.keys(fieldErrors).reduce(
				(acc: Record<string, string>, key) => {
					acc[key] = fieldErrors[key]?.[0] || "Invalid input"
					return acc
				},
				{} as Record<string, string>,
			)

			setErrors(formattedErrors)
			setIsButtonActive(false)
		} else {
			setErrors({})
			setIsButtonActive(true)
		}
	}, [formData, schema])

	const handleSubmit = async (formDataToSubmit: FormData) => {
		setIsPending(true)
		try {
			await submit(formDataToSubmit)
		} finally {
			setIsPending(false)
		}
	}

	return {
		isPending,
		isButtonActive,
		formData,
		setFormData,
		errors,
		handleSubmit,
	}
}
