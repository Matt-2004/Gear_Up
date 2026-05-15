import type { Metadata } from "next";
import PageShell from "@/app/shared/ui/PageShell";
import { Newspaper, Download, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Press — GearUp",
  description: "Press releases, media resources, and brand assets for GearUp.",
};

const RELEASES = [
  { date: "May 10, 2026", title: "GearUp Surpasses 50,000 Verified Vehicle Transactions" },
  { date: "Apr 22, 2026", title: "GearUp Expands Dealer Network to All 77 Provinces in Thailand" },
  { date: "Mar 15, 2026", title: "GearUp Raises Series A Funding to Accelerate Marketplace Growth" },
  { date: "Feb 8, 2026", title: "Introducing Instant Booking: Schedule Test Drives in Under 60 Seconds" },
  { date: "Jan 20, 2026", title: "GearUp Launches AI-Powered Vehicle Price Estimation Tool" },
];

export default function PressPage() {
  return (
    <PageShell
      badge="Media"
      title="Press & Media"
      description="Latest news, press releases, and brand resources."
    >
      <div className="max-w-3xl space-y-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-center">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-900">Media Inquiries</h3>
            <p className="mt-1 text-sm text-gray-500">press@gearup.com</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-center">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
              <Download className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-900">Brand Assets</h3>
            <p className="mt-1 text-sm text-gray-500">Logos, screenshots, and brand guidelines</p>
          </div>
        </div>

        <div>
          <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-gray-900">
            <Newspaper className="h-5 w-5 text-primary" /> Press Releases
          </h2>
          <div className="space-y-3">
            {RELEASES.map((r) => (
              <div key={r.title} className="rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-sm transition-colors hover:bg-gray-50">
                <p className="text-xs text-gray-400">{r.date}</p>
                <p className="mt-1 font-semibold text-gray-900">{r.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
