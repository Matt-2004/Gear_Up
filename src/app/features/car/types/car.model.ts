import {
  CarImages,
  ICarCondition,
  IFuelType,
  ITransmissionType,
} from "./car.dto";

export type CarModel = {
  id: string;
  imageUrl: string;
  title: string;
  make: string;
  model: string;
  transmission: string;
  status: string;
  mileage: number;
  seats: number;
  price: number;
  color: string;
  createdAt: Date;
};

export type CarDetailModel = {
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
  seats: number;
  engine: number;
  images: CarImages[];
  fuel: IFuelType;
  condition: ICarCondition;
  transmission: ITransmissionType;
  status: string;
  vin: string;
  license: string;
};
