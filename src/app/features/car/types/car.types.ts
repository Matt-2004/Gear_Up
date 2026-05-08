import { ReactNode } from "react";
import { MainResponse } from "@/app/shared/types.ts/main-response";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";

export interface CarsResponse extends MainResponse<
  CursorResponse<CarItems[]>
> {}

export interface CarImages {
  id: string;
  carId: string;
  url: string;
}


export type ICarCondition = "Default" | "New" | "Used";

export type ITransmissionType =
  | "Default"
  | "Manual"
  | "Automatic"
  | "SemiAutomatic";

export type IFuelType = "Default" | "Petrol" | "Diesel" | "Electric" | "Hybrid";

export type CarStatus = "Pending" | "Approved" | "Rejected";
