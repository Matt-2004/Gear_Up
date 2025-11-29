"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getFakeCars } from "@/utils/FetchAPI";
import { Car } from "@/app/types/car.types";
import clsx from "clsx";
import { SquarePen } from "lucide-react";

const Page = () => {
  const { data } = useQuery({
    queryKey: ["car"],
    queryFn: getFakeCars,
    enabled: true,
  });

  console.log(data);

  return (
    <div
      id={"car-main-container"}
      className={
        "text-white w-full h-screen flex flex-col justify-center items-center"
      }
    >
      <div className={"w-[90%] h-[90%]"}>
        <div className={"flex w-[70%] mb-4 items-center justify-between"}>
          <div className={""}>
            <h1 className={"text-2xl font-semibold "}>Dashboard</h1>
            <h3 className={"text-gray-300 text-sm"}>
              Manage your inventory, sales, and performance all in one place.
            </h3>
          </div>
          <button
            className={
              "items-center flex gap-2  rounded-sm hover:underline-offset-2 hover:underline cursor-pointer"
            }
          >
            <SquarePen className={"h-5 w-5"} />
            Edit
          </button>
        </div>
        <div
          id={"car-container"}
          className={"w-full h-full flex justify-between"}
        >
          <div
            id={"left-side-container"}
            className={
              "w-[70%] h-full rounded-sm bg-background shadow-sm shadow-gray-600 border-gray-800"
            }
          >
            <div id={"title"} className={"flex p-4 justify-between"}>
              <h1 className={" text-lg font-semibold "}>Available Cars</h1>
              {/*This part need to add filter component*/}
              <div>Filter</div>
            </div>
            <div className={"flex justify-center mt-6"}>
              <div id={"cars"} className={"grid grid-cols-3 gap-6"}>
                {data?.map((car: Car, index: number) => (
                  <div key={index}>
                    <CarCard car={car} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            id={"right-side-container"}
            className={
              "w-[25%] h-full rounded-sm bg-background shadow-sm shadow-gray-600 border-gray-800"
            }
          ></div>
        </div>
      </div>
    </div>
  );
};

function CarCard({ car }: { car: Car }) {
  return (
    <div
      className={
        "w-80  rounded-sm bg-gray-700 border-gray-600 border shadow-gray-800  flex flex-col"
      }
    >
      <div className={"p-3 space-y-2"}>
        <Image
          className={"object-cover h-30 w-full"}
          src={car.CarImages[0]}
          alt={"car"}
          width={"100"}
          height={"50"}
        ></Image>
        <div
          id={"titleAndSave"}
          className={"flex justify-between items-center"}
        >
          <h1>{car.Title}</h1>
          <h3
            className={clsx(
              car.CarStatus === "Available" ? "bg-green-600" : "bg-red-500",
              "text-xs px-2 py-0.5  rounded-md items-center",
            )}
          >
            {car.CarStatus}
          </h3>
        </div>
        <div id={"features"} className={"flex justify-between"}>
          <h1 className={"text-sm"}>
            Style: <b>{car.Make}</b>
          </h1>
          <h1 className={"text-sm"}>
            Type: <b>{car.FuelType}</b>
          </h1>
          <h1 className={"text-sm flex gap-1 items-center"}>
            Color:{" "}
            <div
              className={clsx(
                `h-5 w-5 bg-${car.Color.toLowerCase()}-500 `,
                `bg-${car.Color.toLowerCase()}`,
              )}
            />
          </h1>
        </div>
        <div id={"price"} className={"text-primary font-semibold text-lg"}>
          ${car.Price}
        </div>
      </div>
    </div>
  );
}

export default Page;
