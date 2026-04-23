"use client";

import { IKycSubmissions } from "@/types/kyc.types";
import StatusUI, { Status } from "@/components/Common/StatusUI";
import { useKycFilterContext } from "@/Context/AdminKycFilterContext";
import { ArrowUpRight, Check, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminCarData } from "@/types/admin-car-approval.types";
import { CarItems } from "@/types/car.types";
import { useCarFilterContext } from "@/Context/AdminCarFilterContext";

type Car = {
  type: "car";
  data: AdminCarData[];
};

type Kyc = {
  type: "kyc";
  data: IKycSubmissions[];
};

const DataTable = ({ data }: { data: Car | Kyc }) => {
  const { searchData, statusType, documentType } = useKycFilterContext();
  const [kycFilterData, setKycFilterData] = useState<IKycSubmissions[]>([]);
  const [carFilterData, setCarFilterData] = useState<AdminCarData[]>([]);

  useEffect(() => {
    if (!data) return;

    if (data.type == "kyc") {
      setKycFilterData(
        data.data.filter(
          (prev) =>
            (statusType === "All" || prev.status === statusType) &&
            (documentType === "All" || prev.documentType === documentType) &&
            prev.fullName.toLowerCase().includes(searchData.toLowerCase()),
        ),
      );
    } else {
      setCarFilterData(
        data.data.filter(
          (car) =>
            // Add your filter logic here, for example:
            car.title.toLowerCase().includes(searchData.toLowerCase()),
          // You can extend this filter with more conditions as needed
        ),
      );
    }
  }, [searchData, statusType, documentType, data]);

  const kycCols = ["No.", "Name", "Document Type", "Email", "Status", "Action"];
  const carCols = [
    "No.",
    "Car Name",
    "Dealer Name",
    "Price",
    "Status",
    "Action",
  ];
  const cols = data.type === "kyc" ? kycCols : carCols;

  const filterData = data.type === "kyc" ? kycFilterData : carFilterData;

  return (
    <div className="overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-primary-50">
          <tr>
            {cols.map((col) => (
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {filterData.length === 0 ? (
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
          ) : data.type === "kyc" ? (
            kycFilterData.map((submission, index: number) => (
              <tr key={index} className="transition-colors hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                  {submission.fullName}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                  {submission.documentType}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                  {submission.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusUI status={submission.status} />
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <ReviewBtn status={submission.status} id={submission.id} />
                </td>
              </tr>
            ))
          ) : (
            carFilterData.map((car: CarItems, index: number) => (
              <tr key={index} className="transition-colors hover:bg-gray-50">
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
                  <ReviewBtn
                    status={car.carValidationStatus as Status}
                    id={car.id}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const ReviewBtn = ({ id, status }: { id: string; status: Status }) => {
  const currentPath = usePathname();
  const router = useRouter();

  return (
    <div className="flex justify-center">
      <button
        onClick={() => router.push(`${currentPath}/management/kyc/${id}`)}
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
            <span className="text-primary">Completed</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
              <Check className="h-3 w-3 text-white" />
            </div>
          </>
        )}
      </button>
    </div>
  );
};

export default DataTable;
