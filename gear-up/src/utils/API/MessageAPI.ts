import { CreateMessageDTO } from "@/app/types/message.types";
import { getFetch, postFetch } from "./AxiosClient";

export const addMessage = async (data: CreateMessageDTO) => {
  const res = await postFetch(`/api/v1/messages`, data);
  return res;
};

export const getConversations = async (cursor?: string) => {
  const url = cursor
    ? `/api/v1/messages/conversations?cursor=${cursor}`
    : `/api/v1/messages/conversations`;
  const res = await getFetch(url);
  return res;
};

export const getConversationsByConversationId = async (
  conversationId: string,
  cursor?: string,
) => {
  const url = cursor
    ? `/api/v1/messages/conversations/${conversationId}?cursor=${cursor}`
    : `/api/v1/messages/conversations/${conversationId}`;
  const res = await getFetch(url);
  return res;
};

export const getConversationByOtherUserId = async (otherUserId: string) => {
  const res = await getFetch(
    `/api/v1/messages/conversations/with/${otherUserId}`,
  );
  return res;
};

export const readMessagesByConversationId = async (conversationId: string) => {
  const res = await postFetch(
    `/api/v1/messages/conversations/${conversationId}/read`,
    null,
  );
  return res;
};
