"use client";

import { usePathname, useRouter } from "next/navigation";
import { IKycRes, IKycSubmissions } from "@/app/types/kyc.types";

const ReviewBtn = ({ id }: { id: string }) => {
  const currentPath = usePathname();
  const router = useRouter();

  return (
    <button onClick={() => router.push(`${currentPath}/management/kyc/${id}`)}>
      View
    </button>
  );
};

const DataTable = ({ kyc }: { kyc: IKycRes }) => {
  return (
    <div className="overflow-x-auto mx-auto w-5/6  rounded-lg border border-gray-300">
      <table className=" min-w-full bg-white ">
        <thead className="bg-gray-100 ">
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b"
              scope="col"
            >
              No.
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b"
              scope="col"
            >
              ID
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b"
              scope="col"
            >
              Name
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b"
              scope="col"
            >
              Document Type
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b"
              scope="col"
            >
              Email
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b"
              scope="col"
            >
              Review
            </th>
          </tr>
        </thead>
        <tbody className={""}>
          {kyc.data.kycSubmissions.map(
            (submission: IKycSubmissions, index: number) => {
              return (
                <tr key={submission.id} className={""}>
                  <th
                    className=" text-left px-4 py-4 whitespace-nowrap text-sm text-gray-600"
                    scope="row"
                  >
                    {index + 1}
                  </th>

                  <td className=" text-left px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {submission.fullName}
                  </td>
                  <td className=" text-left px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {submission.id}
                  </td>
                  <td className=" text-left px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {submission.documentType}
                  </td>
                  <td className=" text-left px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {submission.email}
                  </td>
                  <td className=" text-left px-4 py-4 whitespace-nowrap text-sm text-gray-600">
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

export default DataTable;
