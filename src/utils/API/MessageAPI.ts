import { CreateMessageDTO } from "@/types/message.types";
import { apiFetch, apiPost } from "./AxiosClientBrowser";

export const addMessage = async (data: CreateMessageDTO) =>
  apiPost("/api/messages", data);

export const getConversations = async (cursor?: string) => {
  const url = cursor
    ? `/api/messages/conversations?cursor=${cursor}`
    : "/api/messages/conversations";
  return apiFetch(url);
};

export const getConversationsByConversationId = async (
  conversationId: string,
  cursor?: string,
) => {
  const url = cursor
    ? `/api/messages/conversations/${conversationId}?cursor=${cursor}`
    : `/api/messages/conversations/${conversationId}`;
  return apiFetch(url);
};

export const getConversationByOtherUserId = async (otherUserId: string) =>
  apiFetch(`/api/messages/conversations/with/${otherUserId}`);

export const readMessagesByConversationId = async (conversationId: string) =>
  apiPost(`/api/messages/conversations/${conversationId}/read`, null);
