import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About — GearUp",
  description:
    "Learn about GearUp — the most trusted automotive marketplace in Thailand.",
};

export default function AboutPage() {
  return <AboutContent />;
}
