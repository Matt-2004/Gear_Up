"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import carSuggestionsData from "@/../public/carSuggestions.json";

export default function HeroSection() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  const heroImages = [
    {
      src: "/carImages/1.jpg",
      layout:
        "col-span-2 row-span-2 md:col-span-2 md:row-span-2 lg:col-span-4 lg:row-span-2",
    },
    {
      src: "/carImages/2.jpg",
      layout:
        "col-span-1 row-span-1 md:col-span-2 md:row-span-1 lg:col-span-4 lg:row-span-1",
    },
    {
      src: "/carImages/3.jpg",
      layout:
        "col-span-1 row-span-1 md:col-span-2 md:row-span-1 lg:col-span-4 lg:row-span-1",
    },
    {
      src: "/carImages/4.jpg",
      layout:
        "col-span-1 row-span-1 md:col-span-2 md:row-span-1 lg:col-span-4 lg:row-span-1",
    },
    {
      src: "/carImages/5.jpg",
      layout:
        "col-span-1 row-span-1 md:col-span-2 md:row-span-1 lg:col-span-4 lg:row-span-1",
    },
    {
      src: "/carImages/6.jpg",
      layout:
        "col-span-2 row-span-1 md:col-span-3 md:row-span-1 lg:col-span-6 lg:row-span-1",
    },
    {
      src: "/carImages/7.jpg",
      layout:
        "col-span-2 row-span-1 md:col-span-3 md:row-span-1 lg:col-span-6 lg:row-span-1",
    },
  ];

  return (
    <section className="w-full px-4 py-6 md:py-10">
      <div className="mx-auto w-full lg:w-[90%] xl:w-[75%]">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="grid grid-flow-dense auto-rows-[110px] grid-cols-2 gap-2 md:auto-rows-[130px] md:grid-cols-6 md:gap-3 lg:auto-rows-[140px] lg:grid-cols-12">
            {heroImages.map((item, index) => (
              <div
                key={`${item.src}-${index}`}
                className={`relative overflow-hidden rounded-xl ${item.layout}`}
              >
                <Image
                  src={item.src}
                  alt={`Car image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={index < 2}
                />
              </div>
            ))}
          </div>

          <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/35 to-black/45" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
            <h1 className="text-center text-3xl font-bold text-white drop-shadow-md md:text-5xl">
              Find Your Next Car
            </h1>

            <form
              onSubmit={handleSearchSubmit}
              className="relative flex w-full max-w-lg items-center gap-2 rounded-xl border border-white/40 p-2 shadow-lg backdrop-blur-md md:max-w-lg lg:w-2/3 lg:max-w-none"
            >
              <Search className="mx-4 h-5 w-5 text-white/90" />

              <div ref={searchContainerRef} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  placeholder="Search by make, model, or year..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/75 focus:outline-none"
                />

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-11 z-50 max-h-64 w-full overflow-y-auto rounded-xl border border-white/15 bg-black/85 py-1 shadow-2xl backdrop-blur-xl">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-white transition-colors hover:bg-white/10"
                      >
                        <Search className="h-4 w-4 shrink-0 text-white/70" />
                        <span>{suggestion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg border border-primary/50 bg-primary-600 px-4 py-2 text-xs font-semibold whitespace-nowrap text-white backdrop-blur-md transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70 md:text-sm"
              >
                {isPending ? "Searching..." : "Search"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
