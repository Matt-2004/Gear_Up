"use client"

import { IMessage } from "@/app/types/message.types"
import { MoreVertical, Phone, Video } from "lucide-react"
import Image from "next/image"
import MessageInput from "./MessageInput"
import MessageList from "./MessageList"

interface ChatWindowProps {
    messages: IMessage[]
    currentUserId: string
    recipientUser: {
        id: string
        name: string
        username: string
        avatarUrl?: string
    } | null
    onSendMessage: (text: string) => void
    loading?: boolean
}

export default function ChatWindow({
    messages,
    currentUserId,
    recipientUser,
    onSendMessage,
    loading = false,
}: ChatWindowProps) {
    if (!recipientUser) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Welcome to Messages
                    </h3>
                    <p className="text-gray-500">
                        Select a conversation to start messaging
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                    {recipientUser.avatarUrl ? (
                        <Image
                            src={recipientUser.avatarUrl}
                            alt={recipientUser.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {recipientUser.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {recipientUser.name}
                        </h3>
                        <p className="text-sm text-gray-500">@{recipientUser.username}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <MessageList messages={messages} currentUserId={currentUserId} />

            {/* Input */}
            <MessageInput onSendMessage={onSendMessage} disabled={loading} />
        </div>
    )
}
