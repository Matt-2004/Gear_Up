import { Metadata } from "next";
import NotFoundContent from "./shared/ui/NotFoundContent";

export const metadata: Metadata = {
  title: "Page Not Found - Gear Up",
};

export default function NotFound() {
  return <NotFoundContent />;
}
