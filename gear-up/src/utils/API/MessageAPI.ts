import { CreateMessageDTO } from "@/app/types/message.types"
import { postFetch } from "./AxiosClient"

export const addMessage = async (data: CreateMessageDTO) => {
	const res = await postFetch(`/api/v1/messages`, data)
	return res
}

export const getConversations = async (curosr: string) => {
	const res = await postFetch(
		`/api/v1/messages/conversations?cursor=${curosr}`,
		null,
	)
	return res
}

export const getConversationsByConversationId = async (
	conversationId: string,
	cursor: string,
) => {
	const res = await postFetch(
		`/api/v1/messages/conversations/${conversationId}?cursor=${cursor}`,
		null,
	)
	return res
}

export const readMessagesByConversationId = async (conversationId: string) => {
	const res = await postFetch(
		`/api/v1/messages/conversations/${conversationId}/read`,
		null,
	)
	return res
}
