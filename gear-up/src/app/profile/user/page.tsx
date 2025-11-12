"use client"

import Input from "@/components/Input";
import { useProfile } from "@/components/Navbar/useProfile";
import { Edit } from "@/components/SVGs";
import Image from "next/image";
import { useState } from "react";

const Page = () => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const { data, isLoading } = useProfile();
    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }
    if (data) {
        // Later, Must add "Phone Number, Date of birth, Password"
        const { email, name, avatarUrl, role } = data.data
        const datas = Object.entries(data.data)
        return (
            <div className="flex justify-center h-full w-full">
                <div className=" bg-background flex justify-center  shadow-sm shadow-gray-600 text-gray-200 p-8 rounded-xl mt-10">
                    <div className="">
                        <div className="flex justify-between">

                            <div className="flex items-center gap-4">
                                <Image src={avatarUrl} alt={name} width={200} height={200} className="rounded-full"></Image>
                                <div className="font-roboto font-medium space-y-2">
                                    <h1 className="text-2xl">{name}</h1>
                                    <p className="bg-primary text-white rounded-lg px-2">{role}</p>
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
                            {datas.map((d) => (
                                d[1] !== null &&
                                <Input type="text" value={d[1]} disabled={!isEdit}>
                                    {d[0].charAt(0).toUpperCase() + d[0].substring(1, d[0].length)}
                                </Input>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default Page;