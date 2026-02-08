"use client";

import { IMessageListData } from "@/app/types/message.types";
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
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-gray-500 mb-2">No conversations found</p>
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
