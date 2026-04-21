"use client";

import { CarItems } from "@/types/car.types";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type SubmitVehicle = Omit<
  CarItems,
  "carImages" | "id" | "name" | "dealerId" | "carStatus" | "carValidationStatus"
> & {
  carImages: File[];
};

interface IVehicleContextType {
  addedCar: SubmitVehicle | undefined;
  updateAddedCar: (data: Partial<SubmitVehicle>) => void;
  clearAddedCar: () => void;
  isDraftReady: boolean;
}

export const VehicleContext = createContext<IVehicleContextType | undefined>(
  undefined,
);

const VEHICLE_DRAFT_STORAGE_KEY = "gearup:add-car-draft";

const sanitizeYear = (value: unknown): number => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const sanitizeName = (value: unknown): string => {
  return typeof value === "string" ? value : "";
};

const defaultVehicleData: SubmitVehicle = {
  title: "",
  description: "",
  model: "",
  make: "",
  year: 0,
  price: 0,
  color: "",
  mileage: 0,
  seatingCapacity: 0,
  engineCapacity: 0,
  carImages: [],
  fuelType: "Default",
  carCondition: "Default",
  transmissionType: "Default",

  vin: "",
  licensePlate: "",
};

export default function VehicleContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [vehicleData, setVehicleData] =
    useState<SubmitVehicle>(defaultVehicleData);
  const [isStorageHydrated, setIsStorageHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedDraft = window.localStorage.getItem(
        VEHICLE_DRAFT_STORAGE_KEY,
      );
      if (!storedDraft) return;

      const parsedDraft = JSON.parse(storedDraft) as Partial<SubmitVehicle>;
      setVehicleData((prev) => ({
        ...prev,
        ...parsedDraft,
        year: sanitizeYear(parsedDraft.year ?? prev.year),

        carImages: [],
      }));
    } catch {
      window.localStorage.removeItem(VEHICLE_DRAFT_STORAGE_KEY);
    } finally {
      setIsStorageHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isStorageHydrated) return;

    const persistableData = { ...vehicleData, carImages: [] };
    window.localStorage.setItem(
      VEHICLE_DRAFT_STORAGE_KEY,
      JSON.stringify(persistableData),
    );
  }, [vehicleData, isStorageHydrated]);

  const updateAddedCar = useCallback((data: Partial<SubmitVehicle>) => {
    setVehicleData((prev) => ({
      ...prev,
      ...data,
      year: sanitizeYear(data.year ?? prev.year),
    }));
  }, []);

  const clearAddedCar = useCallback(() => {
    setVehicleData(defaultVehicleData);
    window.localStorage.removeItem(VEHICLE_DRAFT_STORAGE_KEY);
  }, []);

  return (
    <VehicleContext.Provider
      value={{
        addedCar: vehicleData,
        updateAddedCar,
        clearAddedCar,
        isDraftReady: isStorageHydrated,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicleContext() {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error("useVehicleContext must be used inside a Provider");
  }
  return context;
}
