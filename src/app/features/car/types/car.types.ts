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

export interface CarItems {
  name: ReactNode;
  dealerId: string;
  id: string;
  title: string;
  description: string;
  model: string;
  make: string;
  year: number;
  price: number;
  color: string;
  mileage: number;
  seatingCapacity: number;
  engineCapacity: number;
  carImages: CarImages[] | string;
  fuelType: IFuelType;
  carCondition: ICarCondition;
  transmissionType: ITransmissionType;
  carStatus: string;
  carValidationStatus: string;
  vin: string;
  licensePlate: string;
}

export type ICarCondition = "Default" | "New" | "Used";

export type ITransmissionType =
  | "Default"
  | "Manual"
  | "Automatic"
  | "SemiAutomatic";

export type IFuelType = "Default" | "Petrol" | "Diesel" | "Electric" | "Hybrid";

export type CarStatus = "Pending" | "Approved" | "Rejected";
