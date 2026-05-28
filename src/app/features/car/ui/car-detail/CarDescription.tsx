"use client";

import { useState } from "react";

interface CarDescriptionProps {
  description: string;
}

const WORD_LIMIT = 50;

function truncateWords(text: string, limit: number): string {
  const words = text.split(/\s+/);
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(" ") + "...";
}

export default function CarDescription({ description }: CarDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const words = description.split(/\s+/);
  const isLong = words.length > WORD_LIMIT;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[radial-gradient(ellipse_at_center,rgba(196,231,175,0.10)_0%,rgba(196,231,175,0.03)_100%)] p-6 backdrop-blur-sm md:p-8">
      <p className="leading-7 tracking-wide text-zinc-200">
        {isLong && !expanded ? truncateWords(description, WORD_LIMIT) : description}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs font-semibold text-primary-300 transition-colors hover:text-primary-200 cursor-pointer"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}
