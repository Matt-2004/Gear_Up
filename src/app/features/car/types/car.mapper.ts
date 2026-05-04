import { CarDetailDTO, CarDTO } from "./car.dto";
import { CarDetailModel, CarModel } from "./car.model";

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

export function carDetailMapper(dto: CarDetailDTO): CarDetailModel {
  return {
    id: dto.id,
    name: dto.name,
    dealerId: dto.dealerId,
    images: dto.carImages,
    title: dto.title,
    description: dto.description,
    make: dto.make,
    model: dto.model,
    transmission: dto.transmissionType,
    status: dto.carValidationStatus,
    mileage: dto.mileage,
    seats: dto.seatingCapacity,
    price: dto.price,
    engine: dto.engineCapacity,
    color: dto.color,
    condition: dto.carCondition,
    fuel: dto.fuelType,
    year: dto.year,
    vin: dto.vin,
    license: dto.licensePlate,
  };
}
