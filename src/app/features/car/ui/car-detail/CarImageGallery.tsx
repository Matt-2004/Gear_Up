"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CarImage from "../../../../shared/ui/Image";
import { CarDetailModel } from "../../types/car.model";

interface CarImageGalleryProps {
  car: CarDetailModel;
  selectedImage: number;
  onSelectImage: (index: number) => void;
  onNextImage: () => void;
  onPrevImage: () => void;
}

export default function CarImageGallery({
  car,
  selectedImage,
  onSelectImage,
  onNextImage,
  onPrevImage,
}: CarImageGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(selectedImage);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const programmaticScrollRef = useRef(false);

  const parseImages = (value: CarDetailModel["images"]) => {
    if (Array.isArray(value)) {
      return value.map((img) => (typeof img === "string" ? { url: img } : img));
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.map((img) =>
            typeof img === "string" ? { url: img } : img,
          );
        }
      } catch {
        return [];
      }
    }

    return [];
  };

  const images = parseImages(car.images);

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    programmaticScrollRef.current = true;
    scrollRef.current.scrollTo({
      left: index * scrollRef.current.clientWidth,
      behavior: "smooth",
    });
    window.setTimeout(() => {
      programmaticScrollRef.current = false;
    }, 400);
  };

  const startAutoScroll = () => {
    // Clear existing interval if any
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start new interval
    intervalRef.current = setInterval(() => {
      if (!scrollRef.current || images.length === 0) return;
      const container = scrollRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;

      // If at the end, scroll back to start, otherwise scroll next
      if (container.scrollLeft >= maxScroll - 10) {
        onSelectImage(0);
      } else {
        onNextImage();
      }
    }, 6000);
  };

  // Track current index based on scroll position
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollLeft / container.clientWidth);
      setCurrentIndex(index);
      if (!programmaticScrollRef.current) {
        onSelectImage(index);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setCurrentIndex(selectedImage);
    scrollToIndex(selectedImage);
  }, [selectedImage]);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    startAutoScroll();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="overflow-hidden">
      <div className="relative rounded-2xl overflow-hidden">
        {images.length === 0 ? (
          <div className="flex h-125 items-center justify-center bg-gray-100 text-gray-500 lg:h-175">
            No images available
          </div>
        ) : (
          <>
            <div
              ref={scrollRef}
              className="flex snap-x snap-mandatory items-center overflow-x-scroll scroll-smooth"
              style={{ scrollbarWidth: "none" }}
            >
              {images.map((img: { url: string }, idx: number) => (
                <CarImage
                  key={idx}
                  src={img.url}
                  alt={`${car.make} ${car.model}`}
                  height={1400}
                  width={1400}
                  className="block h-125 lg:h-175 min-w-full snap-start object-cover"
                />
              ))}
            </div>

            <div className="absolute top-4 right-4 z-10 rounded-full bg-black/60 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>

            {currentIndex !== 0 && (
              <button
                onClick={() => {
                  onPrevImage();
                  startAutoScroll();
                }}
                className="hover:bg-primary-500 absolute top-1/2 left-4 z-30 -translate-y-1/2 rounded-full bg-white/95 p-2.5 shadow-lg transition-all hover:scale-110 hover:text-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {currentIndex < images.length - 1 && (
              <button
                onClick={() => {
                  onNextImage();
                  startAutoScroll();
                }}
                className="hover:bg-primary-500 absolute top-1/2 right-4 z-30 -translate-y-1/2 rounded-full bg-white/95 p-2.5 shadow-lg transition-all hover:scale-110 hover:text-white"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 p-4">
          {images.map((img: { url: string }, idx: number) => (
            <button
              key={idx}
              onClick={() => {
                onSelectImage(idx);
                scrollToIndex(idx);
                // Reset interval when clicking thumbnail
                startAutoScroll();
              }}
              className={`aspect-video overflow-hidden rounded-lg transition-all ${currentIndex === idx ? "scale-105" : ""}`}
            >
              <CarImage
                width={200}
                height={200}
                src={img.url}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
