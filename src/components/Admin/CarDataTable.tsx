"use client";

import { AdminCarData } from "@/types/admin-car-approval.types";
import { CarItems } from "@/types/car.types";
import StatusUI from "@/components/Common/StatusUI";
import { useCarFilterContext } from "@/Context/AdminCarFilterContext";
import { filterCars } from "@/utils/CarFilter";
import { ArrowUpRight, Check, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const CarDataTable = ({ cars }: { cars: AdminCarData[] }) => {
  const { filter } = useCarFilterContext();
  const filteredCars = filterCars(
    cars,
    filter.searchData,
    filter.statusType,
    filter.conditionType,
  );

  return (
    <div className="overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-primary-50">
          <tr>
            <th
              scope="col"
              className="text-primary-900 px-6 py-4 text-left text-xs font-semibold tracking-wider uppercase"
            >
              No.
            </th>
            <th
              scope="col"
              className="text-primary-900 px-6 py-4 text-left text-xs font-semibold tracking-wider uppercase"
            >
              Car Name
            </th>
            <th
              scope="col"
              className="text-primary-900 px-6 py-4 text-left text-xs font-semibold tracking-wider uppercase"
            >
              Dealer Name
            </th>
            <th
              scope="col"
              className="text-primary-900 px-6 py-4 text-left text-xs font-semibold tracking-wider uppercase"
            >
              Price
            </th>
            <th
              scope="col"
              className="text-primary-900 px-6 py-4 text-left text-xs font-semibold tracking-wider uppercase"
            >
              Status
            </th>
            <th
              scope="col"
              className="text-primary-900 px-6 py-4 text-center text-xs font-semibold tracking-wider uppercase"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {filteredCars.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-4 rounded-full bg-gray-100 p-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    No results found
                  </h3>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            filteredCars.map((car: CarItems, index: number) => (
              <tr
                key={car.id}
                className="hover:bg-primary-50/30 border-b border-gray-100 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                  {car.title}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                  {car.id}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                  ${car.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusUI status={car.carValidationStatus as any} />
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <ReviewBtn status={car.carValidationStatus} id={car.id} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const ReviewBtn = ({ id, status }: { id: string; status: string }) => {
  const currentPath = usePathname();
  const router = useRouter();

  return (
    <div className="flex justify-center">
      <button
        onClick={() => router.push(`${currentPath}/cars/${id}`)}
        className="group hover:bg-primary-50 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
      >
        {status === "Pending" ? (
          <>
            <span className="text-primary-600 group-hover:text-primary-700">
              View
            </span>
            <ArrowUpRight className="text-primary-600 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        ) : (
          <>
            <span className="text-primary-600">Completed</span>
            <div className="bg-primary-500 flex h-5 w-5 items-center justify-center rounded-full">
              <Check className="h-3 w-3 text-white" />
            </div>
          </>
        )}
      </button>
    </div>
  );
};

export default CarDataTable;
