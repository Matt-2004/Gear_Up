import { CarGrid } from "./features/car/ui/car-card/CarGrid";
import HeroSection from "@/app/features/home/ui/HeroSection";
import SellMyCarCTA from "@/app/features/home/ui/SellMyCarCTA";
import ValuePropositionSection from "@/app/features/home/ui/ValuePropositionSection";
import HomeFooter from "@/app/features/home/ui/HomeFooter";
import { Metadata } from "next";
import { getAllCars } from "./shared/utils/API/CarAPI";

export const metadata: Metadata = {
  title: "Gear Up - Your Ultimate Car Marketplace",
  description:
    "Discover, buy, and sell amazing vehicles on Gear Up. Find your dream car today!",
};

export default async function HOME() {
  const response = await getAllCars(null);
  const cars = response?.data?.items;

  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection />
      <CarGrid cars={cars} />
      <ValuePropositionSection />
      <SellMyCarCTA />
      <HomeFooter />
    </main>
  );
}
