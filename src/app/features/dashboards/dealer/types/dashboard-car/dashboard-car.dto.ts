import {
  CarStatus,
  ITransmissionType,
} from "@/app/features/car/types/car.types";

export interface DashboardCarDTO {
  id: string;
  title: string;
  model: string;
  make: string;
  price: number;
  color: string;
  mileage: number;
  seatingCapacity: number;
  carValidationStatus: CarStatus;
  createdAt: string;
  thumbnailUrl: string;
  transmissionType: ITransmissionType;
}
