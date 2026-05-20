"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface StaleDataBannerProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function StaleDataBanner({
  onRefresh,
  isRefreshing,
}: StaleDataBannerProps) {
  const [visible, setVisible] = useState(true);

  // Dismiss when refresh succeeds (isRefreshing goes false while we're visible = success)
  useEffect(() => {
    if (!isRefreshing && visible) {
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isRefreshing, visible]);

  if (!visible) return null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
      <div className="flex items-center gap-2.5 text-amber-700">
        <RefreshCw className="h-4 w-4 shrink-0" />
        <span>Showing previously loaded data</span>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isRefreshing ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <RefreshCw className="h-3 w-3" />
        )}
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  );
}
