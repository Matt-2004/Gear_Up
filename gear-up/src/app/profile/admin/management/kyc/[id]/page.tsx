import KycDetailPage from "@/components/Admin/KycDetailPage"
import { use } from "react"

const KycDetail = ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = use(params)

	return <KycDetailPage id={id} />
}

export default KycDetail
