import { IKycRes } from "@/app/types/kyc.types";

export function kycFilter(kycRes: IKycRes, status: string) {
  const kycFilter = kycRes.data.kycSubmissions.filter(
    (data) => data.status === status,
  );

  return kycFilter.length;
}
