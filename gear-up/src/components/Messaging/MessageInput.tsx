"use client"

import { addMessage } from "@/utils/API/MessageAPI"
import { Image as ImageIcon, Send } from "lucide-react"
import { KeyboardEvent, useState } from "react"

interface MessageInputProps {
    receiverId: string
    onSendMessage?: (text: string) => void
    disabled?: boolean
}

export default function MessageInput({
    receiverId,
    onSendMessage,
    disabled = false,
}: MessageInputProps) {
    const [message, setMessage] = useState("")
    const [sending, setSending] = useState(false)

    const handleSend = async () => {
        const text = message.trim()
        if (!text || disabled || sending || !receiverId) return

        try {
            setSending(true)
            await addMessage({ receiverId, text })
            onSendMessage?.(text)
            setMessage("")
        } catch (error) {
            console.error("Failed to send message:", error)
        } finally {
            setSending(false)
        }
    }

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex items-end gap-2">
                <button
                    className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={disabled}
                >
                    <ImageIcon className="w-5 h-5" />
                </button>

                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    disabled={disabled || sending || !receiverId}
                    rows={1}
                    className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    style={{
                        minHeight: "40px",
                        maxHeight: "128px",
                    }}
                />

                <button
                    onClick={handleSend}
                    disabled={!message.trim() || disabled || sending || !receiverId}
                    className="flex-shrink-0 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
