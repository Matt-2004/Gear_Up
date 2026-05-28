"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import CarImage from "../../../../shared/ui/Image";
import { CarDetailModel } from "../../types/car.model";

interface CarImageGalleryProps {
  car: CarDetailModel;
}

export default function CarImageGallery({ car }: CarImageGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  const images = useMemo(() => {
    if (!Array.isArray(car.images)) return [];
    return car.images.map((img) =>
      typeof img === "string" ? { url: img } : img,
    );
  }, [car.images]);

  const prev = useCallback(() => {
    setSelected((s) => (s - 1 + images.length) % images.length);
    setImgLoaded(false);
  }, [images.length]);

  const next = useCallback(() => {
    setSelected((s) => (s + 1) % images.length);
    setImgLoaded(false);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm text-zinc-200">
        No photos yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hero Image */}
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.03]">
        {/* Skeleton */}
        {!imgLoaded && (
          <div className="absolute inset-0 z-10 animate-pulse bg-white/[0.06]" />
        )}

        <div className="relative aspect-[16/9]">
          <CarImage
            src={images[selected].url}
            alt={`${car.make} ${car.model}`}
            width={1600}
            height={900}
            className="h-full w-full object-cover transition-opacity duration-150"
            sizes="(max-width: 1280px) 100vw, 1200px"
            onLoad={() => setImgLoaded(true)}
            priority
          />
        </div>

        {/* Gradient overlays for depth */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />

        {/* Counter badge */}
        <div
          data-testid="gallery-counter"
          className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md"
        >
          {selected + 1} / {images.length}
        </div>

        {/* Prev / Next */}
        {images.length > 1 && (
          <>
            {selected > 0 && (
              <button
                onClick={prev}
                data-testid="gallery-prev"
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/90 p-2.5 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {selected < images.length - 1 && (
              <button
                onClick={next}
                data-testid="gallery-next"
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/90 p-2.5 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl hover:scale-105 active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelected(idx);
                setImgLoaded(false);
              }}
              className={`relative shrink-0 w-24 h-16 cursor-pointer overflow-hidden rounded-lg transition-all duration-150 ${
                idx === selected
                  ? "ring-2 ring-primary-500 ring-offset-1 scale-105"
                  : "opacity-60 hover:opacity-100 hover:scale-105"
              }`}
            >
              <CarImage
                src={img.url}
                alt=""
                width={160}
                height={107}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
