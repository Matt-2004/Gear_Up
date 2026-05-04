export interface IAdminUpdateStatus {
  status: "Pending" | "Rejected" | "Approved";
  rejectionReason: string;
}
