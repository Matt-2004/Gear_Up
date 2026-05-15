"use client";

import carSuggestionsData from "@/../public/carSuggestions.json";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { searchCarWithQuery } from "@/app/shared/utils/API/CarAPI";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CarModel } from "../../types/car.model";
import { carMapper } from "../../types/car.mapper";
import { PRICE_RANGES } from "./filter-options";

type SearchPage = CursorResponse<CarModel[]>;

interface UseCarSearchParams {
  query: string;
  initialData: CursorResponse<CarModel[]>;
}

export function useCarSearch({ query, initialData }: UseCarSearchParams) {
  const router = useRouter();
  const urlParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(query);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const parentRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = query.trim();

  const [filters, setFilters] = useState({
    price: urlParams.get("price") ?? "",
    color: urlParams.get("color") ?? "",
    sortBy: urlParams.get("sortBy") ?? "",
    sortOrder: urlParams.get("sortOrder") ?? "",
  });

  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const canSearch = searchQuery.trim().length > 0 || activeFilterCount > 0;

  // Sync searchQuery when query prop changes
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  // Build URL with query + filters
  const buildUrl = (queryOverride?: string) => {
    const q = queryOverride ?? trimmedQuery;
    const hasFilters = activeFilterCount > 0;
    if (!q && !hasFilters) return "";
    const params = new URLSearchParams();
    if (q) params.set("query", q);
    if (filters.price) params.set("price", filters.price);
    if (filters.color) params.set("color", filters.color);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    return `/car/search?${params.toString()}`;
  };

  // Sync filters to URL
  useEffect(() => {
    if (!trimmedQuery && activeFilterCount === 0) return;
    const url = buildUrl();
    if (url) {
      router.replace(url, { scroll: false });
    }
  }, [filters]);

  // Build API query string
  const buildQueryString = (cursor?: string) => {
    const params = new URLSearchParams();
    if (trimmedQuery) params.set("Query", trimmedQuery);
    else if (activeFilterCount > 0) params.set("Query", "");

    if (filters.price) {
      const range = PRICE_RANGES.find((r) => r.label === filters.price);
      if (range) {
        if (range.min) params.set("MinPrice", range.min);
        if (range.max) params.set("MaxPrice", range.max);
      }
    }
    if (filters.color) params.set("Color", filters.color);
    if (filters.sortBy) params.set("SortBy", filters.sortBy);
    if (filters.sortOrder) params.set("SortOrder", filters.sortOrder);
    if (cursor) params.set("cursor", cursor);

    return params.toString();
  };

  // Infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<
    SearchPage,
    Error,
    InfiniteData<SearchPage, string | undefined>,
    string[],
    string | undefined
  >({
    queryKey: [
      "search-cars",
      trimmedQuery,
      filters.price,
      filters.color,
      filters.sortBy,
      filters.sortOrder,
    ],

    queryFn: async ({ pageParam }) => {
      const queryString = buildQueryString(pageParam);
      const response = await searchCarWithQuery(queryString);
      const results: CursorResponse<CarModel[]> = {
        hasMore: response.data.hasMore,
        nextCursor: response.data.nextCursor,
        items: response.data.items.map(carMapper),
      };
      if (!response?.isSuccess || !response.data) {
        throw new Error(response?.message || "Failed to search cars.");
      }
      return results;
    },

    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined;
      return lastPage.nextCursor ?? undefined;
    },

    enabled: Boolean(trimmedQuery || activeFilterCount > 0),

    initialData:
      trimmedQuery && !activeFilterCount
        ? {
            pages: [
              {
                items: initialData.items ?? [],
                hasMore: Boolean(initialData.hasMore),
                nextCursor: initialData.nextCursor ?? null,
              },
            ],
            pageParams: [undefined],
          }
        : undefined,
  });

  const allItems = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const hasActiveSearch = Boolean(trimmedQuery || activeFilterCount > 0);
  const hasResults = allItems.length > 0;

  // Suggestions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      const filtered: string[] = [];
      const lowerQuery = searchQuery.toLowerCase();

      for (const carGroup of carSuggestionsData) {
        for (const model of carGroup.model) {
          const fullName = `${carGroup.make} ${model}`;
          if (fullName.toLowerCase().includes(lowerQuery)) {
            filtered.push(fullName);
          }
          if (filtered.length >= 5) break;
        }
        if (filtered.length >= 5) break;
      }

      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Infinite scroll
  useEffect(() => {
    const scrollElement = parentRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      if (
        scrollTop + clientHeight >= scrollHeight * 0.8 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    scrollElement.addEventListener("scroll", handleScroll);
    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  // Handlers
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextQuery = searchQuery.trim();
    if (!nextQuery && activeFilterCount === 0) return;
    setShowSuggestions(false);
    router.push(buildUrl(nextQuery));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    router.push(buildUrl(suggestion));
  };

  const handleGoBack = () => router.back();
  const handleRetry = () => router.refresh();

  const clearFilters = () => {
    setFilters({ price: "", color: "", sortBy: "", sortOrder: "" });
  };

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // State derivation
  const showStartState = !hasActiveSearch;
  const showLoadingState = hasActiveSearch && isLoading && !hasResults;
  const showErrorState = hasActiveSearch && isError;
  const showEmptyState = hasActiveSearch && !isLoading && !isError && !hasResults;
  const showResultsState = hasActiveSearch && hasResults;

  return {
    // State
    searchQuery,
    setSearchQuery,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    filters,
    showFilters,
    setShowFilters,
    activeFilterCount,
    canSearch,
    trimmedQuery,

    // Refs
    parentRef,
    searchContainerRef,

    // Query results
    allItems,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,

    // Derived state
    hasActiveSearch,
    hasResults,
    showStartState,
    showLoadingState,
    showErrorState,
    showEmptyState,
    showResultsState,

    // Handlers
    handleSearch,
    handleSuggestionClick,
    handleGoBack,
    handleRetry,
    clearFilters,
    updateFilter,
  };
}
