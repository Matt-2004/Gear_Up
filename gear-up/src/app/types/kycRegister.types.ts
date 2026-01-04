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

export type DocId =
	| "Passport"
	| "NationalId"
	| "DriverLicense"
	| "UtilityBill"
	| "Other"
	| null

export interface IKycFormData {
	DocumentType: DocId
	Kyc: [File, File] | null
	SelfieImage: File | null
}
