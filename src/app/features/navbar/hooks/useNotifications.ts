"use client";

import { useNotificationContext } from "@/app/features/notification/context/NotificationContext";
import { IMessageData } from "@/app/features/messaging/types/message.types";
import { getClientAccessToken } from "@/app/shared/utils/AuthUtils/clientTokenUtils";
import * as signalR from "@microsoft/signalr";
import { useCallback, useEffect, useRef, useState } from "react";
import type { NotificationModel } from "../../notification/types/notification.model";
import * as notifApi from "../services/notification-api";
import type { NotificationTab } from "../types";

export function useNotifications() {
  const [token, setToken] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationTab>("app");
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [unreadAppCount, setUnreadAppCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const {
    addChatNotification,
    unreadChatCount,
    chatNotifications,
    markChatAsRead,
  } = useNotificationContext();

  const totalUnread = unreadChatCount + unreadAppCount;

  // ── Fetch token ────────────────────────────────────────────────────────
  useEffect(() => {
    getClientAccessToken().then(setToken);
  }, []);

  // ── Fetch data ─────────────────────────────────────────────────────────
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      setNotifications(await notifApi.fetchNotifications());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUnreadCount = useCallback(async () => {
    try {
      setUnreadAppCount(await notifApi.fetchUnreadCount());
    } catch {
      // silent
    }
  }, []);

  // Mount + poll
  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
    const id = setInterval(loadUnreadCount, 60_000);
    return () => clearInterval(id);
  }, [loadNotifications, loadUnreadCount]);

  // Refetch on open
  useEffect(() => {
    if (isOpen) loadNotifications();
  }, [isOpen, loadNotifications]);

  // ── Actions ────────────────────────────────────────────────────────────
  const handleReadOne = useCallback(async (n: NotificationModel) => {
    if (!n.isRead) {
      try {
        await notifApi.markAsRead(n.id);
        setNotifications((prev) =>
          prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)),
        );
        setUnreadAppCount((c) => Math.max(0, c - 1));
      } catch {
        // silent
      }
    }
  }, []);

  const handleDeleteOne = useCallback(async (id: string) => {
    setDeletingId(id);
    try {
      await notifApi.removeNotification(id);
      setNotifications((prev) => prev.filter((x) => x.id !== id));
    } catch {
      // silent
    }
    setDeletingId(null);
  }, []);

  const handleReadAll = useCallback(async () => {
    try {
      await notifApi.markAllAsRead();
      setNotifications((prev) => prev.map((x) => ({ ...x, isRead: true })));
      setUnreadAppCount(0);
    } catch {
      // silent
    }
  }, []);

  const handleDeleteAll = useCallback(async () => {
    try {
      await notifApi.removeAllNotifications();
      setNotifications([]);
      setUnreadAppCount(0);
    } catch {
      // silent
    }
  }, []);

  const handleChatClick = useCallback(
    (chat: IMessageData) => {
      markChatAsRead(chat.id);
      setIsOpen(false);
      window.location.href = `/messages?userId=${chat.senderId}`;
    },
    [markChatAsRead],
  );

  // ── SignalR ────────────────────────────────────────────────────────────
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

    conn.start().catch((err) =>
      console.error("SignalR connect error:", err),
    );

    conn.on("MessageReceived", (data: IMessageData) => {
      addChatNotification(data);
    });

    conn.on("NotificationReceived", (data: NotificationModel) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadAppCount((c) => c + 1);
    });

    connectionRef.current = conn;
    return () => {
      conn.stop();
    };
  }, [token, addChatNotification]);

  const appUnread = notifications.filter((n) => !n.isRead).length;

  return {
    isOpen,
    setIsOpen,
    activeTab,
    setActiveTab,
    notifications,
    unreadAppCount,
    appUnread,
    unreadChatCount,
    totalUnread,
    loading,
    deletingId,
    chatNotifications,
    loadingNotifications: loading,
    handleReadOne,
    handleDeleteOne,
    handleReadAll,
    handleDeleteAll,
    handleChatClick,
  };
}
