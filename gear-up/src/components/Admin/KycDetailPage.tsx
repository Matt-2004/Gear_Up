"use client"

import {useQuery} from "@tanstack/react-query";
import {getKycById} from "@/utils/FetchAPI";
import clsx from "clsx";
import Image from "next/image";

interface  IpersonalInfo{
    "User ID": string;
    "Full Name": string;
    Email: string;
    "Date Of Birth": string | undefined;
    "Phone Number": string | undefined;
    "Document Type": string;
}

const KycDetailPage = ({id}: {id: string}) => {


    // type UserStatus = "Pending" | "Approved" | "Rejected";


    const { data: detail } = useQuery({
        queryKey: ["KYC", id],
        queryFn: () => getKycById(id),
        staleTime: 5000,
        retry: false,
        enabled: true,
    });

    const PersonalInfo: IpersonalInfo = {
        "User ID": detail?.data.data.userId,
        "Full Name": detail?.data.data.fullName,
        "Email": detail?.data.data.email,
        "Date Of Birth": detail?.data.data.dateOfBirth,
        "Phone Number": detail?.data.data.phoneNumber,
        "Document Type": detail?.data.data.documentType,
    }

    const DocumentInfo = {

        "Document Urls": detail?.data.data.documentUrls.map((data: string) => [data] ),
        "Selfie Url": detail?.data.data.selfieUrl,
    }

    /*
    *  Pending - Orange
    *  Approved - Green
    *  Rejected - Red
    * */



    if(detail) {

        return (
            <div className={" w-full  h-screen flex items-center justify-center"}>
                <div className={"w-7/8 h-7/8 grid gap-4 grid-flow-col grid-rows-4 grid-col-2"}>
                    <div className={" w-full col-span-2 row-span-4 bg-white border rounded-lg"}>
                        <div className={"flex flex-col  justify-center p-4"}>
                            <h1 className={"text-lg py-2 text-[#6B7280]"}>Personal Information</h1>
                            <div className={"grid grid-flow-col grid-cols-2 grid-rows-3 gap-4"}>

                            {Object.entries(PersonalInfo).map((item, i: number) => {
                                // userId, fullName, email, PhoneNumber, dateOfBirth, submittedAt
                                // documentUrls, selfieUrl
                                return (
                                    <div key={i} className={""}>
                                        <label className={"text-[#6B7280] font-normal"}>{item[0]}</label>
                                        <div className={clsx(item[1] === "" ? "text-red-400" : "text-black", "font-medium")}>{item[1] === "" ? "No Data" : item[1]}</div>
                                    </div>
                                );
                            })}
                            </div>
                        </div>
                        <div className={"flex flex-col  justify-center p-4"}>
                            <h1 className={"text-lg font-semibold py-2 "}>Documents Review</h1>
                            <div className={"w-full flex justify-between gap-7"}>
                                {Object.entries(DocumentInfo).map((item, i: number) => {

                                    return (
                                        <div key={i} className={"w-1/2"}>
                                            { item[0] === "Document Urls"


                                                ? <div className={"flex flex-col gap-2"}>
                                                    <h1>KYC documents</h1>
                                                    <div className={"w-full h-80 flex justify-center border rounded-lg p-4 border-gray-200 shadow-sm"}>

                                                        {item[1].map((items: string, i: number) => {

                                                        return (
                                                                <Image className={"object-contain max-h-full max-w-full"} key={i} src={items[i]} alt={items[0]} width={300} height={200}/>
                                                        )
                                                        })}
                                                    </div>
                                                </div>
                                                : <div key={i} className={"flex flex-col gap-2"}>
                                                    <label className={" font-normal"}>{item[0]}</label>
                                                    <div className={"w-full h-80 flex justify-center border rounded-lg p-4 border-gray-200 shadow-sm"}>
                                                    <Image className={"object-contain max-h-full max-w-full"} src={item[1]} alt={item[0]} width={300} height={200}/>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className={"flex gap-4 justify-end p-4"}>
                            <button className={"px-4 py-2 border rounded-lg bg-red-500 text-white cursor-pointer"}>Rejected</button>
                            <button className={"px-4 py-2 border rounded-lg bg-green-500 text-white cursor-pointer"}>Approved</button>
                        </div>
                    </div>
                    <div className={" rounded-lg   bg-white border p-4"}>01</div>
                    <div className={" rounded-lg   bg-white border p-4 "}>0133333</div>
                    <div className={" rounded-lg  bg-white border p-4"}>03</div>
                    <div className={" rounded-lg   bg-white border p-4"}>04</div>

                </div>

            </div>
        )
    }
}
export default KycDetailPage;