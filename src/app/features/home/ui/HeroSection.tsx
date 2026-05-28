"use client";

import { Search, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background Image — slow ken burns zoom */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        transition={{ duration: 12, ease: "easeOut", delay: 0.5 }}
      >
        <Image
          src="/carImages/9.jpg"
          alt="Premium vehicle showcase"
          fill
          quality={100}
          className="object-cover object-center scale-105"
          priority
          sizes="100vw"
        />
      </motion.div>

      {/* Cinematic layered overlays */}
      <div className="absolute inset-0 bg-linear-to-b from-black/85 via-black/65 to-black/85" />
      <div className="absolute inset-0 bg-linear-to-tr from-black/65 via-transparent to-black/45" />
      <div className="absolute bottom-0 left-0 right-0 h-72 bg-linear-to-t from-black/95 via-black/55 to-transparent" />

      {/* Center spotlight */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[700px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)]" />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.55)_100%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 pt-20 pb-12 text-center">
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.05 }}
          className="max-w-4xl font-serif text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl"
        >
          Find Your Next Car,{" "}
          <span className="text-primary-500">
            Effortlessly
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.08 }}
          className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300 md:text-lg"
        >
          Browse thousands of verified listings, book test drives instantly, and drive away
          with confidence — all in one place.
        </motion.p>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearchSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.1 }}
          className="mt-10 w-full max-w-4xl"
        >
          <div
            ref={searchContainerRef}
            className="relative flex items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-800 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-150 focus-within:border-zinc-500 focus-within:bg-zinc-700 focus-within:shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-2 pl-3">
              <MapPin className="h-4 w-4 shrink-0 text-zinc-400" />
              <span className="text-sm text-zinc-300 hidden sm:inline">Thailand</span>
              <span className="h-5 w-px bg-zinc-600 hidden sm:block" />
            </div>
            <Search className="h-5 w-5 shrink-0 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="Search by make, model, or year..."
              className="h-12 flex-1 bg-transparent px-1 text-sm font-medium text-white placeholder:text-zinc-500 outline-none!"
            />
            <button
              type="submit"
              disabled={isPending}
              className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary-600 px-5 text-sm font-semibold text-white transition-all hover:bg-primary-600/80 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Searching..." : "Search"}
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 py-1 shadow-2xl"
                >
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-zinc-200 transition-colors hover:bg-zinc-800"
                    >
                      <Search className="h-4 w-4 shrink-0 text-zinc-500" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.form>

        {/* Filter Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.12 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-2"
        >
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleChipClick(chip)}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition-all duration-150 hover:scale-105 ${
                activeChip === chip
                  ? "border-white bg-white text-gray-900 shadow-lg shadow-white/20"
                  : "border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-700"
              }`}
            >
              {chip}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.15 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">Scroll</span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-zinc-600 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
