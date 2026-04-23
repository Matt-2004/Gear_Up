import { CarGrid } from "./features/car/ui/car-card/CarGrid";
import HeroSection from "@/app/features/home/ui/HeroSection";
import SellMyCarCTA from "@/app/features/home/ui/SellMyCarCTA";
import ValuePropositionSection from "@/app/features/home/ui/ValuePropositionSection";
import HomeFooter from "@/app/features/home/ui/HomeFooter";
import { Metadata } from "next";
import { getAllCars } from "./shared/utils/API/CarAPI";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gear Up - Your Ultimate Car Marketplace",
  description:
    "Discover, buy, and sell amazing vehicles on Gear Up. Find your dream car today!",
};

export default async function HOME() {
  let cars = [];

  try {
    const response = await getAllCars(null);
    cars = response?.data?.items || [];
  } catch (error) {
    console.error("Failed to fetch cars:", error);
  }

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
