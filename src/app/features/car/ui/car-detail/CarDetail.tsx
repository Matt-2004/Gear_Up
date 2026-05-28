"use client";

import CarDescription from "@/app/features/car/ui/car-detail/CarDescription";
import CarImageGallery from "@/app/features/car/ui/car-detail/CarImageGallery";
import CarSidebar from "@/app/features/car/ui/car-detail/CarSidebar";
import CarSpecifications from "@/app/features/car/ui/car-detail/CarSpecifications";
import { CarDetailModel } from "../../types/car.model";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { lazy, Suspense, useMemo } from "react";

const MoreCarOptions = lazy(() => import("./MoreCarOptions"));

const PAGE_GRADIENT =
  "linear-gradient(180deg, #000000 0%, #0a0f05 3%, #061E09 50%, #0a0f05 97%, #000000 100%)";

function toLabel(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CarDetail({ car }: { car: CarDetailModel }) {
  const pathname = usePathname();

  const crumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((seg, i) => {
      const href = "/" + segments.slice(0, i + 1).join("/");
      const isLast = i === segments.length - 1;
      const label = isLast ? `${car.make} ${car.model}` : toLabel(seg);
      return { href, label, isLast };
    });
  }, [pathname, car.make, car.model]);

  return (
    <div className="relative min-h-screen" style={{ background: PAGE_GRADIENT }}>
      {/* Breadcrumb */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-4 md:pt-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          {crumbs.map((crumb) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3" />
              {crumb.isLast ? (
                <span className="text-zinc-200" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="transition-colors hover:text-white">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Cinematic Gallery */}
      <div className="relative z-10 pb-8 md:pb-12">
        <div className="mx-auto max-w-7xl px-4 pt-6 md:pt-8">
          <CarImageGallery car={car} />
        </div>
      </div>

      {/* Two-column content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="space-y-16 lg:col-span-2">
            <section>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary-300">
                Overview
              </p>
              <h2 className="mt-3 font-serif text-2xl font-bold text-white md:text-3xl">
                About This Vehicle
              </h2>
              <p className="mt-2 text-sm text-zinc-200">
                Everything you need to know about this vehicle
              </p>
              <div className="mt-6">
                <CarDescription description={car.description} />
              </div>
            </section>

            <section>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary-300">
                Specifications
              </p>
              <h2 className="mt-3 font-serif text-2xl font-bold text-white md:text-3xl">
                Performance &amp; Details
              </h2>
              <p className="mt-2 text-sm text-zinc-200">
                What powers this vehicle
              </p>
              <div className="mt-6">
                <CarSpecifications car={car} />
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CarSidebar car={car} />
            </div>
          </div>
        </div>
      </div>

      {/* More Car Options — lazy loaded below the fold */}
      <Suspense>
        <MoreCarOptions currentCarId={car.id} />
      </Suspense>
    </div>
  );
}
