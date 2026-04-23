import { CarFront, Plus, MousePointerClick, Users, LineChart } from "lucide-react";
import Link from "next/link";

export default function EmptyInventoryState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in duration-150">
      <div className="mb-6  bg-gray-50 border-2 border-dashed border-gray-200 p-8 text-gray-400">
        <CarFront className="h-16 w-16" />
      </div>

      <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-2 text-center">
        No vehicles found
      </h3>
      <p className="text-sm font-medium text-gray-500 mb-8 text-center max-w-sm">
        Start building your inventory today to reach potential buyers and grow your dealership.
      </p>

      <Link href="/profile/dealer/cars/add?step=1">
        <button className="group relative inline-flex items-center gap-2 overflow-hidden  bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 active:scale-95">
          <Plus className="-ml-0.5 h-5 w-5" />
          Add First Vehicle
        </button>
      </Link>

      {/* Highlights */}
      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl w-full">
        <div className="flex flex-col items-center text-center p-6  bg-white border border-gray-200 shadow-sm transition-shadow-sm hover:shadow-sm">
          <div className="h-10 w-10  bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
            <MousePointerClick className="h-5 w-5 text-gray-600" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 mb-1">Easy Listing</h4>
          <p className="text-xs text-gray-500">Quickly upload details & images</p>
        </div>

        <div className="flex flex-col items-center text-center p-6  bg-white border border-gray-200 shadow-sm transition-shadow-sm hover:shadow-sm">
          <div className="h-10 w-10  bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
            <Users className="h-5 w-5 text-gray-600" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 mb-1">Reach Buyers</h4>
          <p className="text-xs text-gray-500">Connect with interested prospects</p>
        </div>

        <div className="flex flex-col items-center text-center p-6  bg-white border border-gray-200 shadow-sm transition-shadow-sm hover:shadow-sm">
          <div className="h-10 w-10  bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
            <LineChart className="h-5 w-5 text-gray-600" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 mb-1">Track Data</h4>
          <p className="text-xs text-gray-500">Monitor engagement seamlessly</p>
        </div>
      </div>
    </div>
  );
}
