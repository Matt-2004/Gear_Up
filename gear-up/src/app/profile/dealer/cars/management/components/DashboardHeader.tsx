import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardHeader() {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Vehicle Inventory</h1>
        <p className="text-base text-gray-600">
          Manage your inventory, sales, and performance all in one place.
        </p>
      </div>
      <Link href="/profile/dealer/cars/add?step=1">
        <button className="flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-3 font-semibold text-white hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg">
          <Plus className="h-5 w-5" />
          Add Vehicle
        </button>
      </Link>
    </div>
  );
}
