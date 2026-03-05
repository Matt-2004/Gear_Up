import { CarItems } from "./car.types";
import { DefaultResponse } from "./Default_Response";
import { CursorBaseDTO } from "./post.types";

export interface AdminCarData extends CarItems {
  createdAt: string;
  updatedAt: string;
}

export interface AdminCarApprovalData extends Omit<CursorBaseDTO, "items"> {
  items: AdminCarData[];
}

export interface IAdminCarApprovalResponse extends DefaultResponse<AdminCarApprovalData> {}
