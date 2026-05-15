import type { Metadata } from "next";
import FinancingContent from "./FinancingContent";

export const metadata: Metadata = {
  title: "Financing — GearUp",
  description:
    "Get pre-approved for auto financing with competitive rates on GearUp.",
};

export default function FinancingPage() {
  return <FinancingContent />;
}
