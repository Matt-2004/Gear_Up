import type { Metadata } from "next";
import PageShell from "@/app/shared/ui/PageShell";
import { Briefcase, MapPin, Clock, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers — GearUp",
  description: "Join the GearUp team and help build the future of automotive marketplaces.",
};

const OPENINGS = [
  { title: "Senior Frontend Engineer", team: "Engineering", location: "Bangkok", type: "Full-time" },
  { title: "Product Designer", team: "Design", location: "Bangkok / Remote", type: "Full-time" },
  { title: "Backend Engineer (Go)", team: "Engineering", location: "Bangkok", type: "Full-time" },
  { title: "Dealer Success Manager", team: "Operations", location: "Bangkok", type: "Full-time" },
  { title: "Data Analyst", team: "Data", location: "Bangkok", type: "Full-time" },
  { title: "Content Marketing Manager", team: "Marketing", location: "Bangkok / Remote", type: "Full-time" },
];

const PERKS = [
  "Competitive salary and equity package",
  "Flexible work arrangements",
  "Health and wellness benefits",
  "Learning and development budget",
  "Team offsites and events",
  "Latest equipment of your choice",
];

export default function CareersPage() {
  return (
    <PageShell
      badge="Join Us"
      title="Careers at GearUp"
      description="Help us build the world's most trusted automotive marketplace."
    >
      <div className="space-y-16">
        {/* Mission */}
        <div className="rounded-3xl bg-gray-900 p-8 text-white md:p-12">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-red-400" />
            <span className="text-sm font-semibold uppercase tracking-wide text-gray-400">Why GearUp</span>
          </div>
          <p className="max-w-2xl text-xl leading-relaxed">
            We&apos;re a team of builders, designers, and car enthusiasts on a mission
            to make buying and selling cars as easy as booking a flight.
          </p>
        </div>

        {/* Perks */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Benefits & Perks</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PERKS.map((perk) => (
              <div key={perk} className="rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm text-sm font-medium text-gray-700">
                {perk}
              </div>
            ))}
          </div>
        </div>

        {/* Openings */}
        <div>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Briefcase className="h-5 w-5 text-primary" /> Open Positions
          </h2>
          <div className="space-y-3">
            {OPENINGS.map((job) => (
              <div key={job.title} className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-sm transition-all hover:border-primary-100 hover:shadow-md">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{job.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span>{job.team}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {job.type}</span>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-700"
                >
                  Apply <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
