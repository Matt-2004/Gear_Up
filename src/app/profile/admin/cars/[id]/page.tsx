import CarDetailPage from "@/components/Admin/CarDetailPage";
import { getCarById } from "@/utils/API/AdminAPI";

export const dynamic = "force-dynamic";

const getCarDataById = async (id: string) => {
  const response = await getCarById(id);
  return response?.data;
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const carData = await getCarDataById(id);

  return <CarDetailPage carData={carData} />;
};

export default Page;
