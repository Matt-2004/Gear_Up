"use client"

import { IConversation } from "@/app/types/message.types"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"

interface ConversationItemProps {
    conversation: IConversation
    isActive: boolean
    onClick: () => void
}

export default function ConversationItem({
    conversation,
    isActive,
    onClick,
}: ConversationItemProps) {
    const { user, lastMessage, unreadCount } = conversation

    return (
        <div
            onClick={onClick}
            className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${isActive ? "bg-blue-50 hover:bg-blue-50" : ""
                }`}
        >
            <div className="relative flex-shrink-0">
                {user.avatarUrl ? (
                    <Image
                        src={user.avatarUrl}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                        {user.name.charAt(0).toUpperCase()}
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
                        {user.name}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatDistanceToNow(new Date(lastMessage.createdAt), {
                            addSuffix: true,
                        })}
                    </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                    {lastMessage.text || "Image"}
                </p>
            </div>
        </div>
    )
}
