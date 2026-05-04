import { KycDTO } from "./kyc.dto";
import { KycModel } from "./kyc.model";

export function KycMapper(dto: KycDTO): KycModel {
  return {
    kycId: dto.id,
    userId: dto.userId,
    name: dto.fullName,
    email: dto.email,
    phone: dto.phoneNumber,
    dateOfBirth: dto.dateOfBirth,
    status: dto.status,
    documentType: dto.documentType,
    documentUrls: dto.documentUrls,
    selfieUrl: dto.selfieUrl,
    submittedAt: dto.submittedAt,
    rejectionReason: dto.rejectionReason,
  };
}
