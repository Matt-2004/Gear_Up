import type { Metadata } from "next";
import PageShell from "@/app/shared/ui/PageShell";
import { BadgeCheck, MapPin, Star, CarFront, Search } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dealers — GearUp",
  description: "Browse trusted dealerships on GearUp's automotive marketplace.",
};

const MOCK_DEALERS = [
  { id: 1, name: "Premium Auto Bangkok", rating: 4.8, reviews: 234, location: "Bangkok", cars: 47, verified: true },
  { id: 2, name: "Elite Motors Thailand", rating: 4.7, reviews: 189, location: "Chiang Mai", cars: 32, verified: true },
  { id: 3, name: "Siam Luxury Cars", rating: 4.6, reviews: 156, location: "Pattaya", cars: 28, verified: true },
  { id: 4, name: "Royal Drive Auto", rating: 4.9, reviews: 312, location: "Bangkok", cars: 53, verified: true },
  { id: 5, name: "Fast Lane Motors", rating: 4.5, reviews: 98, location: "Phuket", cars: 21, verified: false },
  { id: 6, name: "Green Wheel Auto", rating: 4.4, reviews: 73, location: "Khon Kaen", cars: 15, verified: true },
];

export default function DealersPage() {
  return (
    <PageShell
      badge="Trusted Network"
      title="Find a Dealer"
      description="Browse our network of verified dealerships. Connect with trusted sellers across Thailand."
    >
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: "1,200+", label: "Dealers" },
            { value: "45k+", label: "Active Listings" },
            { value: "98%", label: "Verified" },
            { value: "24/7", label: "Support" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="mt-1 text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search dealers by name or location..."
            className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
        </div>

        {/* Dealer Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_DEALERS.map((dealer) => (
            <div
              key={dealer.id}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/50"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-900 text-lg font-bold text-white">
                  {dealer.name.charAt(0)}
                </div>
                {dealer.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-900">{dealer.name}</h3>

              <div className="mt-2 flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-900">{dealer.rating}</span>
                <span className="text-gray-500">({dealer.reviews} reviews)</span>
              </div>

              <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {dealer.location}
                </span>
                <span className="flex items-center gap-1">
                  <CarFront className="h-3.5 w-3.5" />
                  {dealer.cars} cars
                </span>
              </div>

              <Link
                href={`/car/search?dealer=${encodeURIComponent(dealer.name)}`}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary"
              >
                View Inventory
              </Link>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
