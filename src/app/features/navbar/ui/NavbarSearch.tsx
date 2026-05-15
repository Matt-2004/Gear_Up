"use client";

import { Search, X } from "lucide-react";
import { useRef } from "react";
import { SEARCH_CATEGORY_CHIPS } from "../constants";
import { useSearchAutocomplete } from "../hooks/useSearchAutocomplete";
import { useClickOutside } from "../hooks/useClickOutside";

export default function NavbarSearch() {
  const {
    expanded,
    query,
    setQuery,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    inputRef,
    open,
    close,
    collapseIfEmpty,
    navigate,
  } = useSearchAutocomplete();

  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => {
    setShowSuggestions(false);
    collapseIfEmpty();
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Collapsed */}
      {!expanded && (
        <button
          type="button"
          onClick={open}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Open search"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>
      )}

      {/* Expanded */}
      {expanded && (
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 shadow-sm transition-all focus-within:border-primary focus-within:bg-white focus-within:shadow-md">
            <Search className="ml-3 h-4 w-4 shrink-0 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="Search make, model, or year..."
              className="h-10 flex-1 bg-transparent px-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setShowSuggestions(false);
                  inputRef.current?.focus();
                }}
                className="mr-1 rounded-lg p-1 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={close}
              className="mr-2 rounded-lg p-1 text-gray-400 hover:text-gray-600"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
              <div className="border-b border-gray-100 px-3 py-2.5">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Quick Search
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SEARCH_CATEGORY_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => navigate(chip)}
                      className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
              <div className="py-1">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setQuery(suggestion);
                      navigate(suggestion);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Search className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <span className="truncate">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
