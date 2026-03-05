export interface INotificationData {
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

export interface INotificationTypes {
  0: "Default";
  1: "PostLiked";
  2: "PostCommented";
  3: "CommentReplied";
  4: "CommentLiked";
  5: "KycInfo";
  6: "AppointmentRequested";
  7: "AppointmentAccepted";
  8: "AppointmentRejected";
}
