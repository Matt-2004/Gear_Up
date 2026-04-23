"use client";

import { IMessageData } from "@/app/features/messaging/types/message.types";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface NotificationContextType {
  chatNotifications: IMessageData[];
  unreadChatCount: number;
  setChatNotifications: (notifications: IMessageData[]) => void;
  addChatNotification: (notification: IMessageData) => void;
  markChatAsRead: (messageId: string) => void;
  markAllChatsAsRead: () => void;
  clearChatNotifications: () => void;
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
  children: ReactNode;
}

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [chatNotifications, setChatNotificationsState] = useState<
    IMessageData[]
  >([]);

  // Calculate unread counts
  const unreadChatCount = chatNotifications.filter(
    (chat) => !chat.isMine,
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

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setChatNotificationsState([]);
  }, []);

  const value: NotificationContextType = {
    chatNotifications,
    unreadChatCount,
    setChatNotifications,
    addChatNotification,
    markChatAsRead,
    markAllChatsAsRead,
    clearChatNotifications,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
