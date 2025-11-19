"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getKycById, updateKycByAdmin } from "@/utils/FetchAPI";
import clsx from "clsx";
import Image from "next/image";
import { ArrowLeft, Check, FileCheck, UserCheck, X } from "lucide-react";
import { timeFormat } from "@/utils/timeFormat";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { IKycUpdateByAdmin } from "@/app/types/kyc.types";

export interface KycResponse {
  isSuccess: boolean;
  message: string;
  data: KycData;
  status: number;
}

export interface KycData {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string; // can be empty string
  dateOfBirth: string; // ISO date string, e.g., "0001-01-01"
  status: "Pending" | "Approved" | "Rejected"; // based on your app's possible values
  documentType: string;
  documentUrls: string[]; // array of image URLs
  selfieUrl: string;
  submittedAt: string; // ISO datetime string
  rejectionReason: string | null; // nullable
}

const KycDetailPage = ({ id }: { id: string }) => {
  // type     UserStatus = "Pending" | "Approved" | "Rejected";
  const [text, setText] = useState("");
  const [kycData, setKycData] = useState<KycResponse>();

  useQuery({
    queryKey: ["KYC", id],
    queryFn: async () => {
      const res = await getKycById(id);
      setKycData(res.data);
      return res;
    },
    staleTime: 5000,
    retry: false,
    enabled: true,
  });

  /*
   *  Pending - Orange
   *  Approved - Green
   *  Rejected - Red
   * */

  if (kycData) {
    return (
      <div
        className={" w-full  h-full flex flex-col items-center justify-center"}
      >
        <div className={"w-8/10 h-full"}>
          <PageHeader />
          <div
            className={
              " w-full h-7/8 grid gap-4 grid-flow-col grid-rows-4 grid-col-2"
            }
          >
            <PersonalInfoComponent kycData={kycData} text={text} />
            <div
              className={
                " rounded-lg w-96   bg-foreground border border-gray-600 "
              }
            >
              01
            </div>
            <RejectReasonComponent text={text} setText={setText} />
            <HistoryComponent
              submittedAt={kycData.data.submittedAt ?? "12345"}
            />
          </div>
        </div>
      </div>
    );
  }
};

const PageHeader = () => {
  const router = useRouter();
  return (
    <div className={"py-4 pr-4 flex gap-6 items-center"}>
      <div
        className={"p-2 rounded-full cursor-pointer hover:bg-gray-600"}
        onClick={() => router.back()}
      >
        <ArrowLeft className={"text-gray-300  w-7 h-7 "} />
      </div>
      <div className={"flex flex-col"}>
        <h1 className={"text-white font-semibold text-2xl"}>
          User Detail Review
        </h1>
        <h3 className={"text-gray-300"}>
          Review and approve user verification
        </h3>
      </div>
    </div>
  );
};

interface PersonalInfoComponentProps {
  kycData: KycResponse;
  text: string;
}

const PersonalInfoComponent = ({
  kycData,
  text,
}: PersonalInfoComponentProps) => {
  return (
    <div
      className={
        " w-full col-span-2 row-span-4 bg-foreground border rounded-lg p-4"
      }
    >
      <div className={"flex flex-col  justify-center  mb-4"}>
        <h1
          className={
            "text-xl py-2 font-semibold text-white flex gap-2 items-center mb-4"
          }
        >
          <UserCheck className={"text-gray-300"} />
          Personal Information
        </h1>
        <div className={"grid grid-flow-col grid-cols-2 grid-rows-3 gap-4"}>
          {Object.entries(kycData.data).map((item, i: number) => {
            // userId, fullName, email, PhoneNumber, dateOfBirth, submittedAt
            // documentUrls, selfieUrl
            if (
              item[0] === "id" ||
              item[0] === "email" ||
              item[0] === "fullName" ||
              item[0] === "phoneNumber" ||
              item[0] === "dateOfBirth" ||
              item[0] === "status"
            ) {
              return (
                <div key={i} className={""}>
                  <label className={"text-gray-300  font-normal"}>
                    {item[0].charAt(0).toUpperCase() + item[0].slice(1)}
                  </label>
                  <div
                    className={clsx(
                      item[1] === "" ? "text-red-400" : "text-white",
                      "text-lg font-medium w-[200px]",
                      item[1] === "Pending"
                        ? "text-yellow-500 bg-yellow-100 text-center rounded-full"
                        : "text-white",
                    )}
                  >
                    {item[1] === "" ? "No Data" : item[1]}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
      <div id={"spacer"} className={"h-1 border-b border-gray-600 my-8"} />
      <div className={"flex flex-col text-white  justify-center"}>
        <h1
          className={"text-xl font-semibold py-2 flex gap-2 items-center mb-4"}
        >
          <FileCheck className={"text-gray-300"} />
          Documents Review
        </h1>
        <div className={"w-full n gap-7"}>
          <div className={"w-full gap-4 flex justify-between"}>
            <div className={"flex flex-col gap-2"}>
              <h1>KYC documents</h1>
              <div
                className={
                  "w-full h-80 flex justify-between border rounded-lg p-4 border-gray-400 shadow-sm"
                }
              >
                {kycData.data.documentUrls.map((items: string, i: number) => {
                  console.log(items);
                  if (items) {
                    return (
                      <div key={i} className={"flex justify-center gap-2"}>
                        <Image
                          className={"object-contain max-h-full max-w-full"}
                          key={i}
                          src={items}
                          alt={"Document-image"}
                          width={450}
                          height={400}
                        />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            <div className={"flex flex-col gap-2"}>
              <label className={" font-normal"}>Selfie Image</label>
              <div
                className={
                  "w-80 h-80 flex justify-center border rounded-lg p-4 border-gray-400 shadow-sm"
                }
              >
                <Image
                  className={"object-contain max-h-full max-w-full"}
                  src={kycData.data.selfieUrl}
                  alt={"selfie-image"}
                  width={300}
                  height={300}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={"flex gap-4 justify-end  my-6"}>
        <RejectButton
          id={kycData.data.id}
          data={{ status: "Rejected", rejectionReason: text }}
        />
        <ApprovedButton
          id={kycData.data.id}
          data={{ status: "Approved", rejectionReason: text }}
        />
      </div>
    </div>
  );
};

interface IDecision {
  id: string;
  data: IKycUpdateByAdmin;
}

const RejectButton = ({ id, data }: IDecision) => {
  const mutation = useMutation({
    mutationFn: async (params: { id: string; data: IKycUpdateByAdmin }) =>
      await updateKycByAdmin(data, id),
    onSuccess: () => console.log("Successfully Rejected!"),
  });

  const onSubmit = () => {
    mutation.mutate({
      id: id,
      data: {
        status: data.status,
        rejectionReason: data.rejectionReason,
      },
    });
  };
  return (
    <button
      className={
        "px-4 py-2 border border-background rounded-lg bg-red-600 text-white cursor-pointer flex gap-2 items-center"
      }
      onClick={onSubmit}
    >
      <X />
      Reject
    </button>
  );
};

const ApprovedButton = ({ id, data }: IDecision) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (params: { id: string; data: IKycUpdateByAdmin }) =>
      await updateKycByAdmin(data, id),
    onSuccess: (data) => {
      console.log("Successfully approved");
      console.log("return data from onSuccess:: ", data);
      queryClient.invalidateQueries({ queryKey: ["KYC"] });
    },
  });

  const onSubmit = () => {
    mutation.mutate({
      id: id,
      data: {
        status: data.status,
        rejectionReason: data.rejectionReason,
      },
    });
  };
  return (
    <button
      className={
        "px-4 py-2 border border-background rounded-lg bg-green-600 text-white cursor-pointer flex gap-2 items-center"
      }
      onClick={onSubmit}
    >
      <Check />
      Approve
    </button>
  );
};

interface ITextArea {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
}

const RejectReasonComponent = ({ text, setText }: ITextArea) => {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const newWords = newValue.trim().split(/\s+/).filter(Boolean);

    // CASE 1: User is deleting or reducing text → ALWAYS ALLOW
    if (newValue.length < text.length) {
      setText(newValue);
      return;
    }

    // CASE 2: New words <= max → ALLOW
    if (newWords.length <= 150) {
      setText(newValue);
      return;
    }
  };
  return (
    <div
      className={
        " rounded-lg w-96 row-span-2  bg-foreground border border-gray-600   text-white p-4 flex flex-col gap-2"
      }
    >
      <h1 className={"text-xl font-semibold"}>Reject Reasons</h1>
      <textarea
        value={text}
        onChange={handleChange}
        className={
          "border-gray-600 border h-full w-full  p-4 rounded-md bg-gray-700 placeholder:text-gray-300"
        }
        name={"reject-textarea"}
        id={"reject-textarea"}
        placeholder={"Type your message here..."}
      ></textarea>
      <div className={"flex justify-between"}>
        <label className={"text-gray-400 "}>{wordCount} /150 words </label>
        <button className={"text-blue-400 cursor-pointer"}>Save Draft</button>
      </div>
    </div>
  );
};

const HistoryComponent = ({ submittedAt }: { submittedAt: string }) => {
  return (
    <div
      className={
        " rounded-lg w-96  bg-foreground border border-gray-600 text-white p-4 flex flex-col gap-4"
      }
    >
      <h1 className={"text-xl font-semibold"}>History</h1>
      <div className={"flex gap-4"}>
        <div className={"h-full w-1 bg-yellow-500"} />
        <div>
          <h2 className={"font-semibold"}>Initial Submission</h2>
          <h3 className={"text-sm text-gray-400"}>{timeFormat(submittedAt)}</h3>
        </div>
      </div>
    </div>
  );
};

export default KycDetailPage;
