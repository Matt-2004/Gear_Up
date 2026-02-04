"use client";

import { AdminCarData } from "@/app/types/Admin_Car_Approval";
import { CarItems } from "@/app/types/car.types";
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
        filter.fuelType
    );

    return (
        <div className="overflow-hidden">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
                        >
                            No.
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
                        >
                            Car Name
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
                        >
                            Dealer Name
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
                        >
                            Price
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
                        >
                            Status
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-700"
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
                                className="transition-colors hover:bg-gray-50"
                            >
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                    {index + 1}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                    {car.title}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                    {car.dealerId}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                    ${car.price.toLocaleString()}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <StatusUI status={car.carValidationStatus as any} />
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-center">
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
                className="group flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 hover:bg-gray-100"
            >
                {status === "Pending" ? (
                    <>
                        <span className="text-blue-600 group-hover:text-blue-700">
                            View
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-blue-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                ) : (
                    <>
                        <span className="text-green-600">Completed</span>
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                            <Check className="h-3 w-3 text-white" />
                        </div>
                    </>
                )}
            </button>
        </div>
    );
};

export default CarDataTable;
