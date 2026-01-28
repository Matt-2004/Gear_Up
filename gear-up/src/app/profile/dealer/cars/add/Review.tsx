"use client";

import { PostContent } from "@/app/post/discover/DiscoverPost";
import { CarImages, CarItems } from "@/app/types/car.types";
import { CarCard } from "@/components/Car/CarCard";
import Button from "@/components/Common/Button";
import { ReactNode, useEffect, useState } from "react";
import { useVehicleContext } from "./AddNewCarContext";

type ContainCarImagesType = Omit<CarItems, "carImages"> & {
  carImages: CarImages[];
};

const Review = () => {
  const { addedCar } = useVehicleContext();
  const [testData, setTestData] = useState<CarItems>({
    id: "1234",
    title: "Toyota Carmy 2.0",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,",
    model: "Camry",
    make: "Toyota",
    year: 2024,
    price: 1250000,
    color: "White",
    mileage: 45000,
    seatingCapacity: 4,
    engineCapacity: 2.0,
    carImages: [],
    fuelType: "Petrol",
    carCondition: "New",
    transmissionType: "Manual",
    carStatus: "Available",
    carValidationStatus: "Clean",
    vin: "12345678910",
    licensePlate: "BMW-6733",
  });

  const { make, model, year, color } = testData;
  const basicSpecTableData = [
    { Make: make },
    { Model: model },
    { Year: year },
    { Color: color },
  ];

  const { engineCapacity, fuelType, transmissionType } = testData;
  const performanceSpecTableData = [
    { EngineCapacity: engineCapacity },
    { FuelType: fuelType },
    { TransmissionType: transmissionType },
  ];

  const { mileage, seatingCapacity } = testData;
  const capacitySpecTableData = [
    { Mileage: mileage },
    { SeatingCapacity: seatingCapacity },
  ];

  const [carData, setCarData] = useState<CarItems>();
  useEffect(() => {
    if (!addedCar) return;
    const data: ContainCarImagesType = {
      ...addedCar,
      carImages: addedCar.carImages.map((file) => ({
        id: "",
        carId: "",
        url: URL.createObjectURL(file),
      })),
    };
    setCarData(data);
  }, [addedCar]);

  // File[] type to  CarImges[]

  return (
    <form className="p-6 sm:p-8 lg:p-10">
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

        <div className="flex justify-center p-4 bg-gray-50 rounded-xl">
          <CarCard carItem={testData!!} />
        </div>
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
                  {testData.title}
                </p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Description
                </label>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <PostContent postContent={testData.description} />
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
        <div className="flex justify-end border-t border-gray-200 pt-6">
          <Button>Publish Listing</Button>
        </div>
      </div>
    </form>
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
