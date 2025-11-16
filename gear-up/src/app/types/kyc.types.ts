export interface IKycSubmissions {
    id: string,
    userId: string,
    fullName: string,
    email: string,
    phoneNumber: string ,
    dateOfBirth: string,
    status: string,
    documentType: string,
    documentUrls: string[],
    selfieUrl: string,
    submittedAt: string,
    rejectionReason: string | null
}

export interface IKycRes {
    isSuccess: boolean,
    message: string,
    data: {
        kycSubmissions: IKycSubmissions[]
        totalCount: number
    },
    status: number
}