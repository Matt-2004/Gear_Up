import KycDetailPage from "@/components/Admin/KycDetailPage"
import { getKycById } from "@/utils/FetchAPI"

const getKycDataById = async (id: string) => {
	const response = await getKycById(id)
	return response
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params
	const kycById = await getKycDataById(id)

	return <KycDetailPage kycById={kycById} />
}

export default Page
