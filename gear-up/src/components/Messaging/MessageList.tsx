"use client";

import { IMessageData } from "@/app/types/message.types";
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: IMessageData[];
  currentUserId: string;
  onReadMessage: () => void;
  messagesRead: boolean;
}

export default function MessageList({
  messages,
  currentUserId,
  onReadMessage,
  messagesRead,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">
            No messages yet. Start the conversation!
          </p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.isMine}
              onReadMessage={onReadMessage}
              messagesRead={messagesRead}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
