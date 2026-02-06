"use client"

import { IConversation, IMessage } from "@/app/types/message.types"
import ChatWindow from "@/components/Messaging/ChatWindow"
import ConversationList from "@/components/Messaging/ConversationList"
import {
    addMessage,
    getConversations,
    getConversationsByConversationId,
    readMessagesByConversationId,
} from "@/utils/API/MessageAPI"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function MessagesPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [conversations, setConversations] = useState<IConversation[]>([])
    const [activeUserId, setActiveUserId] = useState<string | null>(null)
    const [messages, setMessages] = useState<IMessage[]>([])
    const [loading, setLoading] = useState(false)
    const [conversationsLoading, setConversationsLoading] = useState(true)

    // Fetch conversations
    useEffect(() => {
        if (status === "authenticated") {
            fetchConversations()
        }
    }, [status])

    // Handle userId query parameter
    useEffect(() => {
        const userId = searchParams.get("userId")
        if (userId && conversations.length > 0) {
            setActiveUserId(userId)
        }
    }, [searchParams, conversations])

    // Fetch messages when active user changes
    useEffect(() => {
        if (activeUserId) {
            fetchMessages(activeUserId)
            markMessagesAsRead(activeUserId)
        }
    }, [activeUserId])

    const fetchConversations = async () => {
        try {
            setConversationsLoading(true)
            const data = await getConversations()

            if (data.isSuccess) {
                setConversations(data.data)
            }
        } catch (error) {
            console.error("Failed to fetch conversations:", error)
        } finally {
            setConversationsLoading(false)
        }
    }

    const fetchMessages = async (userId: string) => {
        try {
            setLoading(true)
            const data = await getConversationsByConversationId(userId)

            if (data.isSuccess) {
                setMessages(data.data)
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error)
        } finally {
            setLoading(false)
        }
    }

    const markMessagesAsRead = async (userId: string) => {
        try {
            await readMessagesByConversationId(userId)
            // Update unread count in conversations
            setConversations((prev) =>
                prev.map((conv) =>
                    conv.userId === userId ? { ...conv, unreadCount: 0 } : conv
                )
            )
        } catch (error) {
            console.error("Failed to mark messages as read:", error)
        }
    }

    const handleSendMessage = async (text: string) => {
        if (!activeUserId) return

        try {
            setLoading(true)
            const data = await addMessage({
                receiverId: activeUserId,
                text,
            })
            setConversations((prev) =>
                prev.map((conv) =>
                    conv.userId === activeUserId
                        ? { ...conv, lastMessage: data.data }
                        : conv
                )
            )
        }
        catch (error) {
            console.error("Failed to send message:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectConversation = (userId: string) => {
        setActiveUserId(userId)
    }

    if (status === "loading" || conversationsLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (status === "unauthenticated") {
        return null
    }

    const activeConversation = conversations.find(
        (conv) => conv.userId === activeUserId
    )

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Conversations Sidebar */}
            <div className="w-full md:w-96 flex-shrink-0">
                <ConversationList
                    conversations={conversations}
                    activeUserId={activeUserId}
                    onSelectConversation={handleSelectConversation}
                />
            </div>

            {/* Chat Window */}
            <div className="flex-1 hidden md:flex">
                <ChatWindow
                    messages={messages}
                    currentUserId={session?.user?.id || ""}
                    recipientUser={
                        activeConversation
                            ? activeConversation.user
                            : null
                    }
                    onSendMessage={handleSendMessage}
                    loading={loading}
                />
            </div>

            {/* Mobile Chat Window */}
            {activeUserId && (
                <div className="fixed inset-0 bg-white z-50 md:hidden">
                    <button
                        onClick={() => setActiveUserId(null)}
                        className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-lg"
                    >
                        ← Back
                    </button>
                    <ChatWindow
                        messages={messages}
                        currentUserId={session?.user?.id || ""}
                        recipientUser={
                            activeConversation
                                ? activeConversation.user
                                : null
                        }
                        onSendMessage={handleSendMessage}
                        loading={loading}
                    />
                </div>
            )}
        </div>
    )
}
