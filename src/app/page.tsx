import { CarGrid } from "@/components/Car/CarGrid";
import HeroSection from "@/components/Home/HeroSection";
import SellMyCarCTA from "@/components/Home/SellMyCarCTA";
import ValuePropositionSection from "@/components/Home/ValuePropositionSection";
import HomeFooter from "@/components/Home/HomeFooter";
import { getAllCars } from "@/utils/API/CarAPI";
import { Metadata } from "next";

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
