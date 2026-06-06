import { CarGrid } from "./features/car/ui/car-card/CarGrid";
import HeroSection from "@/app/features/home/ui/HeroSection";
import SellMyCarCTA from "@/app/features/home/ui/SellMyCarCTA";
import BuyerJourneySection from "@/app/features/home/ui/BuyerJourneySection";
import TrustSafetySection from "@/app/features/home/ui/TrustSafetySection";
import BrowseByBrands from "@/app/features/home/ui/BrowseByBrands";
import HomeFooter from "@/app/features/home/ui/HomeFooter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gear Up — Thailand's Most Trusted Car Marketplace",
  description:
    "Discover, buy, and sell amazing vehicles on Gear Up. Browse verified listings, book test drives instantly, and drive away with confidence.",
};

export default function HOME() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CarGrid />
      <BuyerJourneySection />
      <TrustSafetySection />
      <BrowseByBrands />
      <SellMyCarCTA />
      <HomeFooter />
    </main>
  );
}
