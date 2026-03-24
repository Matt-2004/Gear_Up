import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-2 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Vehicle Inventory
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your listings, track approval statuses, and review vehicle performance.
        </p>
      </div>
      <Link href="/profile/dealer/cars/add?step=1" className="shrink-0 w-full sm:w-auto">
        <button className="flex w-full items-center justify-center gap-2  bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-sm disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
          <Plus className="-ml-0.5 h-4 w-4" />
          Add Vehicle
        </button>
      </Link>
    </div>
  );
}
