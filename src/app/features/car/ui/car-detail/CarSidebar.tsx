"use client";

import { formatNumber } from "@/app/shared/utils/numberFormatter";
import { CircleCheckBig, Clock, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import { CarDetailModel } from "../../types/car.model";
import { useUserData } from "@/app/features/navbar/context/UserDataContext";
import SignInOverlay from "@/app/features/home/ui/SignInOverlay";

interface CarSidebarProps {
  car: CarDetailModel;
}

export default function CarSidebar({ car }: CarSidebarProps) {
  const { user } = useUserData();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isApproved = car.status === "Approved";

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[radial-gradient(ellipse_at_center,rgba(196,231,175,0.10)_0%,rgba(196,231,175,0.03)_100%)] p-6 backdrop-blur-sm md:p-8">
      {/* Status badges */}
      <div className="mb-5 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
            isApproved
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-amber-500/15 text-amber-300"
          }`}
        >
          {isApproved ? (
            <CircleCheckBig className="h-3 w-3" />
          ) : (
            <Clock className="h-3 w-3" />
          )}
          {car.status}
        </span>
        <span className="inline-flex items-center rounded-full bg-white/[0.08] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-200">
          {car.condition}
        </span>
      </div>

      {/* Title + Favorite */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-2xl font-bold leading-tight text-white">
            {car.make} {car.model}
          </h1>
          <p className="mt-1 text-sm text-zinc-200">
            {car.year} &middot; {car.title}
          </p>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`shrink-0 cursor-pointer rounded-full p-2 transition-all ${
            isFavorite
              ? "bg-red-500/15 text-red-400"
              : "bg-white/[0.06] text-zinc-500 hover:text-red-400"
          }`}
        >
          <Heart
            className="h-5 w-5"
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Price */}
      <div className="mt-6">
        <p className="text-[28px] font-bold leading-none text-primary-200">
          ฿{formatNumber(car.price)}
        </p>
      </div>

      <hr className="my-6 border-white/[0.08]" />

      {/* CTA */}
      <button
        onClick={() => {
          if (user) {
            router.push(`/car/${car.id}/appointment`);
          } else {
            setShowAuthModal(true);
          }
        }}
        data-testid="get-appointment"
        className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-primary-600 px-6 py-4 text-base font-bold tracking-wide text-white shadow-sm transition-all duration-150 hover:bg-primary-700 active:scale-[0.98]"
      >
        Book a Test Drive
      </button>

      <p className="mt-3 text-center text-xs text-zinc-300">
        Free, no commitment needed
      </p>

      {showAuthModal &&
        createPortal(
          <SignInOverlay onClose={() => setShowAuthModal(false)} />,
          document.body,
        )}
    </div>
  );
}
