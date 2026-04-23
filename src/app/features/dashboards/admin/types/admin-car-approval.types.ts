import { MainResponse } from "@/app/shared/types.ts/main-response";
import { CarItems } from "../../../car/types/car.types";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";

export interface AdminCarData extends CarItems {
  documentType: string;
  fullName: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminCarApprovalResponse extends MainResponse<
  CursorResponse<AdminCarData[]>
> {}
