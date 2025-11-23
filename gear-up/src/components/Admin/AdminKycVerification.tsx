"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllKyc, getKycWithStatus } from "@/utils/FetchAPI";
import DataTable from "@/components/Admin/DataTable";
import { useState } from "react";
import { kycFilter } from "@/utils/Filter";
import { LayoutGrid } from "lucide-react";
import { IKycRes } from "@/app/types/kyc.types";

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
    console.log("Kyc count", kyc?.data.data.totalCount);
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
            className={"w-full flex flex-col justify-between gap-10"}
          >
            <div className={"flex justify-between"}>
              <StatusCountComponent status={"All"} kyc={kyc.data} />
              <StatusCountComponent status={"Pending"} kyc={kyc.data} />
              <StatusCountComponent status={"Approved"} kyc={kyc.data} />
              <StatusCountComponent status={"Rejected"} kyc={kyc.data} />
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
      className={
        "w-2/10 h-40 text-white flex flex-col justify-center p-4 gap-1 bg-background shadow-sm shadow-gray-600 border-gray-800 rounded-lg"
      }
    >
      <div
        className={
          "bg-[#DBEAFE] w-10 h-10 items-center flex justify-center rounded-lg"
        }
      >
        <LayoutGrid className={"text-[#2563EB]  "} />
      </div>
      <h2 className={"text-3xl font-semibold"}>
        {status === "All" ? kyc.data.totalCount : kycFilter(kyc, status)}
      </h2>
      <h1 className={"text-sm"}>Pending Reviews</h1>
    </div>
  );
};

export default AdminKycVerification;
