import { NotificationDTO } from "./notification.dto";
import { NotificationModel } from "./notification.model";

export function NotificationMapper(dto: NotificationDTO): NotificationModel {
  return {
    actorUserId: dto.actorUserId,
    appointmentId: dto.appointmentId,
    carId: dto.carId,
    commentId: dto.commentId,
    id: dto.id,
    isRead: dto.isRead,
    kycId: dto.kycId,
    notificationType: dto.notificationType,
    postId: dto.postId,
    receiverUserId: dto.receiverUserId,
    sentAt: dto.sentAt,
    title: dto.title,
  };
}
