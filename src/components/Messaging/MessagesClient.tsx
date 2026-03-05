"use client"

import { IMessageData, IMessageDetailData } from "@/types/message.types"
import {
	getConversationsByConversationId,
	readMessagesByConversationId,
} from "@/utils/API/MessageAPI"
import * as signalR from "@microsoft/signalr"
import { useCallback, useEffect, useRef, useState } from "react"
import ChatWindow from "./ChatWindow"

interface MessagesClientProps {
	userId?: string
	messages: IMessageDetailData<IMessageData[]>
	access_token: string
}

export default function MessagesClient({
	userId,
	messages,
	access_token,
}: MessagesClientProps) {
	const [messageList, setMessageList] = useState<IMessageData[]>(
		messages.messages || [],
	)
	const [conversationId] = useState<string>(messages.conversationId)
	// true = the other user has read our messages (shown as blue double-check)
	const [messagesRead, setMessagesRead] = useState(false)
	const [loading, setLoading] = useState(false)

	const isFetchingRef = useRef(false)
	const connRef = useRef<signalR.HubConnection | null>(null)
	// Always up-to-date last message id without causing useEffect re-runs
	const lastMessageIdRef = useRef<string | null>(
		messages.messages?.at(-1)?.id ?? null,
	)
	// Prevent firing readMessages REST call more than once per new batch
	const readCalledRef = useRef(false)

	const otherUser = userId
		? {
				id: messages.otherUserId,
				name: messages.otherUserName || "User",
				avatarUrl: messages.otherUserAvatarUrl,
			}
		: null

	// Keep lastMessageIdRef in sync whenever messageList changes
	useEffect(() => {
		const last = messageList.at(-1)?.id ?? null
		lastMessageIdRef.current = last
		// When new messages arrive, reset so the read receipt fires again
		readCalledRef.current = false
	}, [messageList])

	const fetchMessages = useCallback(
		async (showLoading = true) => {
			if (!conversationId || isFetchingRef.current) {
				if (!conversationId) setMessageList([])
				return
			}
			try {
				isFetchingRef.current = true
				if (showLoading) setLoading(true)
				const data = await getConversationsByConversationId(conversationId)
				const messageData: IMessageData[] = data?.data?.messages ?? []
				setMessageList(messageData)
			} catch (error) {
				console.error("Failed to fetch messages:", error)
			} finally {
				isFetchingRef.current = false
				if (showLoading) setLoading(false)
			}
		},
		[conversationId],
	)

	// ── SignalR hub connection ──────────────────────────────────────────────────
	useEffect(() => {
		const conn = new signalR.HubConnectionBuilder()
			.withUrl("http://localhost:5255/hubs/chat", {
				accessTokenFactory: () => access_token,
				skipNegotiation: true,
				transport: signalR.HttpTransportType.WebSockets,
			})
			.withAutomaticReconnect()
			.configureLogging(signalR.LogLevel.Warning)
			.build()

		connRef.current = conn

		const joinGroups = async () => {
			try {
				await conn.start()
			} catch (err) {
				console.error("SignalR connection error:", err)
				return
			}
			if (conn.state !== signalR.HubConnectionState.Connected) return
			try {
				await conn.invoke("JoinConversation", conversationId)
				// Mark initial messages as read on join
				if (lastMessageIdRef.current) {
					await conn.invoke(
						"MarkMessagesAsRead",
						conversationId,
						lastMessageIdRef.current,
					)
				}
			} catch (err) {
				console.error("JoinConversation error:", err)
			}
		}

		joinGroups()

		// New message: append, mark isMine correctly based on userId
		conn.on("MessageReceived", (message: IMessageData) => {
			if (message.conversationId !== conversationId) return
			setMessageList((prev) => {
				// Guard against duplicate delivery (same id)
				if (prev.some((m) => m.id === message.id)) return prev
				const enriched: IMessageData = {
					...message,
					isMine: message.senderId === userId,
				}
				return [...prev, enriched]
			})
		})

		// Other user read our messages → show blue double-check
		conn.on("MessagesRead", (readerId: string) => {
			if (readerId !== userId) {
				setMessagesRead(true)
			}
		})

		conn.on("MessageEdited", (message: IMessageData) => {
			if (message.conversationId !== conversationId) return
			setMessageList((prev) =>
				prev.map((msg) =>
					msg.id === message.id ? { ...message, isMine: msg.isMine } : msg,
				),
			)
		})

		conn.on("MessageDeleted", (messageId: string) => {
			setMessageList((prev) => prev.filter((msg) => msg.id !== messageId))
		})

		return () => {
			conn.off("MessageReceived")
			conn.off("MessagesRead")
			conn.off("MessageEdited")
			conn.off("MessageDeleted")
			// Leave conversation gracefully before stopping
			if (conn.state === signalR.HubConnectionState.Connected) {
				conn.invoke("LeaveConversation", conversationId).catch(() => {})
			}
			conn.stop()
			connRef.current = null
		}
	}, [access_token, conversationId, userId])

	// Initial fetch on mount
	useEffect(() => {
		fetchMessages()
	}, [fetchMessages])

	// ── Handlers ───────────────────────────────────────────────────────────────

	// Called by ChatWindow/MessageInput after addMessage REST call succeeds.
	// SignalR MessageReceived already delivers the message to both sides,
	// so we just need to reset the messagesRead indicator for the new message.
	const handleSendMessage = useCallback(async () => {
		setMessagesRead(false)
	}, [])

	// Called when the current user views incoming messages
	const handleReadMessage = useCallback(async () => {
		if (!conversationId || readCalledRef.current) return
		readCalledRef.current = true
		try {
			await readMessagesByConversationId(conversationId)
			const conn = connRef.current
			if (
				conn?.state === signalR.HubConnectionState.Connected &&
				lastMessageIdRef.current
			) {
				await conn.invoke(
					"MarkMessagesAsRead",
					conversationId,
					lastMessageIdRef.current,
				)
			}
		} catch (error) {
			console.error("Failed to mark messages as read:", error)
		}
	}, [conversationId])

	return (
		<div className="flex h-screen w-full flex-col bg-gray-50 sm:flex-row">
			<ChatWindow
				messages={messageList}
				currentUserId={userId ?? ""}
				otherUserId={otherUser}
				onSendMessage={handleSendMessage}
				onReadMessage={handleReadMessage}
				messagesRead={messagesRead}
				loading={loading}
			/>
		</div>
	)
}
