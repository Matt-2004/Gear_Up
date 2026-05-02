"use client";

import Image from "next/image";
import Link from "next/link";
import { useUserData } from "../../navbar/context/UserDataContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SignInOverlay from "./SignInOverlay";

export default function SellMyCarCTA() {
  const { user } = useUserData();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSellCarClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!user) {
      // Handle unauthenticated user
      setShowAuthModal(true);
    } else {
      // User is authenticated, proceed with selling car
      router.push("/profile/dealer/register?step=1");
    }
  };

  return (
    <section className="flex w-full justify-center pb-14">
      <div className="w-full px-4 lg:w-[90%] xl:w-[75%]">
        <div className="bg-primary-700 relative overflow-hidden rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 text-white md:p-10">
              <h2 className="text-2xl font-bold md:text-3xl">
                Maximize Your Vehicle&apos;s Worth
              </h2>
              <p className="text-primary-100 mt-2">
                List your car on the industry&apos;s most precise marketing
                platform. We connect you with verified premium buyers in
                minutes.
              </p>
              <Link
                onClick={handleSellCarClick}
                href="/profile/dealer/register?step=1"
                className="text-primary-700 mt-5 inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold transition-colors hover:bg-gray-100"
              >
                Sell My Car Now
              </Link>
            </div>

            <div className="relative min-h-56">
              <Image
                src="/carImages/8.jpg"
                alt="Sell your car"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-l from-transparent to-primary-700/50" />
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
