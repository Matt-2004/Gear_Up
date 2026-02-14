"use client";

import { useNotificationContext } from "@/Context/NotificationContext";
import { useUserData } from "@/Context/UserDataContext";
import { IMessageData } from "@/app/types/message.types";
import { INotificationData } from "@/app/types/notification.types";
import { Login, SearchBar, User } from "@/components/Navbar/NavUtils";
import {
  getNotification,
  readAllNotification,
  readNotificationById,
} from "@/utils/API/NotificationAPI";
import * as signalR from "@microsoft/signalr";
import { formatDistanceToNow } from "date-fns";
import { Bell, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function NavbarUtility() {
  const { user } = useUserData();

  return (
    <div className="flex items-center gap-2 md:gap-3 shrink-0">
      <div className="hidden sm:flex items-center flex-1 max-w-md">
        <SearchBar />
      </div>

      {user && <NotificationBell />}
      {user ? <User /> : <Login />}
    </div>
  );
}

export const NotificationBell = () => {
  const { user } = useUserData();
  const [token, setToken] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    addChatNotification,
    addOtherNotification,
    unreadChatCount,
    unreadNotificationCount,
    chatNotifications,
    otherNotifications,
    setOtherNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    markChatAsRead,
  } = useNotificationContext();

  const totalUnreadCount = unreadChatCount + unreadNotificationCount;

  // Handle chat notification click - redirect to messages
  const handleChatClick = (chat: IMessageData) => {
    markChatAsRead(chat.id);
    setIsOpen(false);
    // Use window.location for full page reload to fetch fresh data
    window.location.href = `/messages?userId=${chat.senderId}`;
  };

  // Handle other notification click - redirect based on type
  const handleNotificationClick = async (notif: INotificationData) => {
    try {
      await readNotificationById(notif.id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }

    markNotificationAsRead(notif.id);
    setIsOpen(false);

    const notifType = notif.notificationType as unknown as number;
    const isDealer = user?.role === "Dealer";

    let targetUrl = "";

    // Appointment notifications (6, 7, 8)
    if (notifType === 6 || notifType === 7 || notifType === 8) {
      targetUrl = isDealer
        ? "/profile/dealer/appointments"
        : "/profile/user/appointments";
    }
    // Post related notifications (1, 2, 3, 4)
    else if (notif.postId && notif.postId.trim() !== "") {
      targetUrl = `/post/${notif.postId}`;
    }
    // Car related notifications
    else if (notif.carId && notif.carId.trim() !== "") {
      targetUrl = `/car/${notif.carId}`;
    }
    // KYC notifications (5)
    else if (notifType === 5) {
      targetUrl = isDealer ? "/profile/dealer" : "/profile/user";
    }

    // Use window.location for full page reload to fetch fresh data
    if (targetUrl) {
      window.location.href = targetUrl;
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await readAllNotification();
      markAllNotificationsAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch("/api/token/access_token_get");
      const data = await response.json();
      setToken(data.access_token);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotification(null, 20);
        const notifications =
          (response as { data?: INotificationData[] })?.data ??
          (Array.isArray(response) ? (response as INotificationData[]) : []);

        setOtherNotifications(notifications);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    fetchNotifications();
  }, [setOtherNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!token) return;

    const conn = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5255/hubs/notification", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    conn
      .start()
      .then(() => {
        console.log("Notification Hub Connected");
      })
      .catch((err) => {
        console.error("Error connecting to Notification Hub: ", err);
      });

    // Handle other notifications
    conn.on("NotificationCreated", (data: INotificationData) => {
      console.log("New Notification:", data);
      addOtherNotification(data);
    });

    // Handle message notifications
    conn.on("MessageReceived", (data: IMessageData) => {
      console.log("New message from notification hub: ", data);
      addChatNotification(data);
    });

    conn.onreconnected(() => {
      console.log("Reconnected to Notification Hub");
    });

    conn.onclose(() => {
      console.log("Disconnected from Notification Hub");
    });

    connectionRef.current = conn;

    return () => {
      conn.stop().then(() => console.log("Notification Hub Disconnected"));
    };
  }, [token, addChatNotification, addOtherNotification]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all hover:scale-105 active:scale-95"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {totalUnreadCount > 0 && (
          <>
            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg">
              {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
            </span>
            <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 animate-ping opacity-75"></span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-[28rem] overflow-hidden bg-white rounded-xl shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {totalUnreadCount > 0 ? (
                <>
                  {totalUnreadCount} unread notification
                  {totalUnreadCount !== 1 ? "s" : ""}
                </>
              ) : (
                "You're all caught up!"
              )}
            </p>
          </div>

          <div className="divide-y divide-gray-100 overflow-y-auto max-h-[24rem]">
            {/* Chat Notifications */}
            {chatNotifications.slice(0, 5).map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatClick(chat)}
                className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !chat.isMine ? "bg-blue-50/50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
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
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {chat.senderName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5">
                      <MessageCircle className="h-3 w-3 text-blue-500" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-0.5">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {chat.senderName}
                      </p>
                      <span className="text-xs text-gray-500 shrink-0">
                        {formatDistanceToNow(new Date(chat.sentAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">sent messages</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Other Notifications */}
            {otherNotifications.slice(0, 5).map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notif.isRead ? "bg-orange-50/50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-0.5">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notif.title}
                      </p>
                      <span className="text-xs text-gray-500 shrink-0">
                        {formatDistanceToNow(new Date(notif.sentAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {totalUnreadCount === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  No new notifications
                </p>
                <p className="text-xs text-gray-500">
                  We'll notify you when something arrives
                </p>
              </div>
            )}
          </div>

          {/* View All Footer */}
          {totalUnreadCount > 0 && (
            <div className="border-t border-gray-200 p-2">
              <button
                onClick={handleMarkAllAsRead}
                className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
