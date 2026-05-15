"use client";

import Image from "next/image";
import Link from "next/link";
import { useUserData } from "../../navbar/context/UserDataContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SignInOverlay from "./SignInOverlay";
import { ArrowRight } from "lucide-react";

export default function SellMyCarCTA() {
  const { user } = useUserData();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSellCarClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
    } else {
      router.push("/profile/dealer/register?step=1");
    }
  };

  return (
    <section className="flex w-full justify-center pb-16 md:pb-20">
      <div className="w-full px-4 lg:w-[90%] xl:w-[75%]">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background Image */}
          <Image
            src="/carImages/8.jpg"
            alt="Sell your car on GearUp"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 90vw"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.85),rgba(0,0,0,0.5),rgba(0,0,0,0.3))]" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-start gap-6 px-6 py-14 md:px-12 md:py-20">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              For Dealers &amp; Private Sellers
            </span>

            <h2 className="max-w-md text-3xl font-bold leading-tight text-white md:text-4xl">
              Sell Your Car Faster
            </h2>

            <p className="max-w-md text-base leading-relaxed text-white/70">
              List your vehicle on the most trusted automotive marketplace.
              Reach thousands of verified buyers and close deals in days, not
              months.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                onClick={handleSellCarClick}
                href="/profile/dealer/register?step=1"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-100 hover:shadow-lg active:scale-[0.98]"
              >
                List Your Car
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/car/search"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15"
              >
                Browse Cars
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { value: "10k+", label: "Active Listings" },
                { value: "50k+", label: "Happy Buyers" },
                { value: "24h", label: "Avg. Response" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showAuthModal && (
        <SignInOverlay onClose={() => setShowAuthModal(false)} />
      )}
    </section>
  );
}
