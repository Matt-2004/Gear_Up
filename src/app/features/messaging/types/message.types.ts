import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { MainResponse } from "@/app/shared/types.ts/main-response";

export interface CreateMessageDTO {
  receiverId: string;
  text?: string;
  imageUrls?: string;
}

export interface MessageResponses extends MainResponse<
  CursorResponse<IMessageListData[]>
> {}

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

export interface MessageDetailResponse extends MainResponse<
  IMessageDetailData<IMessageData[]>
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
