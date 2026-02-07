"use client";

import { IMessageData } from "@/app/types/message.types";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

interface ChatWindowProps {
  messages: IMessageData[];
  currentUserId: string;
  otherUserId: {
    id: string;
    name: string;
    avatarUrl?: string;
  } | null;
  onSendMessage: (text: string) => void;
  onReadMessage: () => void;
  messagesRead: boolean;
  loading?: boolean;
}

export default function ChatWindow({
  messages,
  currentUserId,
  otherUserId,
  onSendMessage,
  onReadMessage,
  messagesRead,
  loading = false,
}: ChatWindowProps) {
  console.log("otherUser:: ", otherUserId);
  if (!otherUserId) {
    return <div>User id is not provide</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          {otherUserId.avatarUrl ? (
            <Image
              src={otherUserId.avatarUrl}
              alt={otherUserId.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
              {otherUserId.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{otherUserId.name}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        onReadMessage={onReadMessage}
        messagesRead={messagesRead}
      />

      {/* Input */}
      <MessageInput
        receiverId={otherUserId.id}
        onSendMessage={onSendMessage}
        disabled={loading}
      />
    </div>
  );
}
