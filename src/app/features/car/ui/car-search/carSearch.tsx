"use client";

import carSuggestionsData from "@/../public/carSuggestions.json";
import { CarItems } from "@/app/features/car/types/car.types";
import { CarCard } from "@/app/features/car/ui/car-card/CarCard";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { MainResponse } from "@/app/shared/types.ts/main-response";
import { searchCarWithQuery } from "@/app/shared/utils/API/CarAPI";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useId, useRef, useState } from "react";
import { CarModel } from "../../types/car.model";
import { carMapper } from "../../types/car.mapper";

interface CarSearchProps {
  query: string;
  searchResults: CursorResponse<CarModel[]>;
}

type SearchPage = CursorResponse<CarModel[]>;

const emptySearchPage: SearchPage = {
  items: [],
  hasMore: false,
  nextCursor: null,
};

export default function CarSearch({
  query,
  searchResults: initialData,
}: CarSearchProps) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(query);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsId = useId();

  const parentRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = query.trim();
  const canSearch = searchQuery.trim().length > 0;

  const initialSearchPage: SearchPage = initialData
    ? {
        items: initialData.items ?? [],
        hasMore: Boolean(initialData.hasMore),
        nextCursor: initialData.nextCursor ?? null,
      }
    : emptySearchPage;

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

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
    queryKey: ["search-cars", trimmedQuery],

    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();

      params.set("query", trimmedQuery);

      if (pageParam) {
        params.set("cursor", pageParam);
      }

      const response = await searchCarWithQuery(params.toString());
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

    enabled: Boolean(trimmedQuery),

    initialData: trimmedQuery
      ? {
          pages: [initialSearchPage],
          pageParams: [undefined],
        }
      : undefined,
  });

  const allItems = data?.pages.flatMap((page) => page.items ?? []) ?? [];

  const hasQuery = Boolean(trimmedQuery);
  const hasResults = allItems.length > 0;

  const showStartState = !hasQuery;
  const showLoadingState = hasQuery && isLoading && !hasResults;
  const showErrorState = hasQuery && isError;
  const showEmptyState = hasQuery && !isLoading && !isError && !hasResults;
  const showResultsState = hasQuery && hasResults;

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

  useEffect(() => {
    const scrollElement = parentRef.current;

    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;

      const reachedThreshold = scrollTop + clientHeight >= scrollHeight * 0.8;

      if (reachedThreshold && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    scrollElement.addEventListener("scroll", handleScroll);

    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextQuery = searchQuery.trim();

    if (!nextQuery) return;

    setShowSuggestions(false);
    router.push(`/car/search?query=${encodeURIComponent(nextQuery)}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    router.push(`/car/search?query=${encodeURIComponent(suggestion)}`);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleRetry = () => {
    router.refresh();
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Search Cars</h1>

          <form onSubmit={handleSearch} className="relative">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Back Button */}
              <motion.button
                type="button"
                onClick={handleGoBack}
                whileTap={{ scale: 0.96 }}
                className="group cursor-pointer inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 "
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-gray-400 transition-colors group-hover:text-gray-700" />
                <span className="hidden sm:inline">Back</span>
              </motion.button>

              {/* Search Input */}
              <div ref={searchContainerRef} className="relative flex-1">
                <div className="group relative">
                  <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary-600" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (suggestions.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        setShowSuggestions(false);
                        (event.target as HTMLInputElement).blur();
                      }
                    }}
                    placeholder="Search by make, model, year..."
                    aria-label="Search cars"
                    aria-expanded={showSuggestions}
                    aria-controls={suggestionsId}
                    className="focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-gray-200 bg-white py-2.5 px-11 pr-10 text-sm text-gray-900 shadow-sm transition-all placeholder:text-gray-400 hover:border-gray-300 focus:outline-none"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setShowSuggestions(false);
                      }}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      key="search-suggestions"
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className="absolute z-50 mt-2 max-h-72 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
                      role="listbox"
                      id={suggestionsId}
                    >
                      <div className="border-b border-gray-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Suggestions
                      </div>

                      <div className="max-h-60 overflow-y-auto p-1">
                        {suggestions.map((suggestion) => (
                          <motion.button
                            key={suggestion}
                            type="submit"
                            onClick={() => handleSuggestionClick(suggestion)}
                            whileHover={{ x: 3 }}
                            role="option"
                            aria-selected={suggestion === searchQuery}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-gray-50"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                              <Search className="h-4 w-4 text-gray-500" />
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-gray-900">
                                {suggestion}
                              </span>
                              <span className="block text-xs text-gray-500">
                                Search this car model
                              </span>
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Button */}
              <motion.button
                type="submit"
                disabled={!canSearch}
                whileHover={canSearch ? { scale: 1.03 } : undefined}
                whileTap={canSearch ? { scale: 0.96 } : undefined}
                className="bg-primary-600 hover:bg-primary-700 disabled:hover:bg-primary-600 w-full rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Search
              </motion.button>
            </div>
          </form>
        </div>

        {showStartState && (
          <SearchFallback
            icon={<Search className="text-primary-600 h-8 w-8" />}
            iconClassName="bg-primary-100"
            title="Start Your Search"
            description="Enter a car make, model, or year to find your perfect vehicle."
          />
        )}

        {showLoadingState && (
          <SearchFallback
            icon={<Loader2 className="text-primary-600 h-8 w-8 animate-spin" />}
            iconClassName="bg-primary-100"
            title="Searching cars..."
            description="Please wait while we look for matching vehicles."
          />
        )}

        {showErrorState && (
          <SearchFallback
            icon={<X className="h-8 w-8 text-red-500" />}
            iconClassName="bg-red-100"
            title="Search Failed"
            description={
              error?.message || "Something went wrong while searching cars."
            }
            action={
              <button
                type="button"
                onClick={handleRetry}
                className="bg-primary-600 hover:bg-primary-700 rounded-lg px-6 py-2 font-semibold text-white transition-colors"
              >
                Try Again
              </button>
            }
          />
        )}

        {showEmptyState && (
          <SearchFallback
            icon={<Search className="h-8 w-8 text-primary " />}
            iconClassName="bg-primary-50"
            title="No Cars Found"
            description={`We couldn't find any cars matching "${trimmedQuery}". Try a different keyword, such as Toyota, Honda, SUV, or 2020.`}
          />
        )}

        {showResultsState && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Search Results for "{trimmedQuery}"
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {allItems.length} {allItems.length === 1 ? "car" : "cars"}{" "}
                  found
                </p>
              </div>
            </div>

            <div
              ref={parentRef}
              className="h-[calc(100vh-300px)] overflow-auto"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {allItems.map((car, index) => (
                  <div key={car.id ?? index} data-index={index}>
                    <CarCard carItem={car} />
                  </div>
                ))}

                {isFetchingNextPage && (
                  <div className="col-span-full flex items-center justify-center py-8">
                    <Loader2 className="text-primary-600 h-8 w-8 animate-spin" />
                  </div>
                )}

                {!hasNextPage && allItems.length > 0 && (
                  <div className="col-span-full py-6 text-center text-sm text-gray-500">
                    You have reached the end of the results.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface SearchFallbackProps {
  icon: React.ReactNode;
  iconClassName?: string;
  badge?: string;
  title: string;
  description: string;
  helperText?: string;
  action?: React.ReactNode;
}

function SearchFallback({
  icon,
  iconClassName = "bg-gray-100 text-gray-600",
  badge = "Search Result",
  title,
  description,
  helperText,
  action,
}: SearchFallbackProps) {
  return (
    <div className="flex items-center justify-center py-10 sm:py-16">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div
            className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${iconClassName}`}
          >
            {icon}
          </div>

          {/* Badge */}
          <span className="mb-3 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold tracking-wide text-gray-600">
            {badge}
          </span>

          {/* Title */}
          <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            {title}
          </h2>

          {/* Description */}
          <p className="mt-3 max-w-md text-sm leading-6 text-gray-500 ">
            {description}
          </p>

          {/* Helper text */}
          {helperText && (
            <p className="mt-2 text-sm text-gray-400">{helperText}</p>
          )}

          {/* Action */}
          {action && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
