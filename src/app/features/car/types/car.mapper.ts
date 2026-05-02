import { CarDTO } from "./car.dto";
import { CarModel } from "./car.model";

export function carMapper(dto: CarDTO): CarModel {
  return {
    id: dto.id,
    imageUrl: dto.thumbnailUrl,
    title: dto.title,
    make: dto.make,
    model: dto.model,
    transmission: dto.transmissionType,
    status: dto.carValidationStatus,
    mileage: dto.mileage,
    seats: dto.seatingCapacity,
    price: dto.price,
    color: dto.color,
    createdAt: new Date(dto.createdAt),
  };
}

export function carsMapper(dtos: CarDTO[]): CarModel[] {
  return dtos.map(carMapper);
}
