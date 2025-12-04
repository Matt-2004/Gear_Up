"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getFakeCars } from "@/utils/FetchAPI";
import { Car } from "@/app/types/car.types";
import clsx from "clsx";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const Page = () => {

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["car"],
    queryFn: getFakeCars,
    enabled: true,
  });

  console.log("Car Data:: ", data?.data)

  return (
    <div
      id={"car-main-container"}
      className={
        "text-white w-full h-full flex flex-col justify-center items-center"
      }
    >
      <div className={"w-[90%]"}>
        <div className={"flex py-4 items-center justify-between"}>
          <div className={""}>
            <h1 className={"text-2xl font-semibold "}>Dashboard</h1>
            <h3 className={"text-gray-300 text-sm"}>
              Manage your inventory, sales, and performance all in one place.
            </h3>
          </div>

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
            <div id={"header"} className={"flex p-4 justify-between items-center"}>
              <h1 className={" text-lg font-semibold "}>Available Cars</h1>
              {/*This part need to add filter component*/}
              <div onClick={() => setIsFilterOpen(prevState => !prevState)} className="flex items-center gap-2 cursor-pointer px-4 py-2 border border-gray-600 hover:bg-gray-600">
                <SlidersHorizontal className="h-5 w-5 " />Filter
              </div>
            </div>
            {
              isFilterOpen &&
              <div id="conditionalFilter" className="w-full flex justify-center">
                <ConditionalCarFilter />
              </div>
            }
            <div id={"cars"} className={"flex justify-center mt-6"}>
              <div className={"grid grid-cols-3 gap-6"}>
                {data && data.data.items.slice(0, 9).map((car: Car, index: number) => (
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
              "w-[25%] h-screen rounded-sm bg-background shadow-sm shadow-gray-600 border-gray-800"
            }
          >
            # Need to add analytics component here #
          </div>
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
          src={car.carImages[0]?.url}
          alt={"car"}
          width={"100"}
          height={"50"}
        ></Image>
        <div
          id={"titleAndSave"}
          className={"flex justify-between items-center"}
        >
          <h1>{car.title}</h1>
          <h3
            className={clsx(
              car.carStatus === "Available" ? "bg-green-600" : "bg-red-500",
              "text-xs px-2 py-0.5  rounded-md items-center",
            )}
          >
            {car.carStatus}
          </h3>
        </div>
        <div id={"features"} className={"flex justify-between"}>
          <h1 className={"text-sm"}>
            Style: <b>{car.make}</b>
          </h1>
          <h1 className={"text-sm"}>
            Type: <b>{car.fuelType}</b>
          </h1>
          <h1 className={"text-sm flex gap-1 items-center"}>
            Color:{" "}
            <div
              className={clsx(
                `h-5 w-5 bg-${car.color.toLowerCase()}-500 `,
                `bg-${car.color.toLowerCase()}`,
              )}
            />
          </h1>
        </div>
        <div id={"price"} className={"text-primary font-semibold text-lg"}>
          ${car.price.toString().split(".")[0]}
        </div>
      </div>
    </div>
  );
}

export function ConditionalCarFilter() {
  return (
    <div
      id={"filter-container"}
      className={
        "w-[95%]  px-4  py-2 justify-center border rounded-sm border-gray-600 border-dashed flex flex-col  gap-2"
      }
    >
      {/* Placeholder for future filter options */}
      <div id="year" className={"text-gray-300 items-center"}>
        <h1>
          Year: <input type="number" name="year" placeholder="1990" min={1990} max={2025} className={"bg-gray-800  focus:outline-none placeholder:text-sm text-white p-1 rounded-sm w-20 border border-gray-600"} /> to  <input type="number" placeholder="2025" name="year" min={1990} max={2025} className={"border focus:outline-none placeholder:text-sm border-gray-600 bg-gray-800 text-white p-1 rounded-sm w-20"} />
        </h1>
      </div>
      <div className="h-0.5 w-full border border-gray-600" />
      <div id="price" className={"text-gray-300 items-center"}>
        <h1>
          Price range: <input type="number" name="price" placeholder="$5000 - min" className={"bg-gray-800 focus:outline-none placeholder:text-sm text-white p-1  rounded-sm w-28 border border-gray-600"} /> to  <input type="number" placeholder="$20000 - max" name="price" className={"border placeholder:text-sm border-gray-600 bg-gray-800 focus:outline-none text-white p-1 rounded-sm w-28"} />
        </h1>
      </div>
      <div className="h-0.5 w-full border border-gray-600" />
      <div className="items-center flex gap-1">
        Brand
        <div className="flex items-center gap-1  select-none">
          <input id="tesla" type="checkbox" name="make" value="Toyota" className="appearance-none peer hidden" />
          <label htmlFor="tesla" className="ml-1  cursor-pointer flex gap-1 border border-gray-600 text-red-500 px-2 py-2 bg-white rounded-sm peer-checked:bg-primary"><div className="relative h-5 w-16">
            <Image
              src="/tesla-text.png"
              alt="toyota"
              fill
              className="object-contain"
            />
          </div></label>
        </div>
        <div className="flex items-center gap-1  select-none">
          <input id="toyota" type="checkbox" name="make" value="Toyota" className="appearance-none peer hidden" />
          <label htmlFor="toyota" className="ml-1   cursor-pointer  flex gap-1 border border-gray-600 text-red-500 px-2 py-2 bg-white rounded-sm  peer-checked:bg-primary "><div className="relative h-5 w-16">
            <Image
              src="/toyota-text.png"
              alt="toyota"
              fill
              className="object-contain scale-200"
            />
          </div></label>
        </div>

      </div>
    </div>
  );
}

export default Page;
