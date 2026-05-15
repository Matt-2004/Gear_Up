"use client";

import { CarCard } from "@/app/features/car/ui/car-card/CarCard";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { SkeletonCard } from "@/app/shared/ui/Skeleton";
import { useId } from "react";
import { CarModel } from "../../types/car.model";
import { useCarSearch } from "./useCarSearch";
import { FilterSelect } from "./FilterSelect";
import { SearchFallback } from "./SearchFallback";
import {
  PRICE_RANGES,
  COLOR_OPTIONS,
  SORT_BY_OPTIONS,
  SORT_ORDER_OPTIONS,
} from "./filter-options";

interface CarSearchProps {
  query: string;
  searchResults: CursorResponse<CarModel[]>;
}

export default function CarSearch({
  query,
  searchResults: initialData,
}: CarSearchProps) {
  const suggestionsId = useId();

  const {
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
    parentRef,
    searchContainerRef,
    allItems,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    showStartState,
    showLoadingState,
    showErrorState,
    showEmptyState,
    showResultsState,
    handleSearch,
    handleSuggestionClick,
    handleGoBack,
    handleRetry,
    clearFilters,
    updateFilter,
  } = useCarSearch({ query, initialData });

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <motion.button
              type="button"
              onClick={handleGoBack}
              whileTap={{ scale: 0.96 }}
              className="group inline-flex shrink-0 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-600 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-zinc-700" />
              <span className="hidden sm:inline">Back</span>
            </motion.button>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                Browse Cars
              </h1>
              <p className="mt-0.5 text-sm text-zinc-500">
                Find your perfect vehicle from thousands of listings
              </p>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search Input */}
              <div ref={searchContainerRef} className="relative flex-1">
                <div className="group relative">
                  <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-primary" />

                  <input
                    type="text"
                    value={searchQuery}
                    data-testid="search-input"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        setShowSuggestions(false);
                        (event.target as HTMLInputElement).blur();
                      }
                    }}
                    placeholder="Search by make, model, or keyword..."
                    aria-label="Search cars"
                    aria-controls={suggestionsId}
                    className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-10 text-sm text-zinc-900 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setShowSuggestions(false);
                      }}
                      aria-label="Clear search"
                      data-testid="clear-search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
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
                      className="absolute z-50 mt-2 max-h-72 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                      role="listbox"
                      id={suggestionsId}
                    >
                      <div className="border-b border-zinc-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
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
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-zinc-50"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                              <Search className="h-4 w-4 text-zinc-500" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-zinc-900">
                                {suggestion}
                              </span>
                              <span className="block text-xs text-zinc-500">
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
                data-testid="search-button"
                whileHover={canSearch ? { scale: 1.02 } : undefined}
                whileTap={canSearch ? { scale: 0.97 } : undefined}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all hover:bg-primary-600 hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <Search className="h-4 w-4" />
                Search
              </motion.button>
            </div>
          </form>

          {/* Filter Bar */}
          <FilterBar
            filters={filters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            activeFilterCount={activeFilterCount}
            updateFilter={updateFilter}
            clearFilters={clearFilters}
          />
        </div>

        {/* States */}
        {showStartState && (
          <SearchFallback
            icon={<Search className="h-8 w-8 text-primary" />}
            iconClassName="bg-primary-50"
            title="Start Your Search"
            description="Enter a car make, model, or keyword to find your perfect vehicle."
            helperText="Try searching for brands like Toyota, Honda, or BMW"
            data-testid="start-state"
          />
        )}

        {showLoadingState && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {showErrorState && (
          <SearchFallback
            icon={<X className="h-8 w-8 text-red-500" />}
            iconClassName="bg-red-100"
            title="Search Failed"
            description={
              error?.message || "Something went wrong while searching cars."
            }
            data-testid="search-error"
            action={
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
              >
                Try Again
              </button>
            }
          />
        )}

        {showEmptyState && (
          <SearchFallback
            icon={<Search className="h-8 w-8 text-zinc-400" />}
            iconClassName="bg-zinc-100"
            title="No Cars Found"
            description={`We couldn't find any cars matching "${trimmedQuery}". Try a different keyword or adjust your filters.`}
            data-testid="no-results"
            action={
              activeFilterCount > 0 ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50"
                >
                  Clear Filters
                </button>
              ) : undefined
            }
          />
        )}

        {showResultsState && (
          <div data-testid="search-results">
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
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}

                {!hasNextPage && allItems.length > 0 && (
                  <div className="col-span-full py-8 text-center text-sm text-zinc-400">
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

function FilterBar({
  filters,
  showFilters,
  setShowFilters,
  activeFilterCount,
  updateFilter,
  clearFilters,
}: {
  filters: { price: string; color: string; sortBy: string; sortOrder: string };
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  activeFilterCount: number;
  updateFilter: (key: "price" | "color" | "sortBy" | "sortOrder", value: string) => void;
  clearFilters: () => void;
}) {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
            showFilters || activeFilterCount > 0
              ? "border-primary/30 bg-primary-50 text-primary"
              : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex flex-1 items-center gap-2 overflow-x-auto hide-scrollbar">
          <AnimatePresence>
            {Object.entries(filters)
              .filter(([, value]) => value)
              .map(([key, value]) => (
                <motion.span
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-zinc-100 px-2.5 py-1.5 text-xs font-medium text-zinc-700"
                >
                  {value}
                  <button
                    type="button"
                    onClick={() => updateFilter(key as "price" | "color" | "sortBy" | "sortOrder", "")}
                    className="ml-0.5 rounded-full p-0.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.span>
              ))}
          </AnimatePresence>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="shrink-0 text-xs font-medium text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:grid-cols-4">
              <FilterSelect
                label="Price Range"
                value={filters.price}
                onChange={(v) => updateFilter("price", v)}
                options={PRICE_RANGES.map((r) => ({
                  value: r.label,
                  label: r.label,
                }))}
              />
              <FilterSelect
                label="Color"
                value={filters.color}
                onChange={(v) => updateFilter("color", v)}
                options={COLOR_OPTIONS}
              />
              <FilterSelect
                label="Sort By"
                value={filters.sortBy}
                onChange={(v) => updateFilter("sortBy", v)}
                options={SORT_BY_OPTIONS}
              />
              <FilterSelect
                label="Sort Order"
                value={filters.sortOrder}
                onChange={(v) => updateFilter("sortOrder", v)}
                options={SORT_ORDER_OPTIONS}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
