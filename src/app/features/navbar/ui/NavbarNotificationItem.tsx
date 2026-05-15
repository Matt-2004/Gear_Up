"use client";

import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, Calendar, Bell, ShieldCheck, RotateCcw, X } from "lucide-react";
import type { NotificationModel } from "../../notification/types/notification.model";

interface NavbarNotificationItemProps {
  notification: NotificationModel;
  isDeleting: boolean;
  onClick: (n: NotificationModel) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

const getIcon = (type: string) => {
  if (type.includes("Like")) return <Heart className="h-3.5 w-3.5 text-pink-500" />;
  if (type.includes("Comment") || type.includes("Replied"))
    return <MessageSquare className="h-3.5 w-3.5 text-blue-500" />;
  if (type.includes("Appointment"))
    return <Calendar className="h-3.5 w-3.5 text-green-500" />;
  if (type.includes("Kyc"))
    return <ShieldCheck className="h-3.5 w-3.5 text-purple-500" />;
  return <Bell className="h-3.5 w-3.5 text-gray-400" />;
};

export default function NavbarNotificationItem({
  notification,
  isDeleting,
  onClick,
  onDelete,
}: NavbarNotificationItemProps) {
  return (
    <div
      onClick={() => onClick(notification)}
      className={`group flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 ${
        !notification.isRead ? "bg-blue-50/40" : ""
      }`}
    >
      <div className="relative mt-0.5 shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
          {getIcon(String(notification.notificationType))}
        </div>
        {!notification.isRead && (
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm text-gray-800">{notification.title}</p>
        <p className="mt-0.5 text-xs text-gray-400">
          {formatDistanceToNow(new Date(notification.sentAt), { addSuffix: true })}
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => onDelete(e, notification.id)}
        disabled={isDeleting}
        className="ml-1 shrink-0 rounded-lg p-1 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
      >
        {isDeleting ? (
          <RotateCcw className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <X className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
