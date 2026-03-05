import MessagesClient from "@/components/Messaging/MessagesClient"
import {
	getConversationByOtherUserId,
	getConversationsByConversationId,
} from "@/utils/API/MessageAPI"
import { cookies } from "next/headers"
import {
	IMessage,
	IMessageData,
	IMessageDetailData,
} from "../../types/message.types"

export const dynamic = "force-dynamic"

const getData = async (otherUserId: string) => {
	const res = (await getConversationByOtherUserId(otherUserId)) as IMessage<
		IMessageDetailData<[]>
	>
	if (!res) {
		console.log("No response from getConversationByOtherUserId")
	}
	const conversationId = res.data.conversationId
	const resp = (await getConversationsByConversationId(
		conversationId,
	)) as IMessage<IMessageDetailData<IMessageData[]>>
	return resp.data
}

export default async function MessagesPage({
	searchParams,
}: {
	searchParams: Promise<{ userId: string }>
}) {
	const searchparam = await searchParams
	const userId = searchparam.userId
	const messages = await getData(userId)
	const access_token = (await cookies()).get("access_token")?.value!

	return (
		<MessagesClient
			userId={userId}
			messages={messages}
			access_token={access_token}
		/>
	)
}
