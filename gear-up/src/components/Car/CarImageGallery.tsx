import { CarItems } from "@/app/types/car.types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface CarImageGalleryProps {
  car: CarItems;
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
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = () => {
    // Clear existing interval if any
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start new interval
    intervalRef.current = setInterval(() => {
      if (!scrollRef.current) return;
      const container = scrollRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;

      // If at the end, scroll back to start, otherwise scroll next
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollNext();
      }
    }, 6000);
  };

  const scrollNext = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: scrollRef.current.clientWidth,
      behavior: "smooth",
    });
    // Reset interval when manually clicking
    startAutoScroll();
  };

  const scrollPrevious = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: -scrollRef.current.clientWidth,
      behavior: "smooth",
    });
    // Reset interval when manually clicking
    startAutoScroll();
  };

  // Track current index based on scroll position
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollLeft / container.clientWidth);
      setCurrentIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory items-center overflow-x-scroll scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {car.carImages.map((img: { url: string }, idx: number) => (
            <Image
              key={idx}
              src={img.url}
              alt={`${car.make} ${car.model}`}
              height={800}
              width={800}
              className="block h-96 min-w-full snap-start object-cover"
            />
          ))}
        </div>

        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium z-10">
          {currentIndex + 1} / {car.carImages.length}
        </div>

        {currentIndex !== 0 && (
          <button
            onClick={scrollPrevious}
            className="absolute top-1/2 left-4 z-30 -translate-y-1/2 rounded-full bg-white/95 p-2.5 transition-all hover:bg-primary-500 hover:text-white shadow-lg hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {currentIndex < car.carImages.length - 1 && (
          <button
            onClick={scrollNext}
            className="absolute top-1/2 right-4 z-30 -translate-y-1/2 rounded-full bg-white/95 p-2.5 transition-all hover:bg-primary-500 hover:text-white shadow-lg hover:scale-110"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3 p-4">
        {car.carImages.map((img: { url: string }, idx: number) => (
          <button
            key={idx}
            onClick={() => {
              if (!scrollRef.current) return;
              scrollRef.current.scrollTo({
                left: idx * scrollRef.current.clientWidth,
                behavior: "smooth",
              });
              // Reset interval when clicking thumbnail
              startAutoScroll();
            }}
            className={`aspect-video overflow-hidden rounded-lg transition-all  ${currentIndex === idx ? "scale-105" : ""}`}
          >
            <img src={img.url} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
