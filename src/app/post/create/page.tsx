import { getMyCars } from "@/utils/API/CarAPI";
import { Metadata } from "next";
import { CreatePostProvider } from "../../features/post/context/CreatePostContext";
import CreatePostForm from "../../features/post/ui/CreatePostForm";

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

  return (
    <CreatePostProvider>
      <CreatePostForm dealerCars={dealerCars} />
    </CreatePostProvider>
  );
};

export default page;
