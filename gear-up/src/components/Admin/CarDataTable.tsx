"use client";

import { CarItems } from "@/app/types/car.types";
import { useCarFilterContext } from "@/Context/AdminCarFilterContext";
import { filterCars } from "@/utils/CarFilter";
import { Calendar, Car, Eye, Fuel, Gauge } from "lucide-react";
import Link from "next/link";

const CarDataTable = ({ cars }: { cars: CarItems[] }) => {
    const { filter } = useCarFilterContext();
    const filteredCars = filterCars(
        cars,
        filter.searchData,
        filter.statusType,
        filter.conditionType,
        filter.fuelType
    );

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "approved":
                return "bg-green-100 text-green-800 border-green-300";
            case "pending":
                return "bg-orange-100 text-orange-800 border-orange-300";
            case "rejected":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const getConditionColor = (condition: string) => {
        return condition.toLowerCase() === "new"
            ? "bg-blue-50 text-blue-700"
            : "bg-gray-50 text-gray-700";
    };

    if (filteredCars.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <Car className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No cars found
                </h3>
                <p className="text-gray-600 text-center">
                    Try adjusting your filters to see more results
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Car Details
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Specifications
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Condition
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCars.map((car) => (
                        <tr
                            key={car.id}
                            className="hover:bg-gray-50 transition-colors duration-150"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    {car.carImages && car.carImages[0] ? (
                                        <img
                                            src={car.carImages[0].url}
                                            alt={car.title}
                                            className="h-16 w-24 rounded-lg object-cover border-2 border-gray-200"
                                        />
                                    ) : (
                                        <div className="h-16 w-24 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                                            <Car className="h-8 w-8 text-gray-400" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-gray-900">{car.title}</p>
                                        <p className="text-sm text-gray-600">
                                            {car.make} {car.model}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">ID: {car.id.slice(0, 8)}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span>{car.year}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Fuel className="h-4 w-4 text-gray-400" />
                                        <span>{car.fuelType}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Gauge className="h-4 w-4 text-gray-400" />
                                        <span>{car.mileage.toLocaleString()} km</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(
                                        car.carCondition
                                    )}`}
                                >
                                    {car.carCondition}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <p className="text-lg font-bold text-gray-900">
                                    ${car.price.toLocaleString()}
                                </p>
                            </td>
                            <td className="px-6 py-4">
                                <span
                                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                                        car.carValidationStatus
                                    )}`}
                                >
                                    {car.carValidationStatus}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <Link
                                    href={`/profile/admin/cars/${car.id}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                                >
                                    <Eye className="h-4 w-4" />
                                    Review
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CarDataTable;
