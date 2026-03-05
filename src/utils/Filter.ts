import { IKycSubmissions } from "@/types/kyc.types"
import { CursorBaseDTO } from "@/types/post.types"

export function kycFilter(
	kycRes: Omit<CursorBaseDTO, "items"> & { items: IKycSubmissions[] },
	status: string,
) {
	if (!kycRes.items) {
		return
	}

	const kycFilter = kycRes.items.filter((data) => data.status === status)

	return kycFilter.length
}
