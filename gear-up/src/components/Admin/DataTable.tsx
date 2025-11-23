"use client";

import { usePathname, useRouter } from "next/navigation";
import { IKycRes, IKycSubmissions } from "@/app/types/kyc.types";
import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import StatusUI from "@/components/StatusUI";

const DataTable = ({ kyc }: { kyc: IKycRes }) => {
  return (
    <div className="overflow-x-auto mx-auto   rounded-sm border border-gray-700">
      <table className=" min-w-full bg-background text-white ">
        <thead className="bg-background ">
          <tr>
            <th
              className="px-4 py-3 border-r border-gray-700 text-center text-xs font-medium text-white uppercase tracking-wider border-b "
              scope="col"
            >
              No.
            </th>
            <th
              className="px-4 py-3 border-r border-gray-700 text-center text-xs font-medium text-white uppercase tracking-wider border-b "
              scope="col"
            >
              Name
            </th>
            <th
              className="px-4 py-3 border-r border-gray-700 text-center text-xs font-medium text-white uppercase tracking-wider border-b "
              scope="col"
            >
              ID
            </th>
            <th
              className="px-4 py-3 border-r border-gray-700 text-center text-xs font-medium text-white uppercase tracking-wider border-b "
              scope="col"
            >
              Document Type
            </th>
            <th
              className="px-4 py-3 border-r border-gray-700 text-center text-xs font-medium text-white uppercase tracking-wider border-b "
              scope="col"
            >
              Email
            </th>
            <th
              className="px-4 py-3 border-r border-gray-700 text-center text-xs font-medium text-white uppercase tracking-wider border-b "
              scope="col"
            >
              Status
            </th>
            <th
              className="px-4 py-3 border-r border-gray-700 text-center text-xs font-medium text-white uppercase tracking-wider border-b "
              scope="col"
            >
              Review
            </th>
          </tr>
        </thead>
        <tbody className={"h-full"}>
          {kyc.data.kycSubmissions.map(
            (submission: IKycSubmissions, index: number) => {
              return (
                <tr key={submission.id} className={"border-b border-gray-700"}>
                  <th
                    className=" text-center  py-2.5 border-r border-gray-700 whitespace-nowrap text-sm "
                    scope="row"
                  >
                    {index + 1}
                  </th>

                  <td className=" text-center  py-2.5 border-r border-gray-700 whitespace-nowrap text-sm ">
                    {submission.fullName}
                  </td>
                  <td className=" text-center px-4 py-2.5 border-r border-gray-700 whitespace-nowrap text-sm ">
                    <h1 className={"w-20 truncate"}>{submission.id}</h1>
                  </td>
                  <td className=" text-center  py-2.5 border-r border-gray-700 whitespace-nowrap text-sm ">
                    {submission.documentType}
                  </td>
                  <td className=" text-center  py-2.5 border-r border-gray-700 whitespace-nowrap text-sm ">
                    {submission.email}
                  </td>
                  <td
                    className={clsx(
                      "text-center h-full border-r border-gray-700 whitespace-nowrap text-sm",
                    )}
                  >
                    <div className={"flex justify-center"}>
                      <StatusUI status={submission.status} />
                    </div>
                  </td>
                  <td className=" text-center  py-2.5 border-r border-gray-700 whitespace-nowrap text-sm ">
                    <ReviewBtn id={submission.id} />
                  </td>
                </tr>
              );
            },
          )}
        </tbody>
      </table>
    </div>
  );
};

const ReviewBtn = ({ id }: { id: string }) => {
  const currentPath = usePathname();
  const router = useRouter();

  return (
    <div className={"flex justify-center"}>
      <button
        onClick={() => router.push(`${currentPath}/management/kyc/${id}`)}
        className={
          "text-white flex items-center hover:underline hover:underline-offset-1 cursor-pointer"
        }
      >
        <h1>View</h1>
        <ArrowUpRight className={"w-4 h-4"} />
      </button>
    </div>
  );
};

export default DataTable;
