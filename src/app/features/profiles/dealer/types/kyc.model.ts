import { Status } from "@/app/shared/ui/StatusUI";

export interface KycModel {
  kycId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  status: Status;
  documentType: string;
  documentUrls: string[];
  selfieUrl: string;
  submittedAt: string;
  rejectionReason: string | null;
}
