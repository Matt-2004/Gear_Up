"use client";

import { IMessageData, IMessageDetailData } from "@/app/types/message.types";
import {
  addMessage,
  getConversationsByConversationId,
  readMessagesByConversationId,
} from "@/utils/API/MessageAPI";
import { useEffect, useState } from "react";
import ChatWindow from "./ChatWindow";

interface MessagesClientProps {
  userId?: string;
  messages: IMessageDetailData<IMessageData[]>;
}

export default function MessagesClient({
  userId,
  messages,
}: MessagesClientProps) {
  const [messageList, setMessageList] = useState<IMessageData[]>(
    messages.messages || [],
  );
  const [conversationId, setConversationId] = useState<string>(
    messages.conversationId,
  );
  const [messagesRead, setMessagesRead] = useState(false);

  const [loading, setLoading] = useState(false);

  const otherUser = userId
    ? {
        id: messages.otherUserId,
        name: messages.otherUserName || "User",
        avatarUrl: messages.otherUserAvatarUrl,
      }
    : null;
  const currentUserId = messageList[0]?.senderId;

  const fetchMessages = async (showLoading = true) => {
    if (!conversationId) {
      setMessageList([]);
      return;
    }

    try {
      if (showLoading) setLoading(true);
      const data = await getConversationsByConversationId(conversationId);
      const messageData = data?.data?.messages ?? [];
      setMessageList(messageData);
      await readMessagesByConversationId(conversationId);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  const handleSendMessage = async (text: string) => {
    if (!userId) return;

    try {
      setLoading(true);
      await addMessage({ receiverId: userId, text });
      await fetchMessages(false);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReadMessage = async () => {
    if (!conversationId) return;
    try {
      await readMessagesByConversationId(conversationId);
      setMessagesRead(true);
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

  return (
    <div className="h-screen bg-gray-50">
      <ChatWindow
        messages={messageList}
        currentUserId={currentUserId}
        otherUserId={otherUser}
        onSendMessage={handleSendMessage}
        onReadMessage={handleReadMessage}
        messagesRead={messagesRead}
        loading={loading}
      />
    </div>
  );
}
