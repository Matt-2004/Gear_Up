import { searchCarWithQuery } from "@/app/shared/utils/API/CarAPI";
import { Metadata } from "next";
import SearchPage from "../../features/car/ui/car-search/carSearch";

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
  console.log("response from searc");
  const searchResults = response;

  return <SearchPage query={query} searchResults={searchResults} />;
}
