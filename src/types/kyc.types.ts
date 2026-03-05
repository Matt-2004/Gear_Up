import { Status } from "@/components/Common/StatusUI";
import { CursorBaseDTO } from "./post.types";

export interface IKycSubmissions {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  status: Status;
  documentType: string;
  documentUrls: string[];
  selfieUrl: string;
  submittedAt: string;
  rejectionReason: string | null;
}

export interface IKycRes {
  isSuccess: boolean;
  message: string;
  data: Omit<CursorBaseDTO, "items"> & { items: IKycSubmissions[] };
  status: number;
}

export interface IAdminUpdateStatus {
  status: "Pending" | "Rejected" | "Approved";
  rejectionReason: string;
}
