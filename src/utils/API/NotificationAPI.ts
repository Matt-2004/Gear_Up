import { deleteFetch, getFetch, patchFetch } from "./AxiosClient";

export const getNotification = async (
  cursor: string | null,
  limit: number = 20,
) => {
  const url = await getFetch(
    "api/v1/notifications" +
      (cursor ? `?cursor=${cursor}&limit=${limit}` : `?limit=${limit}`),
  );
  return url;
};

export const deleteAllNotification = async () => {
  const url = await deleteFetch("api/v1/notifications");
  return url;
};

export const getUnreadNotificationCount = async () => {
  const url = await getFetch("api/v1/notifications/unread-count");
  return url;
};

export const readNotificationById = async (id: string) => {
  const url = await patchFetch(`api/v1/notifications/${id}/read`);
  return url;
};

export const readAllNotification = async () => {
  const url = await patchFetch("api/v1/notifications/read-all");
  return url;
};

export const deleteNotificationById = async (id: string) => {
  const url = await deleteFetch(`api/v1/notifications/${id}`);
  return url;
};

const NotificationAPI = {
  getNotification,
  deleteAllNotification,
  getUnreadNotificationCount,
  readNotificationById,
  readAllNotification,
  deleteNotificationById,
};

export default NotificationAPI;
