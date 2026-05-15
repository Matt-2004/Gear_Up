"use client";

import { useEffect, useState } from "react";
import { SCROLL_THRESHOLD } from "../constants";

export function useScrollAware(threshold: number = SCROLL_THRESHOLD) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}
