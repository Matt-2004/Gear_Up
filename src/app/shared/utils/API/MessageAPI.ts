import { CreateMessageDTO } from "@/app/features/messaging/types/message.types";

import { getFetch, postFetch } from "./AxiosClient";

export const addMessage = async (data: CreateMessageDTO) =>
  postFetch("/api/v1/messages", data);

export const getConversations = async (cursor?: string) => {
  const url = cursor
    ? `/api/v1/messages/conversations?cursor=${cursor}`
    : "/api/v1/messages/conversations";
  return getFetch(url);
};

export const getConversationsByConversationId = async (
  conversationId: string,
  cursor?: string,
) => {
  const url = cursor
    ? `/api/v1/messages/conversations/${conversationId}?cursor=${cursor}`
    : `/api/v1/messages/conversations/${conversationId}`;
  return getFetch(url);
};

export const getConversationByOtherUserId = async (otherUserId: string) =>
  getFetch(`/api/v1/messages/conversations/with/${otherUserId}`);

export const readMessagesByConversationId = async (conversationId: string) =>
  postFetch(`/api/v1/messages/conversations/${conversationId}/read`, null);
