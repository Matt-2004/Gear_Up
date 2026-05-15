import {
  deleteAllNotification,
  deleteNotificationById,
  getNotification,
  getUnreadNotificationCount,
  readAllNotification,
  readNotificationById,
} from "@/app/shared/utils/API/NotificationAPI";
import type { NotificationModel } from "../../notification/types/notification.model";

const PAGE_SIZE = 20;

export async function fetchNotifications(): Promise<NotificationModel[]> {
  const res = await getNotification(null, PAGE_SIZE);
  return res?.data?.items ?? res?.data ?? [];
}

export async function fetchUnreadCount(): Promise<number> {
  const res = await getUnreadNotificationCount();
  return res?.data ?? 0;
}

export async function markAsRead(id: string): Promise<void> {
  await readNotificationById(id);
}

export async function markAllAsRead(): Promise<void> {
  await readAllNotification();
}

export async function removeNotification(id: string): Promise<void> {
  await deleteNotificationById(id);
}

export async function removeAllNotifications(): Promise<void> {
  await deleteAllNotification();
}
