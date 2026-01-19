import { IKycRes } from "@/app/types/kyc.types"

export function kycFilter(kycRes: IKycRes, status: string) {
	if (!kycRes.data.kycDto) {
		return
	}

	const kycFilter = kycRes.data.kycDto.filter((data) => data.status === status)

	return kycFilter.length
}
