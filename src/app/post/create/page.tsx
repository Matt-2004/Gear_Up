import { getMyCars } from "@/app/shared/utils/API/CarAPI";
import { Metadata } from "next";
import { CreatePostProvider } from "../../features/post/context/CreatePostContext";
import CreatePostForm from "../../features/post/ui/CreatePostForm";
import { carMapper } from "@/app/features/car/types/car.mapper";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create Post - Gear Up",
  description:
    "Share your automotive experiences and stories with the Gear Up community.",
};

const getData = async () => {
  const data = await getMyCars("Approved", null);
  return data;
};

const page = async () => {
  const dealerCars = await getData();
  const cars = dealerCars.data.items.map(carMapper);

  return (
    <CreatePostProvider>
      <CreatePostForm dealerCars={cars} />
    </CreatePostProvider>
  );
};

export default page;
