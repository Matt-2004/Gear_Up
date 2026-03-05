"use client"

import { IMessageListData } from "@/types/message.types"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { memo, useMemo } from "react"

interface ConversationItemProps {
	conversation: IMessageListData
	isActive: boolean
	onClick: () => void
}

const ConversationItem = memo(function ConversationItem({
	conversation,
	isActive,
	onClick,
}: ConversationItemProps) {
	const {
		otherUserName,
		otherUserAvatarUrl,
		lastMessageText,
		lastMessageAt,
		unreadCount,
	} = conversation

	const timeAgo = useMemo(
		() =>
			formatDistanceToNow(new Date(lastMessageAt), {
				addSuffix: true,
			}),
		[lastMessageAt],
	)

	return (
		<div
			onClick={onClick}
			className={`flex cursor-pointer items-start gap-3 border-b border-gray-100 p-4 transition-colors hover:bg-gray-50 ${
				isActive ? "bg-blue-50 hover:bg-blue-50" : ""
			}`}
		>
			<div className="relative flex-shrink-0">
				{otherUserAvatarUrl ? (
					<Image
						src={otherUserAvatarUrl}
						alt={otherUserName}
						width={48}
						height={48}
						className="rounded-full object-cover"
					/>
				) : (
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-semibold text-white">
						{otherUserName.charAt(0).toUpperCase()}
					</div>
				)}
				{unreadCount > 0 && (
					<div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
						{unreadCount > 9 ? "9+" : unreadCount}
					</div>
				)}
			</div>

			<div className="min-w-0 flex-1">
				<div className="mb-1 flex items-center justify-between gap-2">
					<h3 className="truncate font-semibold text-gray-900">
						{otherUserName}
					</h3>
					<span className="flex-shrink-0 text-xs text-gray-500">{timeAgo}</span>
				</div>
				<p className="truncate text-sm text-gray-600">
					{lastMessageText || "Image"}
				</p>
			</div>
		</div>
	)
})

export default ConversationItem
