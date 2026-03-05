"use client"

import { IMessageData } from "@/types/message.types"
import { MoreVertical } from "lucide-react"
import Image from "next/image"
import { memo } from "react"
import MessageInput from "./MessageInput"
import MessageList from "./MessageList"

interface ChatWindowProps {
	messages: IMessageData[]
	currentUserId: string
	otherUserId: {
		id: string
		name: string
		avatarUrl?: string
	} | null
	onSendMessage: (text: string) => void
	onReadMessage: () => void
	messagesRead: boolean
	loading?: boolean
}

const ChatWindow = memo(function ChatWindow({
	messages,
	currentUserId,
	otherUserId,
	onSendMessage,
	onReadMessage,
	messagesRead,
	loading = false,
}: ChatWindowProps) {
	if (!otherUserId) {
		return <div>User id is not provide</div>
	}

	return (
		<div className="flex h-full w-full flex-col bg-white">
			{/* Chat Header */}
			<div className="flex items-center justify-between border-b border-gray-200 bg-white p-4">
				<div className="flex items-center gap-3">
					{otherUserId.avatarUrl ? (
						<Image
							src={otherUserId.avatarUrl}
							alt={otherUserId.name}
							width={40}
							height={40}
							className="rounded-full object-cover"
						/>
					) : (
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 font-semibold text-white">
							{otherUserId.name.charAt(0).toUpperCase()}
						</div>
					)}
					<div>
						<h3 className="font-semibold text-gray-900">{otherUserId.name}</h3>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<button className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100">
						<MoreVertical className="h-5 w-5" />
					</button>
				</div>
			</div>

			{/* Messages */}
			<MessageList
				messages={messages}
				currentUserId={currentUserId}
				onReadMessage={onReadMessage}
				messagesRead={messagesRead}
			/>

			{/* Input */}
			<MessageInput
				receiverId={otherUserId.id}
				onSendMessage={onSendMessage}
				disabled={loading}
			/>
		</div>
	)
})

export default ChatWindow
