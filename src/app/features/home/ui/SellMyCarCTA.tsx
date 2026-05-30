"use client";

import Link from "next/link";
import { useUserData } from "../../navbar/context/UserDataContext";
import { useRouter } from "next/navigation";
import SignInOverlay from "./SignInOverlay";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function AnimatedStat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          obs.disconnect();
          animate();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();

    function animate() {
      let start = 0;
      const duration = 1000;
      const steps = 30;
      const inc = value / steps;
      const timer = setInterval(() => {
        start += inc;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, duration / steps);
    }
  }, [value]);

  return (
    <div ref={ref}>
      <p className="text-lg font-bold text-white">
        {count}
        {suffix}
      </p>
      <p className="text-xs text-zinc-500">{label}</p>
    </div>
  );
}

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
    <section
      className="relative flex w-full justify-center overflow-hidden py-20 md:py-28"
      style={{
        background: "linear-gradient(180deg, #0a0f05 0%, #050802 100%)",
      }}
    >
      {/* Green gradient accent */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-primary-600/[0.03] blur-3xl" />
      <div className="relative z-10 w-full px-4 lg:w-[90%] xl:w-[75%]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.15,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
          }}
          className="relative overflow-hidden rounded-3xl "
        >
          {/* Subtle top glow */}
          <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 h-48 w-[500px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)]" />

          <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-16 md:px-14 md:py-24 text-center">
            <h2 className="max-w-lg font-serif text-3xl font-bold leading-tight text-white md:text-5xl">
              Sell Your Car Faster,{" "}
              <span className="text-primary-500">Safer</span>
            </h2>

            <p className="max-w-md text-base leading-relaxed text-gray-300">
              List your vehicle on Thailand&apos;s most trusted automotive
              marketplace. Reach thousands of verified buyers and close deals in
              days, not months.
            </p>

            <Link
              onClick={handleSellCarClick}
              href="/profile/dealer/register?step=1"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-primary-600/80 active:scale-[0.98]"
            >
              List Your Car
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Testimonials */}
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:gap-8">
              <blockquote className="max-w-xs border-l-2 border-primary-600/40 pl-4 text-left">
                <p className="text-sm leading-relaxed text-zinc-400 italic">
                  &ldquo;Sold my car in 3 days. The escrow payment gave me peace
                  of mind and the process was incredibly smooth.&rdquo;
                </p>
                <footer className="mt-2 text-xs text-zinc-500">
                  — Khun Somsak, Bangkok
                </footer>
              </blockquote>
              <blockquote className="max-w-xs border-l-2 border-primary-600/40 pl-4 text-left">
                <p className="text-sm leading-relaxed text-zinc-400 italic">
                  &ldquo;Listed my BMW and got 5 serious inquiries within 24
                  hours. GearUp made selling effortless.&rdquo;
                </p>
                <footer className="mt-2 text-xs text-zinc-500">
                  — Khun Nattaya, Chiang Mai
                </footer>
              </blockquote>
            </div>

            {/* Trust stats row — animated counters */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-8 text-center">
              <AnimatedStat value={12} suffix="K+" label="Cars Sold" />
              <AnimatedStat value={8.5} suffix="K+" label="Happy Sellers" />
              <AnimatedStat value={48} suffix="h" label="Avg. Time to Sell" />
            </div>
          </div>
        </motion.div>
      </div>
      {showAuthModal && (
        <SignInOverlay onClose={() => setShowAuthModal(false)} />
      )}
    </section>
  );
}
