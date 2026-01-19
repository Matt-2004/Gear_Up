import { Status } from "@/components/Common/StatusUI"

export interface IKycSubmissions {
	id: string
	userId: string
	fullName: string
	email: string
	phoneNumber: string
	dateOfBirth: string
	status: Status
	documentType: string
	documentUrls: string[]
	selfieUrl: string
	submittedAt: string
	rejectionReason: string | null
}

export interface IKycRes {
	isSuccess: boolean
	message: string
	data: {
		kycDto: IKycSubmissions[]
		totalCount: number
	}
	status: number
}

export interface IKycUpdateByAdmin {
	status: "Pending" | "Rejected" | "Approved"
	rejectionReason: string
}
