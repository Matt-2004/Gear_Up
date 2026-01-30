"use client";

import { useToast } from "@/app/hooks/useToast";
import { PostContent } from "@/app/post/discover/DiscoverPost";
import { CarImages, CarItems } from "@/app/types/car.types";
import { CarCard } from "@/components/Car/CarCard";
import Button from "@/components/Common/Button";
import Spinner from "@/components/Common/Spinner";
import { addCar } from "@/utils/FetchAPI";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { useVehicleContext } from "./AddNewCarContext";

type ContainCarImagesType = Omit<CarItems, "carImages"> & {
  carImages: CarImages[];
};

const Review = () => {
  const { addedCar } = useVehicleContext();
  const router = useRouter();
  const { addToastMessage, ToastComponent, removeToastMessage } = useToast({
    toastType: "info",
    message: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!addedCar) {
    return (
      <div className="p-6 sm:p-8 lg:p-10 flex items-center justify-center">
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

  const [carData, setCarData] = useState<CarItems>();
  useEffect(() => {
    if (!addedCar) return;
    const data: ContainCarImagesType = {
      ...addedCar,
      id: "testData",
      carImages: addedCar.carImages.map((file) => ({
        id: "",
        carId: "",
        url: URL.createObjectURL(file),
      })),
    };
    setCarData(data);
  }, [addedCar]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!addedCar) {
      addToastMessage("error", "No car data found. Please complete all steps.");
      return;
    }

    setIsSubmitting(true);

    try {
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

      if (response?.isSuccess) {
        addToastMessage("success", "Vehicle listed successfully!");
        // Navigate to dealer cars page after a short delay
        setTimeout(() => {
          router.push("/profile/dealer/cars");
        }, 1500);
      } else {
        addToastMessage(
          "error",
          response?.message || "Failed to list vehicle. Please try again.",
        );
      }
    } catch (error: any) {
      console.error("Error adding car:", error);
      addToastMessage(
        "error",
        error?.message || "An error occurred while listing your vehicle.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastComponent />
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10">
        <div className="space-y-8">
          <div className="border-l-4 border-primary-500 pl-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Review Your Listing
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Please review your information carefully. This is how your vehicle
              will appear to buyers.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              🔍 Before Publishing:
            </h3>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>Verify all specifications are accurate</li>
              <li>Ensure images clearly show the vehicle's condition</li>
              <li>Check pricing is competitive for your market</li>
            </ul>
          </div>

          {carData && (
            <div className="flex justify-center p-4 bg-gray-50 rounded-xl">
              <CarCard carItem={carData} />
            </div>
          )}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-primary-500 pl-4">
              Basic Information
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Title
                  </label>
                  <p className="text-base text-gray-900 font-medium">
                    {addedCar.title}
                  </p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Description
                  </label>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    <PostContent postContent={addedCar.description} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-primary-500 pl-4">
              Vehicle Specifications
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide pb-2 border-b border-gray-200">
                    Basic
                  </h3>
                  <table className="w-full">
                    <tbody>
                      {basicSpecTableData.map((d, i) => {
                        const [key, value] = Object.entries(d)[0];
                        return (
                          <TableRow key={i} index={i}>
                            <td className="py-2 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              {key}
                            </td>
                            <td className="py-2 text-sm text-gray-900 font-medium">
                              {value}
                            </td>
                          </TableRow>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide pb-2 border-b border-gray-200">
                    Performance
                  </h3>
                  <table className="w-full">
                    <tbody>
                      {performanceSpecTableData.map((d, i) => {
                        const [key, value] = Object.entries(d)[0];
                        return (
                          <TableRow key={i} index={i}>
                            <td className="py-2 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              {key}
                            </td>
                            <td className="py-2 text-sm text-gray-900 font-medium">
                              {value}
                            </td>
                          </TableRow>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide pb-2 border-b border-gray-200">
                    Capacity
                  </h3>
                  <table className="w-full">
                    <tbody>
                      {capacitySpecTableData.map((d, i) => {
                        const [key, value] = Object.entries(d)[0];
                        return (
                          <TableRow key={i} index={i}>
                            <td className="py-2 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              {key}
                            </td>
                            <td className="py-2 text-sm text-gray-900 font-medium">
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
          <div className="flex justify-between border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => router.push(window.location.pathname + "?step=2")}
              className="px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner />
                  Publishing...
                </span>
              ) : (
                "Publish Listing"
              )}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export const TableRow = ({
  index,
  children,
}: {
  index: number;
  children: ReactNode;
}) => {
  return <tr className="border-b border-gray-100 last:border-0">{children}</tr>;
};

export default Review;
