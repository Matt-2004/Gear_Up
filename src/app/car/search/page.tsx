// import { searchCarWithQuery } from "@/app/shared/utils/API/CarAPI";
import { Metadata } from "next";
import SearchPage from "../../features/car/ui/car-search/carSearch";
// import { carMapper } from "@/app/features/car/types/car.mapper";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { CarModel } from "@/app/features/car/types/car.model";
import { mockVehicles } from "@/app/shared/mock/mockVehicles";

export const metadata: Metadata = {
  title: "Search Cars - Gear Up",
  description:
    "Search and find your perfect vehicle from thousands of listings on Gear Up.",
};

interface SearchPageProps {
  searchParams: Promise<{ query: string }>;
}

function searchMockVehicles(query: string): CarModel[] {
  const q = query.toLowerCase();
  return mockVehicles.filter(
    (c) =>
      c.make.toLowerCase().includes(q) ||
      c.model.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q),
  );
}

export default async function Page({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.query ?? "";

  if (!query) {
    return (
      <SearchPage
        query=""
        searchResults={{ items: [], hasMore: false, nextCursor: null }}
      />
    );
  }

  // const response = await searchCarWithQuery(`query=${query}`);
  // const searchResults: CursorResponse<CarModel[]> = {
  //   hasMore: response.data.hasMore,
  //   nextCursor: response.data.nextCursor,
  //   items: response.data.items.map(carMapper),
  // };

  const items = searchMockVehicles(query);
  const searchResults: CursorResponse<CarModel[]> = {
    hasMore: false,
    nextCursor: null,
    items,
  };

  return <SearchPage query={query} searchResults={searchResults} />;
}
