"use client";

import { IMessageListData } from "@/app/features/messaging/types/message.types";
import { Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import ConversationItem from "./ConversationItem";

interface ConversationListProps {
  conversations: IMessageListData[];
  activeUserId: string | null;
  onSelectConversation: (userId: string) => void;
}

export default function ConversationList({
  conversations,
  activeUserId,
  onSelectConversation,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = useMemo(
    () =>
      conversations.filter((conv) =>
        conv.otherUserName.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [conversations, searchQuery],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="mb-3 text-xl font-bold text-gray-900">Messages</h2>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center">
            <p className="mb-2 text-gray-500">No conversations found</p>
            <p className="text-sm text-gray-400">
              {searchQuery
                ? "Try a different search term"
                : "Start a new conversation"}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.otherUserId}
              conversation={conversation}
              isActive={conversation.otherUserId === activeUserId}
              onClick={() => onSelectConversation(conversation.otherUserId)}
            />
          ))
        )}
      </div>
    </div>
  );
}
