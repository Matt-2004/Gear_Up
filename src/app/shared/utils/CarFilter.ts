import { CarDetailModel, CarModel } from "@/app/features/car/types/car.model";
import { CursorResponse } from "../types.ts/cursor-response";

export const carFilter = (
  cars: CursorResponse<CarModel[]>,
  status: string,
): number => {
  if (status === "All") return cars.items.length;
  return cars.items.filter(
    (car) => car.status.toLowerCase() === status.toLowerCase(),
  ).length;
};

export const filterCars = (
  cars: CarDetailModel[],
  searchData: string,
  statusType: string | "All",
  conditionType: string,
): CarDetailModel[] => {
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
      car.status.toLowerCase() === statusType.toLowerCase();

    // Condition filter
    const matchesCondition =
      conditionType === "All" ||
      car.condition.toLowerCase() === conditionType.toLowerCase();

    // Fuel type filter

    return matchesSearch && matchesStatus && matchesCondition;
  });
};
