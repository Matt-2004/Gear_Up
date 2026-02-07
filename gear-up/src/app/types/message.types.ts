import { DefaultResponse } from "./Default_Response";

export interface CreateMessageDTO {
  receiverId: string;
  text?: string;
  imageUrls?: string;
}

export interface IMessage<T> extends DefaultResponse<T> {}

export interface IMessageCursor {
  items: IMessageListData[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface IMessageListData {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatarUrl?: string;
  lastMessageText: string;
  lastMessageAt: string;
  unreadCount: number;
  createdAt: string;
}

type F = IMessageData[] | null;
export interface IMessageDetail extends DefaultResponse<
  IMessageDetailData<F>
> {}

export interface IMessageDetailData<T> {
  conversationId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatarUrl: string;
  messages: T;
  nextCursor: string | null;
  hasMore: boolean;
}

export interface IMessageData {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl: string;
  text: string;
  imageUrl: string;
  sentAt: string;
  editedAt: string | null;
  isMine: boolean;
}
