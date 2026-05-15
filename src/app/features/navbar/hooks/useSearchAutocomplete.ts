"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import carSuggestions from "../../../../../public/carSuggestions.json";

export function useSearchAutocomplete() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const lowerQuery = query.toLowerCase();
      const filtered: string[] = [];

      for (const group of carSuggestions) {
        if (group.make.toLowerCase().includes(lowerQuery)) {
          filtered.push(
            ...group.model.map((m) => `${group.make} ${m}`),
          );
        } else {
          for (const model of group.model) {
            const full = `${group.make} ${model}`;
            if (full.toLowerCase().includes(lowerQuery)) filtered.push(full);
          }
        }
        if (filtered.length >= 8) break;
      }

      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(filtered.length > 0);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Focus input when expanded
  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  const navigate = useCallback(
    (searchQuery: string) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) return;
      setShowSuggestions(false);
      router.push(`/car/search?query=${encodeURIComponent(trimmed)}`);
    },
    [router],
  );

  const open = useCallback(() => setExpanded(true), []);
  const close = useCallback(() => {
    setExpanded(false);
    setQuery("");
    setShowSuggestions(false);
  }, []);

  const collapseIfEmpty = useCallback(() => {
    if (!query.trim()) {
      setExpanded(false);
    }
  }, [query]);

  return {
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
  };
}
