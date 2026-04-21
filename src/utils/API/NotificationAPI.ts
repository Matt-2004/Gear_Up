import { deleteFetch, getFetch, patchFetch } from "./AxiosClient";

export const getNotification = async (
  cursor: string | null,
  limit: number = 20,
) => {
  const url =
    "/api/v1/notifications" +
    (cursor ? `?cursor=${cursor}&pageSize=${limit}` : `?pageSize=${limit}`);
  return getFetch(url);
};

export const deleteAllNotification = async () =>
  deleteFetch("/api/v1/notifications");
export const getUnreadNotificationCount = async () =>
  getFetch("/api/v1/notifications/unread-count");

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
