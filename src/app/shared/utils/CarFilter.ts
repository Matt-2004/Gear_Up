import { CarItems, CarStatus } from "@/app/features/car/types/car.types";
import { CursorResponse } from "../types.ts/cursor-response";

export const carFilter = (
  cars: CursorResponse<CarItems[]>,
  status: string,
): number => {
  if (status === "All") return cars.items.length;
  return cars.items.filter(
    (car) => car.carValidationStatus.toLowerCase() === status.toLowerCase(),
  ).length;
};

export const filterCars = (
  cars: CarItems[],
  searchData: string,
  statusType: CarStatus | "All",
  conditionType: string,
): CarItems[] => {
  return cars.filter((car) => {
    // Search filter
    const matchesSearch =
      !searchData ||
      car.title.toLowerCase().includes(searchData.toLowerCase()) ||
      car.make.toLowerCase().includes(searchData.toLowerCase()) ||
      car.model.toLowerCase().includes(searchData.toLowerCase()) ||
      car.id.toLowerCase().includes(searchData.toLowerCase());

    // Status filter
    const matchesStatus =
      statusType === "All" ||
      car.carValidationStatus.toLowerCase() === statusType.toLowerCase();

    // Condition filter
    const matchesCondition =
      conditionType === "All" ||
      car.carCondition.toLowerCase() === conditionType.toLowerCase();

    // Fuel type filter

    return matchesSearch && matchesStatus && matchesCondition;
  });
};
