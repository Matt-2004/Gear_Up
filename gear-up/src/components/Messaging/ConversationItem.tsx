"use client";

import { IMessageListData } from "@/app/types/message.types";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { memo, useMemo } from "react";

interface ConversationItemProps {
  conversation: IMessageListData;
  isActive: boolean;
  onClick: () => void;
}

const ConversationItem = memo(function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  const {
    otherUserName,
    otherUserAvatarUrl,
    lastMessageText,
    lastMessageAt,
    unreadCount,
  } = conversation;

  const timeAgo = useMemo(
    () =>
      formatDistanceToNow(new Date(lastMessageAt), {
        addSuffix: true,
      }),
    [lastMessageAt],
  );

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
        isActive ? "bg-blue-50 hover:bg-blue-50" : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        {otherUserAvatarUrl ? (
          <Image
            src={otherUserAvatarUrl}
            alt={otherUserName}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
            {otherUserName.charAt(0).toUpperCase()}
          </div>
        )}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 truncate">
            {otherUserName}
          </h3>
          <span className="text-xs text-gray-500 flex-shrink-0">{timeAgo}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">
          {lastMessageText || "Image"}
        </p>
      </div>
    </div>
  );
});

export default ConversationItem;
