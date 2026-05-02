import { searchCarWithQuery } from "@/app/shared/utils/API/CarAPI";
import { Metadata } from "next";
import SearchPage from "../../features/car/ui/car-search/carSearch";
import { carMapper } from "@/app/features/car/types/car.mapper";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { CarModel } from "@/app/features/car/types/car.model";

export const metadata: Metadata = {
  title: "Search Cars - Gear Up",
  description:
    "Search and find your perfect vehicle from thousands of listings on Gear Up.",
};

interface SearchPageProps {
  searchParams: Promise<{ query: string }>;
}

export default async function Page({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.query;

  const response = await searchCarWithQuery(`query=${query}`);
  const searchResults: CursorResponse<CarModel[]> = {
    hasMore: response.data.hasMore,
    nextCursor: response.data.nextCursor,
    items: response.data.items.map(carMapper),
  };

  return <SearchPage query={query} searchResults={searchResults} />;
}
