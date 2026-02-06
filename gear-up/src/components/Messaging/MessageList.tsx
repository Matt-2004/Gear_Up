"use client"

import { IMessage } from "@/app/types/message.types"
import { useEffect, useRef } from "react"
import MessageBubble from "./MessageBubble"

interface MessageListProps {
    messages: IMessage[]
    currentUserId: string
}

export default function MessageList({
    messages,
    currentUserId,
}: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                </div>
            ) : (
                <>
                    {messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isCurrentUser={message.senderId === currentUserId}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </>
            )}
        </div>
    )
}
