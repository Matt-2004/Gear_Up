export interface CreateMessageDTO {
  receiverId: string;
  text?: string;
  imageUrls?: string;
}

export interface IMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  imageUrls?: string[];
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
  };
  receiver?: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
  };
}

export interface IConversation {
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
  };
  lastMessage: IMessage;
  unreadCount: number;
}

export interface SendMessageRes {
  isSuccess: boolean;
  message: string;
  data: IMessage;
  status: number;
}

export interface GetMessagesRes {
  isSuccess: boolean;
  message: string;
  data: IMessage[];
  status: number;
}

export interface GetConversationsRes {
  isSuccess: boolean;
  message: string;
  data: IConversation[];
  status: number;
}
