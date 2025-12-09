export interface KYC {
	DocumentType: string
	Kyc: File
	SelfieImage: File
}

export interface IProgressStep {
	id: number
	name: string
	label: string
	isComplete: boolean
}

export interface IKycFormData {
	DocumentType: string
	Kyc: File[]
	SelfieImage: File | null
}
