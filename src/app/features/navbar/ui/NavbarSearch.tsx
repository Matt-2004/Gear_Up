"use client";

import clsx from "clsx";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import carSuggestions from "../../../../../public/carSuggestions.json";

export default function NavbarSearch() {
  const router = useRouter();
  const [isSearchBarActive, setIsSearchBarActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const filtered: string[] = [];
      const lowerQuery = searchQuery.toLowerCase();

      for (const carGroup of carSuggestions) {
        if (carGroup.make.toLowerCase().includes(lowerQuery)) {
          filtered.push(
            ...carGroup.model.map((model) => `${carGroup.make} ${model}`),
          );
        } else {
          for (const model of carGroup.model) {
            const fullName = `${carGroup.make} ${model}`;
            if (fullName.toLowerCase().includes(lowerQuery)) {
              filtered.push(fullName);
            }
          }
        }

        if (filtered.length >= 8) break;
      }

      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(filtered.length > 0);
    }, 300);

    return () => clearTimeout(delayTimer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    router.push(`/car/search?query=${encodeURIComponent(suggestion)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(
        `/car/search?query=${encodeURIComponent(searchQuery.trim())}`,
      );
    }
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      ref={searchRef}
      className="relative h-full w-full max-w-sm transition-all duration-200 ease-in-out"
    >
      <input
        type="text"
        placeholder="Search cars..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => searchQuery && setShowSuggestions(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearchSubmit(e);
          }
        }}
        className={clsx(
          isSearchBarActive ? "block" : "hidden md:block",
          "focus:border-primary-500 w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pr-10 pl-10 text-sm text-gray-900 placeholder-gray-500 transition-all hover:bg-gray-100 focus:outline-none",
        )}
      />

      <button
        type="submit"
        onClick={() => setIsSearchBarActive(true)}
        className={clsx(
          isSearchBarActive
            ? "left-3"
            : "rounded-lg p-2 hover:bg-gray-100 md:bg-transparent md:p-0",
          "absolute top-1/2 -translate-y-1/2 transform transition-colors md:left-3",
        )}
        aria-label="Search"
      >
        <Search
          className={clsx(
            isSearchBarActive ? "text-gray-400" : "text-primary",
            "h-5 w-5",
          )}
        />
      </button>

      {isSearchBarActive && (
        <button
          className="absolute top-1/2 right-3 -translate-y-1/2 transform rounded p-1 transition-colors hover:bg-gray-200 md:hidden"
          onClick={() => {
            setIsSearchBarActive(false);
            setSearchQuery("");
            setShowSuggestions(false);
          }}
          aria-label="Clear search"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="p-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="group flex w-full items-center gap-3 rounded-md p-1.5 text-left transition-colors hover:bg-gray-100"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {suggestion}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
