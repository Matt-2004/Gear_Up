import { CarFront, Plus, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function EmptyInventoryState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in duration-150">
      {/* Icon with animated background */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="relative rounded-full bg-linear-to-br from-blue-100 to-purple-100 p-8 border border-white">
          <CarFront className="h-20 w-20 text-blue-600" />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-3xl font-bold text-gray-900 mb-3 text-center">
        No vehicles in inventory yet
      </h3>
      <p className="text-gray-600 mb-10 text-center max-w-md text-lg">
        Start building your inventory today and reach thousands of potential
        buyers.
      </p>

      {/* CTA Button */}
      <Link href="/profile/dealer/cars/add?step=1">
        <button className="group flex items-center gap-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 px-8 py-4 font-bold text-white hover:from-blue-600 hover:to-purple-600 transition-all shadow-sm hover:scale-105 active:scale-95">
          <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-150" />
          Add Your First Vehicle
        </button>
      </Link>

      {/* Feature highlights */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
        <div className="flex flex-col items-center text-center p-6 rounded-xl bg-linear-to-br from-blue-50 to-white border border-blue-100 hover:border-blue-300 transition-all group">
          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-150">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h4 className="font-bold text-gray-900 mb-1">Easy Listing</h4>
          <p className="text-sm text-gray-600">
            Quick and simple vehicle management
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-xl bg-linear-to-br from-purple-50 to-white border border-purple-100 hover:border-purple-300 transition-all group">
          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-150">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-1">Reach More Buyers</h4>
          <p className="text-sm text-gray-600">
            Connect with verified customers
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-xl bg-linear-to-br from-green-50 to-white border border-green-100 hover:border-green-300 transition-all group">
          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-150">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-1">Track Performance</h4>
          <p className="text-sm text-gray-600">Monitor views and inquiries</p>
        </div>
      </div>
    </div>
  );
}
