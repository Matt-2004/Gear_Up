import { CarFront, Plus } from "lucide-react";
import Link from "next/link";

export default function EmptyInventoryState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary-100 rounded-full blur-2xl opacity-30"></div>
        <div className="relative mx-auto h-32 w-32 rounded-full bg-linear-to-br from-primary-50 to-primary-100 flex items-center justify-center border-4 border-white shadow-xl">
          <CarFront className="h-16 w-16 text-primary-500" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Your Inventory is Empty
      </h3>
      <p className="text-base text-gray-600 mb-2 max-w-md text-center">
        Start building your vehicle inventory by adding your first car listing.
      </p>
      <p className="text-sm text-gray-500 mb-8 max-w-md text-center">
        Showcase your vehicles to thousands of potential buyers and grow your
        dealership.
      </p>
      <Link href="/profile/dealer/cars/add?step=1">
        <button className="flex items-center gap-2 rounded-lg bg-primary-500 px-8 py-3.5 font-semibold text-white hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl hover:scale-105">
          <Plus className="h-5 w-5" />
          Add Your First Vehicle
        </button>
      </Link>
      <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl">
        <div className="text-center">
          <div className="h-12 w-12 mx-auto mb-3 rounded-lg bg-blue-50 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-blue-500"
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
          <p className="text-xs font-medium text-gray-600">Easy Listing</p>
        </div>
        <div className="text-center">
          <div className="h-12 w-12 mx-auto mb-3 rounded-lg bg-green-50 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <p className="text-xs font-medium text-gray-600">High Visibility</p>
        </div>
        <div className="text-center">
          <div className="h-12 w-12 mx-auto mb-3 rounded-lg bg-purple-50 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <p className="text-xs font-medium text-gray-600">Boost Sales</p>
        </div>
      </div>
    </div>
  );
}
