import { Metadata } from "next";
import VehicleContextProvider from "../../../../features/profiles/dealer/context/AddNewCarContext";
import AddNewCar from "../../../../features/profiles/dealer/ui/add-car-form/AddNewCar";

export const metadata: Metadata = {
  title: "Add New Vehicle - Gear Up",
  description: "List a new vehicle for sale on Gear Up.",
};

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) => {
  const param = await searchParams;
  return (
    <VehicleContextProvider>
      <AddNewCar step={param.step} />
    </VehicleContextProvider>
  );
};

export default Page;
