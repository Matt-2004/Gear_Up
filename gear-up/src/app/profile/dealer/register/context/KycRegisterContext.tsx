"use client"

import { IKycFormData } from "@/app/types/kycRegister.types"

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

	const updateKycData = useCallback((data: Partial<IKycFormData>) => {
		setKycData((prev) => ({ ...prev, ...data }))
	}, [])

	useEffect(() => {
		localStorage.setItem("kyc_verficiation", JSON.stringify(kycData))
	}, [kycData])

	return (
		<KycRegisterContext.Provider value={{ kycData, updateKycData }}>
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
