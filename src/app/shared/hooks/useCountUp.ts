"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  target: number;
  duration?: number;
  suffix?: string;
  format?: boolean;
}

export function useCountUp({
  target,
  duration = 1200,
  suffix = "",
  format = true,
}: UseCountUpOptions) {
  const [mounted, setMounted] = useState(false);
  const [displayValue, setDisplayValue] = useState(
    format ? target.toLocaleString("en-US") + suffix : String(target) + suffix,
  );
  const ref = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const startAnimation = useCallback(() => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      setDisplayValue(
        format
          ? current.toLocaleString("en-US") + suffix
          : String(current) + suffix,
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration, suffix, format]);

  useEffect(() => {
    if (!mounted) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, startAnimation]);

  return { ref, displayValue };
}
