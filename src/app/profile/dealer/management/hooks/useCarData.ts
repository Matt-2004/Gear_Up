import { AppointmentStatus } from "@/types/appointment.types";
import { CarItems, CarStatus } from "@/types/car.types";
import { useMemo } from "react";

export function useCarData(
  cars: CarItems[],
  statusFilter: AppointmentStatus | "All",
) {
  const filteredCars = useMemo(
    () =>
      statusFilter === "All"
        ? cars
        : cars.filter(
            (car) =>
              car.carValidationStatus?.toLowerCase() ===
              statusFilter.toLowerCase(),
          ),
    [cars, statusFilter],
  );

  const carCounts = useMemo(
    () => ({
      total: cars.length || 0,
      pending:
        cars.filter(
          (car) => car.carValidationStatus?.toLowerCase() === "pending",
        ).length || 0,
      approved:
        cars.filter(
          (car) => car.carValidationStatus?.toLowerCase() === "approved",
        ).length || 0,
      rejected:
        cars.filter(
          (car) => car.carValidationStatus?.toLowerCase() === "rejected",
        ).length || 0,
    }),
    [cars],
  );

  return { filteredCars, carCounts };
}
