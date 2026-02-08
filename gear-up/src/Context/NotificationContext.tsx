"use client";

import { IMessageData } from "@/app/types/message.types";
import { INotificationData } from "@/app/types/notification.types";
import { createContext, useCallback, useContext, useState } from "react";

interface NotificationContextType {
  chatNotifications: IMessageData[];
  otherNotifications: INotificationData[];
  unreadChatCount: number;
  unreadNotificationCount: number;
  setChatNotifications: (notifications: IMessageData[]) => void;
  setOtherNotifications: (notifications: INotificationData[]) => void;
  addChatNotification: (notification: IMessageData) => void;
  addOtherNotification: (notification: INotificationData) => void;
  markChatAsRead: (messageId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllChatsAsRead: () => void;
  markAllNotificationsAsRead: () => void;
  clearChatNotifications: () => void;
  clearOtherNotifications: () => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider",
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [chatNotifications, setChatNotificationsState] = useState<
    IMessageData[]
  >([]);
  const [otherNotifications, setOtherNotificationsState] = useState<
    INotificationData[]
  >([]);

  // Calculate unread counts
  const unreadChatCount = chatNotifications.filter(
    (chat) => !chat.isMine,
  ).length;
  const unreadNotificationCount = otherNotifications.filter(
    (notif) => !notif.isRead,
  ).length;

  // Chat notification handlers
  const setChatNotifications = useCallback((notifications: IMessageData[]) => {
    setChatNotificationsState(notifications);
  }, []);

  const addChatNotification = useCallback((notification: IMessageData) => {
    setChatNotificationsState((prev) => [notification, ...prev]);
  }, []);

  const markChatAsRead = useCallback((messageId: string) => {
    setChatNotificationsState((prev) =>
      prev.map((chat) =>
        chat.id === messageId ? { ...chat, isMine: true } : chat,
      ),
    );
  }, []);

  const markAllChatsAsRead = useCallback(() => {
    setChatNotificationsState((prev) =>
      prev.map((chat) => ({ ...chat, isMine: true })),
    );
  }, []);

  const clearChatNotifications = useCallback(() => {
    setChatNotificationsState([]);
  }, []);

  // Other notification handlers
  const setOtherNotifications = useCallback(
    (notifications: INotificationData[]) => {
      setOtherNotificationsState(notifications);
    },
    [],
  );

  const addOtherNotification = useCallback(
    (notification: INotificationData) => {
      setOtherNotificationsState((prev) => [notification, ...prev]);
    },
    [],
  );

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setOtherNotificationsState((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif,
      ),
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setOtherNotificationsState((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true })),
    );
  }, []);

  const clearOtherNotifications = useCallback(() => {
    setOtherNotificationsState([]);
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setChatNotificationsState([]);
    setOtherNotificationsState([]);
  }, []);

  const value: NotificationContextType = {
    chatNotifications,
    otherNotifications,
    unreadChatCount,
    unreadNotificationCount,
    setChatNotifications,
    setOtherNotifications,
    addChatNotification,
    addOtherNotification,
    markChatAsRead,
    markNotificationAsRead,
    markAllChatsAsRead,
    markAllNotificationsAsRead,
    clearChatNotifications,
    clearOtherNotifications,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
