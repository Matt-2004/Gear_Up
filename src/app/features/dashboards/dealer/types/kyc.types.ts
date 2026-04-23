import { Status } from "@/app/shared/ui/StatusUI";
import { CursorBaseDTO } from "../../../post/types/post.types";
import { MainResponse } from "@/app/shared/types.ts/main-response";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";

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

export interface KycrResponse extends MainResponse<
  CursorResponse<IKycSubmissions[]>
> {}

export interface IAdminUpdateStatus {
  status: "Pending" | "Rejected" | "Approved";
  rejectionReason: string;
}
