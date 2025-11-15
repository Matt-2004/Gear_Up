"use client"

import Input from "@/components/Input";
import { Edit } from "@/components/SVGs";
import Image from "next/image";
import { useState } from "react";
import {useQuery} from "@tanstack/react-query";
import {getUserProfile} from "@/utils/FetchAPI";

const Page = () => {

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const { data, isLoading, isError } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
        staleTime: 5000,
        retry: false,
        enabled: true,
    });;

    if(isError) return <div>Data fetch error!</div>

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
            <div className="flex justify-center h-full w-full">
                <div className=" bg-background flex justify-center  shadow-sm shadow-gray-600 text-gray-200 p-8 rounded-xl mt-10">
                    <div className="">
                        <div className="flex justify-between">

                            <div className="flex items-center gap-4">
                                <Image src={data?.data.avatarUrl} alt={data?.data.name} width={200} height={200} className="rounded-full"></Image>
                                <div className="font-roboto font-medium space-y-2">
                                    <h1 className="text-2xl">{data?.data.name}</h1>
                                    <p className="bg-primary text-white rounded-lg px-2">{data?.data.role}</p>
                                </div>
                            </div>
                            {
                                isEdit ?
                                    <div className="flex gap-4">
                                        <button onClick={() => setIsEdit(false)} className="self-start  px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 border border-gray-600 hover:border-primary flex gap-4 items-center">
                                            Cancel
                                        </button>
                                        <button className="self-start  px-4 py-2 rounded-lg cursor-pointer bg-primary text-black flex gap-4 items-center">
                                            Save
                                        </button>
                                    </div> : <button onClick={() => setIsEdit(true)} className="self-start  px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 border border-gray-600 hover:border-primary flex gap-4 items-center"><Edit />Edit</button>
                            }

                        </div>
                        <div className="grid grid-cols-2  gap-4 space-x-2 space-y-4">
                            <Input type={"text"} value={data?.data.email} disabled={!isEdit}>
                                Email
                            </Input>
                            <Input type={"text"} value={data?.data.name} disabled={!isEdit}>
                                User Name
                            </Input>
                            <Input type={"text"} value={data?.data.role} disabled={!isEdit}>
                                Role
                            </Input>

                        </div>
                    </div>
                </div>
            </div>
        )

}

export default Page;