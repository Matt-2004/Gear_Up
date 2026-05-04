import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { MainResponse } from "@/app/shared/types.ts/main-response";

export type CarDTO = {
  id: string;
  thumbnailUrl: string;
  title: string;
  make: string;
  model: string;
  transmissionType: string;
  carValidationStatus: string;
  mileage: number;
  seatingCapacity: number;
  price: number;
  color: string;
  createdAt: string;
};

export type CarDetailDTO = {
  name: string;
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
  carImages: CarImages[];
  fuelType: IFuelType;
  carCondition: ICarCondition;
  transmissionType: ITransmissionType;
  carStatus: string;
  carValidationStatus: string;
  vin: string;
  licensePlate: string;
};

export type ICarCondition = "Default" | "New" | "Used";

export type ITransmissionType =
  | "Default"
  | "Manual"
  | "Automatic"
  | "SemiAutomatic";

export type IFuelType = "Default" | "Petrol" | "Diesel" | "Electric" | "Hybrid";

export type CarStatus = "Pending" | "Approved" | "Rejected";

export interface CarImages {
  id: string;
  carId: string;
  url: string;
}

export interface CarResponse extends MainResponse<CursorResponse<CarDTO[]>> {}

export interface CarDetailResponse extends MainResponse<CarDetailDTO> {}
