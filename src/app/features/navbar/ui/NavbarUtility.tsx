"use client";

import { useNotificationContext } from "@/app/features/notification/context/NotificationContext";
import { useUserData } from "@/app/features/navbar/context/UserDataContext";
import { IMessageData } from "@/app/features/messaging/types/message.types";
import { INotificationData } from "@/app/features/notification/types/notification.types";
import {
  NavbarLoginButton,
  NavbarUserMenu,
} from "@/app/features/navbar/ui/NavbarAuthControls";

import { getClientAccessToken } from "@/app/shared/utils/AuthUtils/clientTokenUtils";
import * as signalR from "@microsoft/signalr";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Calendar,
  CheckCheck,
  Heart,
  MessageCircle,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  deleteAllNotification,
  deleteNotificationById,
  getNotification,
  getUnreadNotificationCount,
  readAllNotification,
  readNotificationById,
} from "@/app/shared/utils/API/NotificationAPI";

export default function NavbarUtility() {
  const { user } = useUserData();

  return (
    <div className="flex shrink-0 items-center gap-2 md:gap-3">
      {user && <NotificationBell />}
      {user ? <NavbarUserMenu /> : <NavbarLoginButton />}
    </div>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────────

type NotifType = keyof INotificationData["notificationType"] extends never
  ? string
  : string;

const getNotifIcon = (type: NotifType) => {
  const t = String(type);
  if (t.includes("Like"))
    return <Heart className="h-3.5 w-3.5 text-pink-500" />;
  if (t.includes("Comment") || t.includes("Replied"))
    return <MessageSquare className="h-3.5 w-3.5 text-blue-500" />;
  if (t.includes("Appointment"))
    return <Calendar className="h-3.5 w-3.5 text-green-500" />;
  if (t.includes("Kyc"))
    return <ShieldCheck className="h-3.5 w-3.5 text-purple-500" />;
  return <Bell className="h-3.5 w-3.5 text-gray-400" />;
};

const getNotifLink = (n: INotificationData): string | null => {
  const t = String(n.notificationType);
  if (
    (t.includes("Comment") || t.includes("Like") || t.includes("Post")) &&
    n.postId
  )
    return `/post/${n.postId}`;
  if (t.includes("Appointment") && n.appointmentId) return null; // handled per role
  return null;
};

// ─── NotificationBell ─────────────────────────────────────────────────────────

export const NotificationBell = () => {
  const [token, setToken] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"app" | "chat">("app");
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ── app notifications ──
  const [notifications, setNotifications] = useState<INotificationData[]>([]);
  const [unreadAppCount, setUnreadAppCount] = useState(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── chat notifications (SignalR) ──
  const {
    addChatNotification,
    unreadChatCount,
    chatNotifications,
    markChatAsRead,
  } = useNotificationContext();

  const totalUnreadCount = unreadChatCount + unreadAppCount;

  // ── fetch app notifications ───────────────────────────────────────────────

  const fetchNotifications = useCallback(async () => {
    setLoadingNotifs(true);
    try {
      const res = await getNotification(null, 20);
      const items: INotificationData[] = res?.data?.items ?? res?.data ?? [];
      setNotifications(items);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoadingNotifs(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await getUnreadNotificationCount();
      setUnreadAppCount(res?.data ?? 0);
    } catch {
      // silent
    }
  }, []);

  // fetch on mount + every 60 s
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    const id = setInterval(() => fetchUnreadCount(), 60_000);
    return () => clearInterval(id);
  }, [fetchNotifications, fetchUnreadCount]);

  // refetch when dropdown opens
  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen, fetchNotifications]);

  // ── actions ──────────────────────────────────────────────────────────────

  const handleNotifClick = async (n: INotificationData) => {
    if (!n.isRead) {
      try {
        await readNotificationById(n.id);
        setNotifications((prev) =>
          prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)),
        );
        setUnreadAppCount((c) => Math.max(0, c - 1));
      } catch {}
    }
    const link = getNotifLink(n);
    if (link) {
      setIsOpen(false);
      router.push(link);
    }
  };

  const handleDeleteOne = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await deleteNotificationById(id);
      setNotifications((prev) => prev.filter((x) => x.id !== id));
    } catch {}
    setDeletingId(null);
  };

  const handleReadAll = async () => {
    try {
      await readAllNotification();
      setNotifications((prev) => prev.map((x) => ({ ...x, isRead: true })));
      setUnreadAppCount(0);
    } catch {}
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotification();
      setNotifications([]);
      setUnreadAppCount(0);
    } catch {}
  };

  // ── chat handlers ─────────────────────────────────────────────────────────

  const handleChatClick = (chat: IMessageData) => {
    markChatAsRead(chat.id);
    setIsOpen(false);
    window.location.href = `/messages?userId=${chat.senderId}`;
  };

  // ── token + SignalR ──────────────────────────────────────────────────────

  useEffect(() => {
    const fetchToken = async () => {
      const accessToken = await getClientAccessToken();
      setToken(accessToken);
    };
    fetchToken();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!token) return;

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_Backend_URL}/hubs/notification`, {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    conn
      .start()
      .catch((err) =>
        console.error("Error connecting to Notification Hub:", err),
      );

    conn.on("MessageReceived", (data: IMessageData) => {
      addChatNotification(data);
    });

    // listen for real-time app notifications
    conn.on("NotificationReceived", (data: INotificationData) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadAppCount((c) => c + 1);
    });

    connectionRef.current = conn;
    return () => {
      conn.stop();
    };
  }, [token, addChatNotification]);

  // ── render ────────────────────────────────────────────────────────────────

  const appUnread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2.5 text-gray-600 transition-all hover:scale-105 hover:bg-gray-100 hover:text-gray-900 active:scale-95"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {totalUnreadCount > 0 && (
          <>
            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg">
              {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
            </span>
            <span className="absolute top-1 right-1 h-5 w-5 animate-ping rounded-full bg-red-500 opacity-75" />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 flex max-h-128 w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl sm:w-96">
          {/* header */}
          <div className="shrink-0 border-b border-gray-200 bg-linear-to-r from-blue-50 to-purple-50 p-4">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {notifications.length > 0 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleReadAll}
                    title="Mark all as read"
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-blue-600"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAll}
                    title="Clear all"
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {totalUnreadCount > 0
                ? `${totalUnreadCount} unread`
                : "You're all caught up!"}
            </p>
          </div>

          {/* tabs */}
          <div className="flex shrink-0 border-b border-gray-100">
            {(
              [
                { id: "app" as const, label: "Activity", count: appUnread },
                {
                  id: "chat" as const,
                  label: "Messages",
                  count: unreadChatCount,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600 border-b-2"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* content */}
          <div className="flex-1 overflow-y-auto">
            {/* ── activity tab ── */}
            {activeTab === "app" && (
              <>
                {loadingNotifs ? (
                  <div className="flex items-center justify-center py-12 text-gray-400">
                    <RotateCcw className="mr-2 h-5 w-5 animate-spin" />
                    <span className="text-sm">Loading…</span>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                      <Bell className="h-7 w-7 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      No notifications yet
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      We&apos;ll let you know when something happens
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotifClick(n)}
                        className={`group flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 ${
                          !n.isRead ? "bg-blue-50/40" : ""
                        }`}
                      >
                        {/* icon badge */}
                        <div className="relative mt-0.5 shrink-0">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                            {getNotifIcon(String(n.notificationType))}
                          </div>
                          {!n.isRead && (
                            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white" />
                          )}
                        </div>

                        {/* text */}
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm text-gray-800">
                            {n.title}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-400">
                            {formatDistanceToNow(new Date(n.sentAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>

                        {/* delete */}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteOne(e, n.id)}
                          disabled={deletingId === n.id}
                          className="ml-1 shrink-0 rounded-lg p-1 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                        >
                          {deletingId === n.id ? (
                            <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── chat tab ── */}
            {activeTab === "chat" && (
              <>
                {chatNotifications.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                      <MessageCircle className="h-7 w-7 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      No new messages
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Your inbox is empty
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {chatNotifications.slice(0, 10).map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleChatClick(chat)}
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
                              {formatDistanceToNow(new Date(chat.sentAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <p className="truncate text-xs text-gray-500">
                            Sent you a message
                          </p>
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
        </div>
      )}
    </div>
  );
};
