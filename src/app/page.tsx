import { CarGrid } from "./features/car/ui/car-card/CarGrid";
import HeroSection from "@/app/features/home/ui/HeroSection";
import SellMyCarCTA from "@/app/features/home/ui/SellMyCarCTA";
import ValuePropositionSection from "@/app/features/home/ui/ValuePropositionSection";
import HomeFooter from "@/app/features/home/ui/HomeFooter";
import { Metadata } from "next";
import { getAllCars } from "./shared/utils/API/CarAPI";
import { carMapper } from "./features/car/types/car.mapper";

export const metadata: Metadata = {
  title: "Gear Up - Your Ultimate Car Marketplace",
  description:
    "Discover, buy, and sell amazing vehicles on Gear Up. Find your dream car today!",
};

export const dynamic = "force-dynamic";

export default async function HOME() {
  const cars = await getAllCars(null);
  const data = cars.data.items.map(carMapper) ?? [];

  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection />
      <CarGrid cars={data} />
      <ValuePropositionSection />
      <SellMyCarCTA />
      <HomeFooter />
    </main>
  );
}
