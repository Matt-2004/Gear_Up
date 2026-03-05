"use client"

import { IMessageData } from "@/types/message.types"
import { format, isToday, isYesterday } from "date-fns"
import { Check, CheckCheck } from "lucide-react"
import Image from "next/image"
import { useMemo } from "react"

interface MessageBubbleProps {
	message: IMessageData
	isCurrentUser: boolean
	onReadMessage: () => void
	messagesRead: boolean
}

export default function MessageBubble({
	message,
	isCurrentUser,
	onReadMessage: _onReadMessage,
	messagesRead,
}: MessageBubbleProps) {
	const formattedTime = useMemo(() => {
		const messageDate = new Date(message.sentAt)
		if (isToday(messageDate)) {
			return format(messageDate, "h:mm a")
		} else if (isYesterday(messageDate)) {
			return `Yesterday ${format(messageDate, "h:mm a")}`
		} else {
			return format(messageDate, "MMM d, h:mm a")
		}
	}, [message.sentAt])

	return (
		<div
			className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
		>
			<div
				className={`flex max-w-[70%] gap-2 ${
					isCurrentUser ? "flex-row-reverse" : "flex-row"
				}`}
			>
				{/* Avatar */}
				{!isCurrentUser && (
					<div className="shrink-0">
						{message.senderAvatarUrl ? (
							<Image
								src={message.senderAvatarUrl}
								alt={message.senderName}
								width={32}
								height={32}
								className="rounded-full object-cover"
							/>
						) : (
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-500 text-sm font-semibold text-white">
								{message.senderName.charAt(0).toUpperCase()}
							</div>
						)}
					</div>
				)}

				{/* Message Content */}
				<div
					className={`flex flex-col ${
						isCurrentUser ? "items-end" : "items-start"
					}`}
				>
					{/* Message Bubble */}
					<div
						className={`rounded-2xl px-4 py-2 ${
							isCurrentUser
								? "rounded-br-sm bg-blue-500 text-white"
								: "rounded-bl-sm bg-gray-100 text-gray-900"
						}`}
					>
						{message.imageUrl && message.imageUrl.trim() !== "" && (
							<div className="mb-2">
								<img
									src={message.imageUrl}
									alt="Message attachment"
									className="max-h-50 max-w-50 rounded-lg object-cover"
								/>
							</div>
						)}
						{message.text && (
							<p className="text-sm wrap-break-word whitespace-pre-wrap">
								{message.text}
							</p>
						)}
					</div>

					{/* Timestamp and Read Status */}
					<div className="mt-1 flex items-center gap-1 px-1 text-xs text-gray-500">
						<span>{formattedTime}</span>
						{isCurrentUser && (
							<span className="flex items-center">
								{messagesRead ? (
									<CheckCheck className="h-3 w-3 text-blue-500" />
								) : (
									<Check className="h-3 w-3 text-gray-400" />
								)}
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
