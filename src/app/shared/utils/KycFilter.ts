import { IKycSubmissions } from "@/app/features/dashboards/dealer/types/kyc.types";
import { CursorResponse } from "../types.ts/cursor-response";

export function kycFilter(
  kycRes: CursorResponse<IKycSubmissions[]>,
  status: string,
) {
  if (!kycRes.items) {
    return;
  }

  const kycFilter = kycRes.items.filter((data) => data.status === status);

  return kycFilter.length;
}
