"use client";

import Input from "@/components/Common/Input";
import { Edit } from "@/components/Common/SVGs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/utils/FetchAPI";
import { UserData } from "@/app/types/user.types";

const Page = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDataChange, setIsDataChange] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<{
    email: string;
    name: string;
    role: string;
  }>({
    email: "",
    name: "",
    role: "",
  });
  const [userData, setUserData] = useState<UserData>({
    id: "",
    provider: null,
    username: "",
    email: "",
    name: "",
    role: "Customer",
    avatarUrl: "",
  });


  const { data, isLoading, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    staleTime: 5000,
    retry: false,
    enabled: true,
  });




  if (isError) return <div>Data fetch error!</div>;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    setUserData(data?.data!);
    setUserInput({
      email: data?.data.email!,
      name: data?.data.name!,
      role: data?.data.role!,
    });
  }, [])

  useEffect(() => {
    if (userInput.email !== userData.email || userInput.name !== userData.name || userInput.role !== userData.role) {
      setIsDataChange(true);
    } else {
      setIsDataChange(false);
    }
  }, [userInput])

  // data and user input match check

  return (
    <div className="flex justify-center h-full w-full">
      <div className="w-[95%] h-screen md:h-full bg-background flex justify-center  shadow-sm shadow-gray-600 text-gray-200 md:p-8 p-4 rounded-xl mt-10">
        <div className="">
          <div className="flex justify-between">
            <div className="flex items-end gap-4">
              <Image
                src={data?.data.avatarUrl}
                alt={data?.data.name}
                width={200}
                height={200}
                className="rounded-full h-24 w-24 md:w-36 md:h-36 object-cover"
              ></Image>
              <div className="font-roboto font-medium space-y-1">
                <h1 className="md:text-2xl text-xl">{data?.data.name}</h1>
                <p className=" text-primary rounded-sm ">
                  # {data?.data.role}
                </p>
              </div>
            </div>

          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1  gap-2 lg:gap-4 space-x-2 mt-4">
            <Input type={"text"} value={userInput.email} placeholder={userInput.email} onChange={(e) => setUserInput({
              email: e.currentTarget.value,
              name: userInput.name,
              role: userInput.role,
            })} disabled={!isEdit}>
              Email
            </Input>
            <Input type={"text"} value={userInput.name} placeholder={userInput.name} onChange={(e) => setUserInput({
              email: userInput.email,
              name: e.currentTarget.value,
              role: userInput.role
            })} disabled={!isEdit}>
              User Name
            </Input>
            <Input type={"text"} value={userInput.role} placeholder={userInput.role} onChange={(e) => setUserInput({
              email: userInput.email,
              name: userInput.name,
              role: e.currentTarget.value
            })} disabled={!isEdit}>
              Role
            </Input>
          </div>
          <div className="flex justify-end mt-6">

            {isEdit ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEdit(false)}
                  className="self-start  px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 border border-gray-600 hover:border-primary flex gap-4 items-center"
                >
                  Cancel
                </button>
                <button disabled={!isDataChange} className="self-start disabled:bg-gray-500 px-4 py-2 rounded-lg cursor-pointer bg-primary text-black flex gap-4 items-center">
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="self-start  px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-700 border border-gray-600 hover:border-primary flex gap-2 items-center"
              >
                <Edit />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
