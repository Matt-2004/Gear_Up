import { getCarById } from "@/app/shared/utils/API/CarAPI";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import CarDetail from "../../features/car/ui/car-detail/CarDetail";
import { carDetailMapper } from "@/app/features/car/types/car.mapper";
import SectionErrorBoundary from "@/app/shared/ui/SectionErrorBoundary";
import { ErrorResponse } from "@/app/shared/utils/errors/errorResponse";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const car = await getCarById(id);
    const carData = car.data;
    const title = carData
      ? `${carData.make} ${carData.model} ${carData.year} — Gear Up`
      : "Car Details — Gear Up";
    const description = carData
      ? `${carData.title} — ${carData.description?.substring(0, 150)}`
      : "View car details on Gear Up";
    const firstImage = carData?.carImages?.[0]?.url;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        ...(firstImage && {
          images: [{ url: firstImage, width: 1200, height: 630 }],
        }),
      },
      twitter: {
        card: firstImage ? "summary_large_image" : "summary",
        title,
        description,
        ...(firstImage && { images: [firstImage] }),
      },
    };
  } catch {
    return {
      title: "Car Details — Gear Up",
      description: "View car details on Gear Up",
    };
  }
}

async function getData(id: string) {
  try {
    const res = await getCarById(id);
    const carDetail = carDetailMapper(res.data);
    return carDetail;
  } catch (error) {
    console.error("Error fetching car:", error);
    // Only treat a genuine 404 as "car not found".
    // Server errors (500, network failures, etc.) should propagate
    // so the error.tsx boundary catches them and shows the error UI.
    if (error instanceof ErrorResponse && error.status === 404) {
      return null;
    }
    throw error;
  }
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const car = await getData(id);

  if (!car) notFound();

  return (
    <SectionErrorBoundary>
      <CarDetail car={car} />
    </SectionErrorBoundary>
  );
};

export default Page;
