import { INotificationTypes } from "./notification.dto";

export interface NotificationModel {
  actorUserId: string;
  appointmentId: string;
  carId: string;
  commentId: string;
  id: string;
  isRead: boolean;
  kycId: string;
  notificationType: INotificationTypes;
  postId: string;
  receiverUserId: string;
  sentAt: string;
  title: string;
}
