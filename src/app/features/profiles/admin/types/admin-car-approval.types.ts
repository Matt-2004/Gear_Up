import { MainResponse } from "@/app/shared/types.ts/main-response";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { CarDetailModel } from "@/app/features/car/types/car.model";

export interface AdminCarData extends CarDetailModel {
  documentType: string;
  fullName: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminCarApprovalResponse extends MainResponse<
  CursorResponse<AdminCarData[]>
> {}
