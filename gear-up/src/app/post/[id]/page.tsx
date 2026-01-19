import { getPostById } from "@/utils/FetchAPI"
import { cookies } from "next/headers"
import Details from "./Details"

const getData = async (id: string) => {
	const res = await getPostById(id)
	return res
}

const Page = async ({
	params,
}: {
	params: Promise<{ id: string }>
}) => {
	const { id } = await params
	const postData = await getData(id)
	const cookieStore = await cookies()
	const access_token = cookieStore.get("access_token")?.value


	return <Details access_token={access_token ?? ""}
		id={id}
		data={postData} />
}

export default Page
