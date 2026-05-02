"use client";

import { useToast } from "@/app/features/toast/hooks/useToast";
import { PostContent } from "@/app/features/post/ui/DiscoverPost";
import { CarItems } from "@/app/features/car/types/car.types";

import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { useVehicleContext } from "../../context/AddNewCarContext";
import StepNavigation from "./StepNavigation";
import { addCar } from "@/app/shared/utils/API/CarAPI";
import { CarCard } from "@/app/features/car/ui/car-card/CarCard";
import { CarModel } from "@/app/features/car/types/car.model";

const Review = () => {
  const { addedCar, clearAddedCar, isDraftReady } = useVehicleContext();
  const { handleToast, addToastMessage } = useToast({
    toastType: "info",
    message: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carData, setCarData] = useState<CarModel>();

  useEffect(() => {
    if (!addedCar) return;
    setCarData({
      id: "",
      imageUrl: addedCar.carImages[0]
        ? URL.createObjectURL(addedCar.carImages[0])
        : "",
      title: addedCar.title,
      model: addedCar.model,
      transmission: addedCar.transmissionType,
      mileage: addedCar.mileage,
      make: addedCar.make,
      status: "Default",
      price: addedCar.price,
      seats: addedCar.seatingCapacity,
      createdAt: new Date(),
      color: addedCar.color,
    });
  }, [addedCar]);

  if (!isDraftReady) {
    return (
      <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
        <p className="text-gray-500">Loading your saved draft...</p>
      </div>
    );
  }

  if (!addedCar) {
    return (
      <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
        <p className="text-gray-500">Loading car data...</p>
      </div>
    );
  }

  const { make, model, year, color } = addedCar;
  const basicSpecTableData = [
    { Make: make },
    { Model: model },
    { Year: year },
    { Color: color },
  ];

  const { engineCapacity, fuelType, transmissionType } = addedCar!;
  const performanceSpecTableData = [
    { EngineCapacity: engineCapacity },
    { FuelType: fuelType },
    { TransmissionType: transmissionType },
  ];

  const { mileage, seatingCapacity } = addedCar!;
  const capacitySpecTableData = [
    { Mileage: mileage },
    { SeatingCapacity: seatingCapacity },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!addedCar) {
      addToastMessage("error", "No car data found. Please complete all steps.");
      return;
    }

    setIsSubmitting(true);

    // Create FormData for API submission
    const formData = new FormData();
    // Append all car details
    formData.append("Title", addedCar.title);
    formData.append("Description", addedCar.description);
    formData.append("Make", addedCar.make);
    formData.append("Model", addedCar.model);
    formData.append("Year", addedCar.year.toString());
    formData.append("Price", addedCar.price.toString());
    formData.append("Color", addedCar.color);
    formData.append("Mileage", addedCar.mileage.toString());
    formData.append("SeatingCapacity", addedCar.seatingCapacity.toString());
    formData.append("EngineCapacity", addedCar.engineCapacity.toString());
    formData.append("FuelType", addedCar.fuelType);
    formData.append("CarCondition", addedCar.carCondition);
    formData.append("TransmissionType", addedCar.transmissionType);
    formData.append("Vin", addedCar.vin);
    formData.append("LicensePlate", addedCar.licensePlate);

    // Append images
    addedCar.carImages.forEach((file) => {
      formData.append("CarImages", file);
    });

    const response = await addCar(formData);

    clearAddedCar();
    handleToast(response, "/profile/dealer?tab=car-management");
    setIsSubmitting(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10">
        <div className="space-y-8">
          <div className="border-primary-500 border-l-4 pl-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Review Your Listing
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Please review your information carefully. This is how your vehicle
              will appear to buyers.
            </p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-linear-to-br from-blue-50 to-blue-100 p-6">
            <h3 className="mb-2 text-sm font-semibold text-blue-900">
              🔍 Before Publishing:
            </h3>
            <ul className="list-inside list-disc space-y-1 text-xs text-blue-800">
              <li>Verify all specifications are accurate</li>
              <li>Ensure images clearly show the vehicle&apos;s condition</li>
              <li>Check pricing is competitive for your market</li>
            </ul>
          </div>

          {carData && (
            <div className="flex justify-center rounded-xl bg-gray-50 p-4">
              <CarCard carItem={carData} />
            </div>
          )}
          <div className="space-y-4">
            <h2 className="border-primary-500 border-l-4 pl-4 text-xl font-bold text-gray-900">
              Basic Information
            </h2>
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Title
                  </label>
                  <p className="text-base font-medium text-gray-900">
                    {addedCar.title}
                  </p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Description
                  </label>
                  <div className="text-sm leading-relaxed text-gray-700">
                    <PostContent postContent={addedCar.description} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="border-primary-500 border-l-4 pl-4 text-xl font-bold text-gray-900">
              Vehicle Specifications
            </h2>
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-3">
                  <h3 className="border-b border-gray-200 pb-2 text-sm font-bold tracking-wide text-gray-700 uppercase">
                    Basic
                  </h3>
                  <table className="w-full">
                    <tbody>
                      {basicSpecTableData.map((d, i) => {
                        const [key, value] = Object.entries(d)[0];
                        return (
                          <TableRow key={i}>
                            <td className="py-2 pr-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                              {key}
                            </td>
                            <td className="py-2 text-sm font-medium text-gray-900">
                              {value}
                            </td>
                          </TableRow>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="space-y-3">
                  <h3 className="border-b border-gray-200 pb-2 text-sm font-bold tracking-wide text-gray-700 uppercase">
                    Performance
                  </h3>
                  <table className="w-full">
                    <tbody>
                      {performanceSpecTableData.map((d, i) => {
                        const [key, value] = Object.entries(d)[0];
                        return (
                          <TableRow key={i}>
                            <td className="py-2 pr-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                              {key}
                            </td>
                            <td className="py-2 text-sm font-medium text-gray-900">
                              {value}
                            </td>
                          </TableRow>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="space-y-3">
                  <h3 className="border-b border-gray-200 pb-2 text-sm font-bold tracking-wide text-gray-700 uppercase">
                    Capacity
                  </h3>
                  <table className="w-full">
                    <tbody>
                      {capacitySpecTableData.map((d, i) => {
                        const [key, value] = Object.entries(d)[0];
                        return (
                          <TableRow key={i}>
                            <td className="py-2 pr-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                              {key}
                            </td>
                            <td className="py-2 text-sm font-medium text-gray-900">
                              {value}
                            </td>
                          </TableRow>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
            <StepNavigation
              isSubmitForm={true}
              isSubmitting={isSubmitting}
              label="Submit"
            />
          </div>
        </div>
      </form>
    </>
  );
};

export const TableRow = ({ children }: { children: ReactNode }) => {
  return <tr className="border-b border-gray-100 last:border-0">{children}</tr>;
};

export default Review;
