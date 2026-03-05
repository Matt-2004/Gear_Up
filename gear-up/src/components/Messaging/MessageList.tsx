"use client"

import { IMessageData } from "@/types/message.types"
import { memo, useEffect, useRef } from "react"
import MessageBubble from "./MessageBubble"

interface MessageListProps {
	messages: IMessageData[]
	currentUserId: string
	onReadMessage: () => void
	messagesRead: boolean
}

const MessageList = memo(function MessageList({
	messages,
	currentUserId,
	onReadMessage,
	messagesRead,
}: MessageListProps) {
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const prevMessagesLengthRef = useRef(messages.length)
	const hasTriggeredReadRef = useRef(false)

	const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
		messagesEndRef.current?.scrollIntoView({ behavior })
	}

	// Scroll to bottom on initial mount (instant) and on new messages (smooth)
	useEffect(() => {
		if (prevMessagesLengthRef.current === 0 && messages.length > 0) {
			scrollToBottom("instant")
		} else if (messages.length > prevMessagesLengthRef.current) {
			scrollToBottom("smooth")
		}
		prevMessagesLengthRef.current = messages.length
	}, [messages.length])

	// Fire onReadMessage once whenever there are messages from the other user
	useEffect(() => {
		if (hasTriggeredReadRef.current) return
		const hasOtherMessages = messages.some((m) => !m.isMine)
		if (hasOtherMessages) {
			hasTriggeredReadRef.current = true
			onReadMessage()
		}
		// Re-run when new messages arrive so new batches get marked read
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messages.length])

	return (
		<div className="flex-1 space-y-2 overflow-y-auto p-4">
			{messages.length === 0 ? (
				<div className="flex h-full items-center justify-center">
					<p className="text-gray-500">
						No messages yet. Start the conversation!
					</p>
				</div>
			) : (
				<>
					{messages.map((message) => (
						<MessageBubble
							key={message.id}
							message={message}
							isCurrentUser={message.senderId === currentUserId}
							onReadMessage={onReadMessage}
							messagesRead={messagesRead}
						/>
					))}
					<div ref={messagesEndRef} />
				</>
			)}
		</div>
	)
})

export default MessageList
