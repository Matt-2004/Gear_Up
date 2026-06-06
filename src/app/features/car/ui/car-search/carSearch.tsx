"use client";

import { CarCard } from "@/app/features/car/ui/car-card/CarCard";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RefreshCcw, Search, X } from "lucide-react";
import { SkeletonCard } from "@/app/shared/ui/Skeleton";
import SectionErrorFallback from "@/app/shared/ui/SectionErrorFallback";
import StaleDataBanner from "@/app/shared/ui/StaleDataBanner";
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
    activeFilterCount,
    canSearch,
    trimmedQuery,
    searchContainerRef,
    allItems,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,

    isError,
    hasItems,
    showStartState,
    showLoadingState,
    showErrorState,
    showEmptyState,
    showResultsState,
    handleSearch,
    handleSuggestionClick,
    handleClearInput,
    handleRetry,
    loadMore,
    clearFilters,
    updateFilter,
  } = useCarSearch({ query, initialData });

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #000000 0%, #0a0f05 30%, #080e04 100%)",
      }}
    >
      {/* Decorative green accent orbs */}
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-primary-600/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-600/[0.03] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Browse Cars
            </h1>
            <p className="mt-0.5 text-sm text-zinc-400">
              Find your perfect vehicle from thousands of listings
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-6">
            <div
              ref={searchContainerRef}
              className="group relative flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-2 transition-all"
            >
              <Search className="ml-3 h-5 w-5 shrink-0 text-zinc-500" />

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
                className="flex-1 bg-transparent py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus-visible:!outline-none"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearInput}
                  aria-label="Clear search"
                  data-testid="clear-search"
                  className="shrink-0 rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              <motion.button
                type="submit"
                disabled={!canSearch}
                data-testid="search-button"
                whileHover={canSearch ? { scale: 1.02 } : undefined}
                whileTap={canSearch ? { scale: 0.97 } : undefined}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all hover:bg-primary-500 hover:shadow-[0_2px_8px_rgba(94,168,58,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Search className="h-4 w-4" />
                Search
              </motion.button>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    key="search-suggestions"
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute left-0 top-full z-[100] mt-2 max-h-72 w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl backdrop-blur-xl"
                    role="listbox"
                    id={suggestionsId}
                  >
                    <div className="border-b border-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
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
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-white/5"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                            <Search className="h-4 w-4 text-zinc-500" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-white">
                              {suggestion}
                            </span>
                            <span className="block text-xs text-zinc-400">
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
          </form>
        </div>

        {/* Main content: sidebar filters + results */}
        <div className="flex gap-6">
          {/* Left sidebar — Filters */}
          <aside className="w-56 shrink-0">
            <div className="sticky top-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
              <h3 className="text-sm font-semibold text-white">Filters</h3>

              <div className="mt-4 space-y-4">
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

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 text-xs font-medium text-zinc-500 transition-colors hover:text-white"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Right — Results */}
          <div className="min-w-0 flex-1">
            {/* Active filter chips */}
            {activeFilterCount > 0 && showResultsState && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {Object.entries(filters)
                  .filter(([, value]) => value)
                  .map(([key, value]) => (
                    <span
                      key={key}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-medium text-zinc-200"
                    >
                      {value}
                      <button
                        type="button"
                        onClick={() =>
                          updateFilter(
                            key as "price" | "color" | "sortBy" | "sortOrder",
                            "",
                          )
                        }
                        className="ml-0.5 rounded-full p-0.5 text-zinc-500 hover:bg-white/10 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-medium text-zinc-500 transition-colors hover:text-white"
                >
                  Clear all
                </button>
              </div>
            )}

            {showStartState && (
              <SearchFallback
                icon={<Search className="h-8 w-8 text-primary-400" />}
                iconClassName="bg-primary-500/15"
                badge="Ready to Search"
                title="Start Your Search"
                description="Enter a car make, model, or keyword to find your perfect vehicle."
                helperText="Try searching for brands like Toyota, Honda, or BMW"
                data-testid="start-state"
              />
            )}

            {showLoadingState && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Error — no existing data */}
            {showErrorState && !hasItems && (
              <SectionErrorFallback
                onRetry={handleRetry}
                isRetrying={isRefetching}
              />
            )}

            {/* Stale data banner */}
            {showErrorState && hasItems && (
              <div className="mb-6">
                <StaleDataBanner
                  onRefresh={handleRetry}
                  isRefreshing={isRefetching}
                />
              </div>
            )}

            {showEmptyState && (
              <SearchFallback
                icon={<Search className="h-8 w-8 text-zinc-500" />}
                iconClassName="bg-white/5"
                title="No Cars Found"
                description={`We couldn't find any cars matching "${trimmedQuery}". Try a different keyword or adjust your filters.`}
                data-testid="no-results"
                action={
                  activeFilterCount > 0 ? (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                    >
                      Clear Filters
                    </button>
                  ) : undefined
                }
              />
            )}

            {showResultsState && (
              <div data-testid="search-results">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {allItems.map((car, index) => (
                    <div key={car.id ?? index} data-index={index}>
                      <CarCard carItem={car} />
                    </div>
                  ))}
                </div>

                {/* Pagination / Load More */}
                <div className="mt-8 flex items-center justify-center">
                  {isFetchingNextPage && (
                    <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
                  )}

                  {hasNextPage && !isFetchingNextPage && (
                    <button
                      type="button"
                      onClick={loadMore}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                    >
                      Load More Results
                    </button>
                  )}

                  {!hasNextPage && allItems.length > 0 && !isFetchingNextPage && (
                    <p className="text-sm text-zinc-600">
                      You have reached the end of the results.
                    </p>
                  )}
                </div>

                {/* Retry on error while loading more */}
                {isError && hasItems && hasNextPage && !isFetchingNextPage && (
                  <div className="mt-4 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={isRefetching}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-400 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isRefetching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCcw className="h-4 w-4" />
                      )}
                      {isRefetching ? "Retrying..." : "Failed to load more — tap to retry"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
