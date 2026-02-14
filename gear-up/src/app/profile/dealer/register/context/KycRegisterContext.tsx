"use client"

import { IKycFormData } from "@/app/types/kycRegister.types"
import { kycRegister } from "@/utils/API/UserAPI"

import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react"

interface KycRegisterContextType {
	kycData: IKycFormData
	updateKycData: (data: Partial<IKycFormData>) => void
	isSubmitting: boolean
	submitError: string | null
	submitKycData: () => Promise<boolean>
	isStepValid: (step: number) => boolean
	resetForm: () => void
}

export const KycRegisterContext = createContext<
	KycRegisterContextType | undefined
>(undefined)

export default function KycRegisterFormProvider({
	children,
}: {
	children: ReactNode
}) {
	const [kycData, setKycData] = useState<IKycFormData>({
		DocumentType: null,
		Kyc: null,
		SelfieImage: null,
	})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)

	const updateKycData = useCallback((data: Partial<IKycFormData>) => {
		setKycData((prev) => ({ ...prev, ...data }))
		setSubmitError(null) // Clear error when user updates data
	}, [])

	// Validate if current step data is filled
	const isStepValid = useCallback((step: number): boolean => {
		switch (step) {
			case 1: // Document Type
				return kycData.DocumentType !== null
			case 2: // KYC Upload
				return (
					kycData.Kyc !== null &&
					kycData.Kyc.length === 2 &&
					kycData.Kyc[0] !== null &&
					kycData.Kyc[1] !== null
				)
			case 3: // Selfie Upload
				return kycData.SelfieImage !== null
			case 4: // Review - all data must be present
				return (
					kycData.DocumentType !== null &&
					kycData.Kyc !== null &&
					kycData.Kyc.length === 2 &&
					kycData.Kyc[0] !== null &&
					kycData.Kyc[1] !== null &&
					kycData.SelfieImage !== null
				)
			default:
				return false
		}
	}, [kycData])

	// Submit KYC data to backend
	const submitKycData = useCallback(async (): Promise<boolean> => {
		// Validate all data before submission
		if (!isStepValid(4)) {
			setSubmitError("Please complete all required fields")
			return false
		}

		setIsSubmitting(true)
		setSubmitError(null)

		try {
			const formData = new FormData()

			// Add document type
			if (kycData.DocumentType) {
				formData.append("DocumentType", kycData.DocumentType)
			}

			// Add KYC documents
			if (kycData.Kyc) {
				formData.append("Kyc", kycData.Kyc[0])
				formData.append("Kyc", kycData.Kyc[1])
			}

			// Add selfie image
			if (kycData.SelfieImage) {
				formData.append("SelfieImage", kycData.SelfieImage)
			}

			console.log("Submitting KYC data:", Object.fromEntries(formData.entries()))

			const response = await kycRegister(formData)

			console.log("KYC submission response:", response)

			// Check if response indicates an error
			if (response.isSuccess === false || response.status >= 400) {
				throw new Error(response.message || "Failed to submit KYC data")
			}

			localStorage.removeItem("kyc_verficiation")
			return true

		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Failed to submit KYC data"
			setSubmitError(errorMessage)
			console.error("KYC submission error:", error)
			return false
		} finally {
			setIsSubmitting(false)
		}
	}, [kycData, isStepValid])

	// Reset form to initial state
	const resetForm = useCallback(() => {
		setKycData({
			DocumentType: null,
			Kyc: null,
			SelfieImage: null,
		})
		setSubmitError(null)
		localStorage.removeItem("kyc_verficiation")
	}, [])

	// Load data from localStorage on mount
	useEffect(() => {
		const savedData = localStorage.getItem("kyc_verficiation")
		if (savedData) {
			try {
				const parsed = JSON.parse(savedData)
				// Note: Files cannot be restored from localStorage
				// Only restore DocumentType if it exists
				if (parsed.DocumentType) {
					setKycData((prev) => ({ ...prev, DocumentType: parsed.DocumentType }))
				}
			} catch (error) {
				console.error("Error loading saved KYC data:", error)
			}
		}
	}, [])

	// Save to localStorage when data changes
	useEffect(() => {
		// Only save DocumentType to localStorage (files cannot be serialized)
		const dataToSave = {
			DocumentType: kycData.DocumentType,
		}
		localStorage.setItem("kyc_verficiation", JSON.stringify(dataToSave))
	}, [kycData])

	return (
		<KycRegisterContext.Provider
			value={{
				kycData,
				updateKycData,
				isSubmitting,
				submitError,
				submitKycData,
				isStepValid,
				resetForm,
			}}
		>
			{children}
		</KycRegisterContext.Provider>
	)
}

export const useKycRegisterContext = () => {
	const context = useContext(KycRegisterContext)

	if (!context) {
		throw new Error("useKycRegisterContext must be used inside a Provider")
	}
	return context
}
