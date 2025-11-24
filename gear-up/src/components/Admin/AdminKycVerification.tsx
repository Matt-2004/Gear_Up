"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllKyc } from "@/utils/FetchAPI";
import DataTable from "@/components/Admin/DataTable";
import { kycFilter } from "@/utils/Filter";
import {
  CircleCheck,
  CircleX,
  Clock,
  LayoutGrid,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { IKycRes } from "@/app/types/kyc.types";
import clsx from "clsx";

const AdminKycVerification = () => {
  // const [getStatus, setGetStatus] = useState<string>("");

  const { data: kyc, isLoading } = useQuery({
    queryKey: ["kycVerification"],
    queryFn: getAllKyc,
    retry: false,
    enabled: true,
  });

  // const { data: kycWithStatus } = useQuery({
  //   queryKey: ["kycWithStatus", getStatus],
  //   queryFn: () => getKycWithStatus(getStatus),
  //   enabled: getStatus.length < 0,
  // });

  if (isLoading) {
    return <div>Loading</div>;
  }

  /*
   * TODO
   *  -> Need to write the fetching function for KycDataWithStatus
   *  -> Implement in Each UI
   *0
   * */

  if (kyc) {
    return (
      <div className={"w-full flex justify-center"}>
        <div className={"w-9/10 space-y-8"}>
          <div id={"header"} className={"pt-4"}>
            <h1 className={"text-2xl font-semibold"}>Document Verification</h1>
            <h3 className={"text-gray-300 text-sm"}>
              Review and verify user-submitted documents
            </h3>
          </div>
          <div
            id={"Records"}
            className={"w-full flex flex-col justify-between gap-4"}
          >
            <div className={"flex justify-between"}>
              <StatusCountComponent status={"All"} kyc={kyc.data} />
              <StatusCountComponent status={"Pending"} kyc={kyc.data} />
              <StatusCountComponent status={"Approved"} kyc={kyc.data} />
              <StatusCountComponent status={"Rejected"} kyc={kyc.data} />
            </div>
            <div
              className={
                "mt-6 w-full h-[68px] rounded-sm bg-background shadow-sm shadow-gray-600 border-gray-800 flex justify-between items-center px-2"
              }
            >
              <div className={"flex w-2/3 gap-2"}>
                <div
                  className={
                    "w-1/2 flex items-center gap-4 border border-gray-600  rounded-sm p-2"
                  }
                >
                  <Search className={"w-5 h-5"} />
                  <input
                    className={"w-full focus:outline-none"}
                    type={"text"}
                    placeholder={"Search by name, ID, or document type"}
                  />
                </div>

                <div
                  className={"text-white border p-2 rounded-sm border-gray-600"}
                >
                  <select
                    name="doc-type"
                    id="all-doc-type"
                    className={"focus:outline-none"}
                    defaultValue={""}
                  >
                    <option value={""} disabled hidden>
                      All Document Type
                    </option>
                    <option value="Passport">Passport</option>
                    <option value="NationID">Nation ID</option>
                    <option value="DriverLicense">Driver License</option>
                    <option value="UtilityBill">Utility Bill</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div
                  className={"text-white border p-2 rounded-sm border-gray-600"}
                >
                  <select
                    name="doc-type"
                    id="all-doc-type"
                    className={"focus:outline-none"}
                    defaultValue={""}
                  >
                    <option value={""} disabled hidden>
                      All Status
                    </option>
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div
                className={
                  "bg-primary px-8 py-2 rounded-sm mr-2 flex gap-2 cursor-pointer hover:bg-primary-btn-hover"
                }
              >
                <SlidersHorizontal />
                Filter
              </div>
            </div>
            <div className={"w-full"}>
              <DataTable kyc={kyc.data} />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const StatusCountComponent = ({
  status,
  kyc,
}: {
  status: string;
  kyc: IKycRes;
}) => {
  return (
    <div
      id={status}
      className={clsx(
        status === "Approved" && "bg-[#DCFCE7]",
        status === "All" && "bg-[#DBEAFE]",
        status === "Pending" && "bg-[#FFEDD5]",
        status === "Rejected" && "bg-[#FEE2E2]",
        "w-2/10 h-40 text-black flex flex-col justify-center p-4 gap-1 shadow-sm shadow-gray-600 border-gray-800 rounded-sm",
      )}
    >
      <div
        className={clsx(
          status === "Approved" && "bg-[#16A34A]",
          status === "All" && "bg-[#2563EB]",
          status === "Pending" && "bg-[#EA580C]",
          status === "Rejected" && "bg-[#DC2626]",
          "w-10 h-10 items-center flex justify-center rounded-lg",
        )}
      >
        {(status === "Pending" && <Clock className={"text-[#FFEDD5]"} />) ||
          (status === "Approved" && (
            <CircleCheck className={"text-[#DCFCE7]"} />
          )) ||
          (status === "Rejected" && <CircleX className={"text-[#FEE2E2]"} />) ||
          (status === "All" && <LayoutGrid className={"text-[#DBEAFE]  "} />)}
      </div>
      <h2 className={"text-3xl font-semibold"}>
        {status === "All" ? kyc.data.totalCount : kycFilter(kyc, status)}
      </h2>
      <h1 className={"text-sm"}>{status} Reviews</h1>
    </div>
  );
};

export default AdminKycVerification;
