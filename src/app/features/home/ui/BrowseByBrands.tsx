"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const BRANDS = [
  { name: "Toyota", logo: "/brands/toyota.png" },
  { name: "Honda", logo: "/brands/honda.png" },
  { name: "Ford", logo: "/brands/ford.svg" },
  { name: "BMW", logo: "/brands/bmw.png" },
  { name: "Mercedes", logo: "/brands/mercedes.png" },
  { name: "Nissan", logo: "/brands/nissan.png" },
  { name: "Mazda", logo: "/brands/mazada.png" },
  { name: "Mitsubishi", logo: "/brands/mitsubishi.png" },
  { name: "Isuzu", logo: "/brands/isuzu.png" },
  { name: "Suzuki", logo: "/brands/suzuki.png" },
  { name: "Volkswagen", logo: "/brands/volkswagen.png" },
  { name: "Hyundai", logo: "/brands/hyundai.png" },
  { name: "Kia", logo: "/brands/kia.png" },
  { name: "Subaru", logo: "/brands/subaru.png" },
  { name: "Chevrolet", logo: "/brands/chevrolet.png" },
  { name: "MG", logo: "/brands/mg.png" },
  { name: "BYD", logo: "/brands/byd.png" },
  { name: "Tesla", logo: "/brands/tesla.png" },
  { name: "Volvo", logo: "/brands/volvo.png" },
  { name: "Lexus", logo: "/brands/lexus.svg" },
];

const SCROLL_BRANDS = [...BRANDS, ...BRANDS];

export default function BrowseByBrands() {
  return (
    <section
      className="relative flex w-full justify-center overflow-hidden py-20 md:py-28"
      style={{
        background: "linear-gradient(180deg, #0a0f05 0%, #000000 100%)",
      }}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 rounded-full bg-primary-600/3 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-emerald-600/2 blur-3xl" />

      <div className="relative z-10 w-full px-4 lg:w-[90%] xl:w-[75%]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <h2 className="font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
            Browse by <span className="text-primary-400">Brand</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">
            Explore vehicles from the world&apos;s most trusted manufacturers.
            Find your perfect match from 20+ brands.
          </p>
        </motion.div>

        {/* Row 1 */}
        <div className="relative mb-4 overflow-hidden">
          <div className="animate-scroll-horizontal flex gap-3">
            {SCROLL_BRANDS.map((brand, i) => (
              <div
                key={`${brand.name}-${i}`}
                className="flex h-16 shrink-0 items-center gap-4 rounded-xl border border-white/5 bg-white/3 px-6 transition-colors hover:border-white/15 hover:bg-white/6"
              >
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={80}
                  height={32}
                  className="h-6 w-auto object-contain opacity-90"
                  unoptimized
                />
                <span className="text-sm font-medium text-zinc-300 whitespace-nowrap">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 (reverse) */}
        <div className="relative overflow-hidden">
          <div className="animate-scroll-horizontal-reverse flex gap-3">
            {SCROLL_BRANDS.map((brand, i) => (
              <div
                key={`${brand.name}-${i}`}
                className="flex h-16 shrink-0 items-center gap-4 rounded-xl border border-white/5 bg-white/3 px-6 transition-colors hover:border-white/15 hover:bg-white/6"
              >
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={80}
                  height={32}
                  className="h-6 w-auto object-contain opacity-90"
                  unoptimized
                />
                <span className="text-sm font-medium text-zinc-300 whitespace-nowrap">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
