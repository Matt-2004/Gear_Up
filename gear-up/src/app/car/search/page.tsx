import { searchCarWithQuery } from "@/utils/API/CarAPI";
import { Metadata } from "next";
import SearchPage from "./SearchPage";

export const metadata: Metadata = {
    title: "Search Cars - Gear Up",
    description: "Search and find your perfect vehicle from thousands of listings on Gear Up.",
}

interface SearchPageProps {
    searchParams: Promise<{ query: string }>;
}

export default async function Page({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const query = typeof params.query === "string" ? params.query : "";

    let searchResults = null;
    let error = null;

    if (query) {
        try {
            const response = await searchCarWithQuery(`query=${query}`);
            searchResults = response?.data;
        } catch (err) {
            console.error("Error fetching search results:", err);
            error = "Failed to fetch search results. Please try again.";
        }
    }

    return <SearchPage query={query} searchResults={searchResults} error={error} />;
}
