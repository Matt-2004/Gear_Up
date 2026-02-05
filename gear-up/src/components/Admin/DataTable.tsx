"use client";

import { IKycSubmissions } from "@/app/types/kyc.types";
import StatusUI, { Status } from "@/components/Common/StatusUI";
import { useKycFilterContext } from "@/Context/AdminKycFilterContext";
import { ArrowUpRight, Check, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DataTable = ({ kyc }: { kyc: IKycSubmissions[] }) => {
  const { searchData, statusType, documentType } = useKycFilterContext();
  const [filterData, setFilterData] = useState<IKycSubmissions[]>([]);

  useEffect(() => {
    if (!kyc) return;
    setFilterData(
      kyc.filter(
        (prev) =>
          (statusType === "All" || prev.status === statusType) &&
          (documentType === "All" || prev.documentType === documentType) &&
          prev.fullName.toLowerCase().includes(searchData.toLowerCase()),
      ),
    );
  }, [searchData, statusType, documentType, kyc]);

  return (
    <div className="overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-primary-50">
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
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
            >
              Document Type
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
            >
              Email
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
          ) : (
            filterData.map((submission: IKycSubmissions, index: number) => (
              <tr
                key={submission.id}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {submission.fullName}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {submission.documentType}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {submission.email}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <StatusUI status={submission.status} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  <ReviewBtn status={submission.status} id={submission.id} />
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

export default DataTable;
