"use client";

import { Bell, MessageCircle, CheckCheck, Trash2 } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import type { NotificationTab } from "../types";
import NavbarNotificationItem from "./NavbarNotificationItem";
import { NotificationSkeleton } from "./NavbarSkeletons";
import type { NotificationModel } from "../../notification/types/notification.model";
import type { IMessageData } from "@/app/features/messaging/types/message.types";

interface NavbarNotificationListProps {
  activeTab: NotificationTab;
  onTabChange: (tab: NotificationTab) => void;
  appUnread: number;
  unreadChatCount: number;
  loading: boolean;
  notifications: NotificationModel[];
  chatNotifications: IMessageData[];
  deletingId: string | null;
  hasNotifications: boolean;
  hasChatNotifications: boolean;
  onReadOne: (n: NotificationModel) => void;
  onDeleteOne: (e: React.MouseEvent, id: string) => void;
  onReadAll: () => void;
  onDeleteAll: () => void;
  onChatClick: (chat: IMessageData) => void;
}

const TABS: { id: NotificationTab; label: string }[] = [
  { id: "app", label: "Activity" },
  { id: "chat", label: "Messages" },
];

export default function NavbarNotificationList({
  activeTab,
  onTabChange,
  appUnread,
  unreadChatCount,
  loading,
  notifications,
  chatNotifications,
  deletingId,
  hasNotifications,
  hasChatNotifications,
  onReadOne,
  onDeleteOne,
  onReadAll,
  onDeleteAll,
  onChatClick,
}: NavbarNotificationListProps) {
  const counts: Record<NotificationTab, number> = {
    app: appUnread,
    chat: unreadChatCount,
  };

  return (
    <>
      {/* Tab bar */}
      <div className="flex shrink-0 border-b border-gray-100">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary border-b-2"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {counts[tab.id] > 0 && (
              <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "app" && (
          <>
            {loading ? (
              <NotificationSkeleton />
            ) : !hasNotifications ? (
              <EmptyState icon={Bell} title="No notifications yet" description="We'll let you know when something happens" />
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((n) => (
                  <NavbarNotificationItem
                    key={n.id}
                    notification={n}
                    isDeleting={deletingId === n.id}
                    onClick={onReadOne}
                    onDelete={onDeleteOne}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "chat" && (
          <>
            {!hasChatNotifications ? (
              <EmptyState icon={MessageCircle} title="No new messages" description="Your inbox is empty" />
            ) : (
              <div className="divide-y divide-gray-100">
                {chatNotifications.slice(0, 10).map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => onChatClick(chat)}
                    className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 ${
                      !chat.isMine ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <div className="relative shrink-0">
                      {chat.senderAvatarUrl ? (
                        <Image
                          src={chat.senderAvatarUrl}
                          alt={chat.senderName}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-500 font-semibold text-white">
                          {chat.senderName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute -right-0.5 -bottom-0.5 rounded-full bg-white p-0.5">
                        <MessageCircle className="h-3 w-3 text-blue-500" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {chat.senderName}
                        </p>
                        <span className="shrink-0 text-xs text-gray-400">
                          {formatDistanceToNow(new Date(chat.sentAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="truncate text-xs text-gray-500">Sent you a message</p>
                    </div>
                    {!chat.isMine && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="p-10 text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-7 w-7 text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-900">{title}</p>
      <p className="mt-1 text-xs text-gray-400">{description}</p>
    </div>
  );
}
