"use client";

import { CarItems } from "@/app/features/car/types/car.types";
import CarAdditionalDetails from "@/app/features/car/ui/car-detail/CarAdditionalDetails";
import CarContactSeller from "@/app/features/car/ui/car-detail/CarContactSeller";
import CarDescription from "@/app/features/car/ui/car-detail/CarDescription";
import CarHeader from "@/app/features/car/ui/car-detail/CarHeader";
import CarImageGallery from "@/app/features/car/ui/car-detail/CarImageGallery";
import CarSpecifications from "@/app/features/car/ui/car-detail/CarSpecifications";
import { useState } from "react";

export default function CarDetail({ car }: { car: CarItems }) {
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
    <div className="min-h-screen bg-white pb-16">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content Area (Left, 66%) */}
          <div className="lg:col-span-2 space-y-12">
            <div className="overflow-hidden rounded-2xl">
              <CarImageGallery
                car={car}
                selectedImage={selectedImage}
                onSelectImage={setSelectedImage}
                onNextImage={nextImage}
                onPrevImage={prevImage}
              />
            </div>

            <div className="border-b border-gray-100 pb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Key Specifications
              </h2>
              <CarSpecifications car={car} />
            </div>

            <div className="border-b border-gray-100 pb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Description
              </h2>
              <CarDescription description={car.description} />
            </div>

            <div className="p-8 rounded-lg bg-[#F3F4EB]">
              <CarAdditionalDetails car={car} />
            </div>
          </div>

          {/* Sidebar Area (Right, 33%) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 p-6 md:p-8">
                <CarHeader
                  car={car}
                  isFavorite={isFavorite}
                  onToggleFavorite={() => setIsFavorite(!isFavorite)}
                />

                <hr className="my-6 border-gray-100" />

                <CarContactSeller car={car} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
