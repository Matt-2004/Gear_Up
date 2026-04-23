import { CarStatus } from "@/app/features/car/types/car.types";

export const getStatusColor = (status: CarStatus | string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-500 border-yellow-300";
    case "Approved":
      return "bg-green-100 text-green-500 border-green-300";
    case "Rejected":
      return "bg-red-100 text-red-500 border-red-300";
    default:
      return "bg-gray-100 text-gray-500 border-gray-300";
  }
};
