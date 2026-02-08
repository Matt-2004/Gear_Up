"use client";

import { IMessageData } from "@/app/types/message.types";
import { format, isToday, isYesterday } from "date-fns";
import { Check, CheckCheck } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";

interface MessageBubbleProps {
  message: IMessageData;
  isCurrentUser: boolean;
  onReadMessage: () => void;
  messagesRead: boolean;
}

export default function MessageBubble({
  message,
  isCurrentUser,
  onReadMessage,
  messagesRead,
}: MessageBubbleProps) {
  const hasCalledReadRef = useRef(false);

  const formattedTime = useMemo(() => {
    const messageDate = new Date(message.sentAt);
    if (isToday(messageDate)) {
      return format(messageDate, "h:mm a");
    } else if (isYesterday(messageDate)) {
      return `Yesterday ${format(messageDate, "h:mm a")}`;
    } else {
      return format(messageDate, "MMM d, h:mm a");
    }
  }, [message.sentAt]);

  useEffect(() => {
    if (!isCurrentUser && !message.isMine && !hasCalledReadRef.current) {
      hasCalledReadRef.current = true;
      onReadMessage();
    }
  }, [message.id, isCurrentUser, message.isMine, onReadMessage]);

  return (
    <div
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex gap-2 max-w-[70%] ${
          isCurrentUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        {!isCurrentUser && (
          <div className="flex-shrink-0">
            {message.senderAvatarUrl ? (
              <Image
                src={message.senderAvatarUrl}
                alt={message.senderName}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                {message.senderName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}

        {/* Message Content */}
        <div
          className={`flex flex-col ${
            isCurrentUser ? "items-end" : "items-start"
          }`}
        >
          {/* Message Bubble */}
          <div
            className={`px-4 py-2 rounded-2xl ${
              isCurrentUser
                ? "bg-blue-500 text-white rounded-br-sm"
                : "bg-gray-100 text-gray-900 rounded-bl-sm"
            }`}
          >
            {message.imageUrl && message.imageUrl.trim() !== "" && (
              <div className="mb-2">
                <img
                  src={message.imageUrl}
                  alt="Message attachment"
                  className="rounded-lg object-cover max-w-[200px] max-h-[200px]"
                />
              </div>
            )}
            {message.text && (
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.text}
              </p>
            )}
          </div>

          {/* Timestamp and Read Status */}
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 px-1">
            <span>{formattedTime}</span>
            {isCurrentUser && (
              <span className="flex items-center">
                {messagesRead ? (
                  <CheckCheck className="w-3 h-3 text-blue-500" />
                ) : (
                  <Check className="w-3 h-3 text-gray-400" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
