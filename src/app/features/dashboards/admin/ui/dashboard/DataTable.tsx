"use client";

import { IKycSubmissions } from "@/app/features/dashboards/dealer/types/kyc.types";
import StatusUI, { Status } from "@/app/shared/ui/StatusUI";
import { ArrowUpRight, Check, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { CarItems } from "@/app/features/car/types/car.types";
import { useAdminFilterContext } from "../../context/AdminFilterContext";
import { DashboardCarDTO } from "../../../dealer/types/dashboard-car/dashboard-car.dto";
import { timeFormat } from "@/app/shared/utils/timeFormat";

type Car = {
  type: "car";
  data: Omit<DashboardCarDTO, "thumbnailUrl">[];
};

type Kyc = {
  type: "kyc";
  data: IKycSubmissions[];
};

type DataTableProps = {
  data: Car | Kyc;
};

const DataTable = ({ data }: DataTableProps) => {
  console.log(data);

  if (data.type === "kyc") {
    return <KycDataTable data={data.data} />;
  }

  return <CarDataTable data={data.data} />;
};

const KycDataTable = ({ data }: { data: IKycSubmissions[] }) => {
  const { filter } = useAdminFilterContext();

  const filteredData = useMemo(() => {
    const searchValue = filter.searchData.trim().toLowerCase();

    return data.filter((submission) => {
      const matchesSearch =
        searchValue.length === 0 ||
        [
          submission.fullName,
          submission.email,
          submission.documentType,
          submission.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        filter.statusType === "All" || submission.status === filter.statusType;

      const matchesDocumentType =
        filter.category !== "kyc" ||
        filter.documentType === "All" ||
        submission.documentType === filter.documentType;

      return matchesSearch && matchesStatus && matchesDocumentType;
    });
  }, [data, filter]);

  const cols = ["No.", "Name", "Document Type", "Email", "Status", "Action"];

  return (
    <TableLayout cols={cols} isEmpty={filteredData.length === 0}>
      {filteredData.map((submission, index) => (
        <tr key={submission.id} className="transition-colors hover:bg-gray-50">
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
            <ReviewBtn
              type="kyc"
              status={submission.status}
              id={submission.id}
            />
          </td>
        </tr>
      ))}
    </TableLayout>
  );
};

const CarDataTable = ({
  data,
}: {
  data: Omit<DashboardCarDTO, "thumbnailUrl">[];
}) => {
  const { filter } = useAdminFilterContext();

  const filteredData = useMemo(() => {
    const searchValue = filter.searchData.trim().toLowerCase();

    return data.filter((car) => {
      const matchesSearch =
        searchValue.length === 0 ||
        [car.title, car.id, car.price]
          .join(" ")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        filter.statusType === "All" ||
        car.carValidationStatus === filter.statusType;

      return matchesSearch && matchesStatus;
    });
  }, [data, filter]);

  const cols = [
    "No.",
    "Car Name",
    "Dealer / ID",
    "Price",
    "Submitted At",
    "Action",
  ];

  return (
    <TableLayout cols={cols} isEmpty={filteredData.length === 0}>
      {filteredData.map((car, index) => (
        <tr
          key={car.id}
          className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} transition-colors hover:bg-gray-50`}
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

          <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
            {timeFormat(car.createdAt, "Hour")}
          </td>

          <td className="px-6 py-4 text-center whitespace-nowrap">
            <ReviewBtn
              type="car"
              status={car.carValidationStatus as Status}
              id={car.id}
            />
          </td>
        </tr>
      ))}
    </TableLayout>
  );
};

const TableLayout = ({
  cols,
  isEmpty,
  children,
}: {
  cols: string[];
  isEmpty: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-primary-50">
            <tr>
              {cols.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {isEmpty ? (
              <tr>
                <td colSpan={cols.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 rounded-full bg-gray-100 p-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900">
                      No results found
                    </h3>

                    <p className="text-sm text-gray-500">
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReviewBtn = ({
  id,
  status,
  type,
}: {
  id: string;
  status: Status;
  type: "kyc" | "car";
}) => {
  const currentPath = usePathname();
  const router = useRouter();

  const handleClick = () => {
    if (type === "kyc") {
      router.push(`${currentPath}/management/kyc/${id}`);
      return;
    }

    router.push(`${currentPath}/cars/${id}`);
  };

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={handleClick}
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
