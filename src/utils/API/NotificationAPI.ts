import { apiFetch, apiDelete, apiPatch } from "./AxiosClientBrowser";

export const getNotification = async (
  cursor: string | null,
  limit: number = 20,
) => {
  const url =
    "/api/notifications" +
    (cursor ? `?cursor=${cursor}&limit=${limit}` : `?limit=${limit}`);
  return apiFetch(url);
};

export const deleteAllNotification = async () =>
  apiDelete("/api/notifications");

export const getUnreadNotificationCount = async () =>
  apiFetch("/api/notifications/unread-count");

export const readNotificationById = async (id: string) =>
  apiPatch(`/api/notifications/${id}`);

export const readAllNotification = async () =>
  apiPatch("/api/notifications/read-all");

export const deleteNotificationById = async (id: string) =>
  apiDelete(`/api/notifications/${id}`);

const NotificationAPI = {
  getNotification,
  deleteAllNotification,
  getUnreadNotificationCount,
  readNotificationById,
  readAllNotification,
  deleteNotificationById,
};

export default NotificationAPI;
