import type { Metadata } from "next";
import PageShell from "@/app/shared/ui/PageShell";
import { AlertTriangle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Report a Listing — GearUp",
  description: "Report a suspicious or problematic listing on GearUp.",
};

const REASONS = [
  "Inaccurate or misleading information",
  "Suspected fraud or scam",
  "Vehicle already sold",
  "Inappropriate content",
  "Duplicate listing",
  "Other",
];

export default function ReportPage() {
  return (
    <PageShell
      badge="Safety"
      title="Report a Listing"
      description="Help us keep GearUp safe and trustworthy for everyone."
    >
      <div className="max-w-2xl">
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h2 className="font-semibold text-amber-900">Before You Report</h2>
          </div>
          <p className="text-sm text-amber-800">
            If you&apos;re in immediate danger, contact local authorities first.
            For non-emergency concerns, our team reviews all reports within 24 hours.
          </p>
        </div>

        <form className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Listing URL</label>
            <input type="text" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10" placeholder="Paste the listing URL here" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Reason for Report</label>
            <div className="space-y-2">
              {REASONS.map((reason) => (
                <label key={reason} className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="radio" name="reason" className="text-primary focus:ring-primary" />
                  <span className="text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Additional Details</label>
            <textarea rows={4} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10" placeholder="Provide any additional information that might help our review..." />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-md"
          >
            Submit Report <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </PageShell>
  );
}
