"use client"

import { IMessage } from "@/app/types/message.types"
import { format, isToday, isYesterday } from "date-fns"
import Image from "next/image"

interface MessageBubbleProps {
    message: IMessage
    isCurrentUser: boolean
}

export default function MessageBubble({
    message,
    isCurrentUser,
}: MessageBubbleProps) {
    const formatMessageTime = (date: string) => {
        const messageDate = new Date(date)
        if (isToday(messageDate)) {
            return format(messageDate, "h:mm a")
        } else if (isYesterday(messageDate)) {
            return `Yesterday ${format(messageDate, "h:mm a")}`
        } else {
            return format(messageDate, "MMM d, h:mm a")
        }
    }

    return (
        <div
            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
        >
            <div
                className={`flex gap-2 max-w-[70%] ${isCurrentUser ? "flex-row-reverse" : "flex-row"
                    }`}
            >
                {/* Avatar */}
                {!isCurrentUser && message.sender && (
                    <div className="flex-shrink-0">
                        {message.sender.avatarUrl ? (
                            <Image
                                src={message.sender.avatarUrl}
                                alt={message.sender.name}
                                width={32}
                                height={32}
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                                {message.sender.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                )}

                {/* Message Content */}
                <div
                    className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"
                        }`}
                >
                    {/* Message Bubble */}
                    <div
                        className={`px-4 py-2 rounded-2xl ${isCurrentUser
                                ? "bg-blue-500 text-white rounded-br-sm"
                                : "bg-gray-100 text-gray-900 rounded-bl-sm"
                            }`}
                    >
                        {message.text && (
                            <p className="text-sm whitespace-pre-wrap break-words">
                                {message.text}
                            </p>
                        )}

                        {message.imageUrls && message.imageUrls.length > 0 && (
                            <div className="mt-2 space-y-2">
                                {message.imageUrls.map((url, index) => (
                                    <Image
                                        key={index}
                                        src={url}
                                        alt={`Message image ${index + 1}`}
                                        width={300}
                                        height={200}
                                        className="rounded-lg object-cover"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Timestamp */}
                    <span className="text-xs text-gray-500 mt-1 px-1">
                        {formatMessageTime(message.createdAt)}
                        {isCurrentUser && message.isRead && (
                            <span className="ml-1 text-blue-500">✓✓</span>
                        )}
                    </span>
                </div>
            </div>
        </div>
    )
}
