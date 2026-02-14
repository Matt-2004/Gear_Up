"use client";

import { IMessageData, IMessageDetailData } from "@/app/types/message.types";
import {
  getConversationsByConversationId,
  readMessagesByConversationId,
} from "@/utils/API/MessageAPI";
import * as signalR from "@microsoft/signalr";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChatWindow from "./ChatWindow";

interface MessagesClientProps {
  userId?: string;
  messages: IMessageDetailData<IMessageData[]>;
  access_token: string;
}

export default function MessagesClient({
  userId,
  messages,
  access_token
}: MessagesClientProps) {
  const [messageList, setMessageList] = useState<IMessageData[]>(
    messages.messages || [],
  );
  const [conversationId, setConversationId] = useState<string>(
    messages.conversationId,
  );
  const [messagesRead, setMessagesRead] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFetchingRef = useRef(false);

  const otherUser = useMemo(
    () =>
      userId
        ? {
          id: messages.otherUserId,
          name: messages.otherUserName || "User",
          avatarUrl: messages.otherUserAvatarUrl,
        }
        : null,
    [
      userId,
      messages.otherUserId,
      messages.otherUserName,
      messages.otherUserAvatarUrl,
    ],
  );

  const currentUserId = useMemo(() => messageList[0]?.senderId, [messageList]);

  const fetchMessages = useCallback(
    async (showLoading = true) => {
      if (!conversationId || isFetchingRef.current) {
        if (!conversationId) setMessageList([]);
        return;
      }

      try {
        isFetchingRef.current = true;
        if (showLoading) setLoading(true);
        const data = await getConversationsByConversationId(conversationId);
        const messageData = data?.data?.messages ?? [];
        setMessageList(messageData);
        await readMessagesByConversationId(conversationId);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        isFetchingRef.current = false;
        if (showLoading) setLoading(false);
      }
    },
    [conversationId],
  );

  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5255/hubs/chat", {
        accessTokenFactory: () => access_token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
  })

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!userId || isFetchingRef.current) return;

      try {
        setLoading(true);
        await fetchMessages(false);
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setLoading(false);
      }
    },
    [userId, fetchMessages],
  );

  const handleReadMessage = useCallback(async () => {
    if (!conversationId || messagesRead) return;
    try {
      await readMessagesByConversationId(conversationId);
      setMessagesRead(true);
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  }, [conversationId, messagesRead]);

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
