import { Car, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardHeader() {
  return (
    <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Car className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Vehicle Inventory
            </h1>
          </div>
        </div>
        <p className="text-base text-gray-600 ml-15">
          Manage your inventory, sales, and performance all in one place.
        </p>
      </div>
      <Link href="/profile/dealer/cars/add?step=1" className="shrink-0">
        <button className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3.5 font-semibold text-white hover:from-blue-600 hover:to-purple-600 transition-all shadow-sm hover:scale-105 active:scale-95">
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-150" />
          Add Vehicle
        </button>
      </Link>
    </div>
  );
}
