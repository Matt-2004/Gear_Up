import { INotificationData } from "@/app/features/notification/types/notification.types";
import { MainResponse } from "../../types.ts/main-response";
import { deleteFetch, getFetch, patchFetch } from "./AxiosClient";
import { CursorResponse } from "../../types.ts/cursor-response";

export const getNotification = async (
  cursor: string | null,
  limit: number = 20,
) => {
  const url =
    "/api/v1/notifications" +
    (cursor ? `?cursor=${cursor}&pageSize=${limit}` : `?pageSize=${limit}`);
  return getFetch<MainResponse<CursorResponse<INotificationData[]>>>(url);
};

export const deleteAllNotification = async () =>
  deleteFetch("/api/v1/notifications");
export const getUnreadNotificationCount = async () =>
  getFetch<MainResponse<number>>("/api/v1/notifications/unread-count");

export const readNotificationById = async (id: string) =>
  patchFetch(`/api/v1/notifications/${id}/read`);

export const readAllNotification = async () =>
  patchFetch("/api/v1/notifications/read-all");

export const deleteNotificationById = async (id: string) =>
  deleteFetch(`/api/v1/notifications/${id}`);

const NotificationAPI = {
  getNotification,
  deleteAllNotification,
  getUnreadNotificationCount,
  readNotificationById,
  readAllNotification,
  deleteNotificationById,
};

export default NotificationAPI;
