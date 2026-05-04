import { KycModel } from "@/app/features/profiles/dealer/types/kyc.model";
import { CursorResponse } from "../types.ts/cursor-response";

export function kycFilter(kycRes: CursorResponse<KycModel[]>, status: string) {
  if (!kycRes.items) {
    return;
  }

  const kycFilter = kycRes.items.filter((data) => data.status === status);

  return kycFilter.length;
}
