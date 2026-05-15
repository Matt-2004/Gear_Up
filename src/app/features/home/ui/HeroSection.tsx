"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import carSuggestionsData from "@/../public/carSuggestions.json";

const FILTER_CHIPS = ["SUV", "Sedan", "EV", "Luxury", "Sports"] as const;

export default function HeroSection() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    router.prefetch("/car/search");
  }, [router]);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const lowerQuery = trimmedQuery.toLowerCase();
      const filtered: string[] = [];

      for (const carGroup of carSuggestionsData) {
        if (carGroup.make.toLowerCase().includes(lowerQuery)) {
          filtered.push(carGroup.make);
        }
        for (const model of carGroup.model) {
          const fullName = `${carGroup.make} ${model}`;
          if (fullName.toLowerCase().includes(lowerQuery)) {
            filtered.push(fullName);
          }
          if (filtered.length >= 6) break;
        }
        if (filtered.length >= 6) break;
      }

      const uniqueFiltered = Array.from(new Set(filtered)).slice(0, 6);
      setSuggestions(uniqueFiltered);
      setShowSuggestions(uniqueFiltered.length > 0);
    }, 300);

    return () => window.clearTimeout(timeoutId);
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

  const goToSearch = (value: string) => {
    const normalizedValue = value.trim();
    if (!normalizedValue) return;
    setShowSuggestions(false);
    startTransition(() => {
      router.push(`/car/search?query=${encodeURIComponent(normalizedValue)}`);
    });
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    goToSearch(searchQuery);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    goToSearch(suggestion);
  };

  const handleChipClick = (chip: string) => {
    setActiveChip(chip);
    goToSearch(chip);
  };

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/carImages/9.jpg"
        alt="Premium vehicle showcase"
        fill
        quality={100}
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.55),rgba(0,0,0,0.35),rgba(0,0,0,0.7))]" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center">
        <span className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md">
          Trusted by thousands of buyers &amp; sellers
        </span>

        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
          Find Your Next Car
        </h1>

        <p className="mt-4 max-w-xl text-base text-white/80 md:text-lg">
          The most trusted automotive marketplace. Browse verified listings,
          book test drives instantly, and drive away with confidence.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-10 w-full max-w-2xl">
          <div
            ref={searchContainerRef}
            className="relative flex items-center rounded-2xl border border-white/10 bg-white/15 p-1.5 shadow-2xl backdrop-blur-2xl transition-all focus-within:bg-white/20 focus-within:shadow-[0_0_0_2px_rgba(255,255,255,0.15)]"
          >
            <Search className="ml-3 h-5 w-5 shrink-0 text-white/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="Search by make, model, or year..."
              className="h-12 flex-1 bg-transparent px-3 text-sm font-medium text-white placeholder:text-white/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isPending}
              className="h-11 shrink-0 rounded-xl bg-white px-6 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-100 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Searching..." : "Search"}
            </button>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 top-full z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-white/15 bg-gray-900/95 py-1 shadow-2xl backdrop-blur-xl">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/10"
                  >
                    <Search className="h-4 w-4 shrink-0 text-white/50" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Filter Chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleChipClick(chip)}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition-all hover:scale-105 ${
                activeChip === chip
                  ? "border-white bg-white text-gray-900"
                  : "border-white/20 bg-white/10 text-white backdrop-blur-md hover:border-white/40 hover:bg-white/15"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
