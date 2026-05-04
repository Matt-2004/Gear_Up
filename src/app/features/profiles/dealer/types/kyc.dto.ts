import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { MainResponse } from "@/app/shared/types.ts/main-response";
import { Status } from "@/app/shared/ui/StatusUI";

export interface KycDTO {
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

export interface KYCResponse extends MainResponse<CursorResponse<KycDTO[]>> {}
