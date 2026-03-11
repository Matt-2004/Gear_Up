"use client";

import { CarItems } from "@/types/car.types";
import CarAdditionalDetails from "@/components/Car/CarAdditionalDetails";
import CarContactSeller from "@/components/Car/CarContactSeller";
import CarDescription from "@/components/Car/CarDescription";
import CarHeader from "@/components/Car/CarHeader";
import CarImageGallery from "@/components/Car/CarImageGallery";
import CarSpecifications from "@/components/Car/CarSpecifications";
import { useState } from "react";

export default function HomeCarDetailPage({ car }: { car: CarItems }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % car.carImages.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + car.carImages.length) % car.carImages.length,
    );
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <CarHeader
          car={car}
          isFavorite={isFavorite}
          onToggleFavorite={() => setIsFavorite(!isFavorite)}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Images & Details */}
          <div className="space-y-6 lg:col-span-2">
            <CarImageGallery
              car={car}
              selectedImage={selectedImage}
              onSelectImage={setSelectedImage}
              onNextImage={nextImage}
              onPrevImage={prevImage}
            />
            <CarSpecifications car={car} />
            <CarDescription description={car.description} />
            <CarAdditionalDetails car={car} />
          </div>

          {/* Right Column - Contact Seller */}
          <div className="lg:col-span-1">
            <CarContactSeller car={car} />
          </div>
        </div>
      </div>
    </div>
  );
}
