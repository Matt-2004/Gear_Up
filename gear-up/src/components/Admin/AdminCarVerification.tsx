"use client";

import { AdminCarApprovalData } from "@/app/types/Admin_Car_Approval";
import { CarItems } from "@/app/types/car.types";
import { CursorBaseDTO } from "@/app/types/post.types";
import CarDataTable from "@/components/Admin/CarDataTable";
import FilterProvider, {
	CarConditionType,
	CarStatusType,
	FuelTypeFilter,
	useCarFilterContext,
} from "@/Context/AdminCarFilterContext";
import { carFilter } from "@/utils/CarFilter";
import {
	Car,
	CircleCheck,
	CircleX,
	Clock,
	Filter as FilterIcon,
	Fuel,
	LayoutGrid,
	Search,
	SlidersHorizontal,
} from "lucide-react";

const AdminCarVerification = ({
	cars,
}: {
	cars: AdminCarApprovalData;
}) => {
	if (!cars) {
		return <h3>Car data missing</h3>;
	}
	return (
		<FilterProvider>
			<div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100/50 p-8">
				<div className="mx-auto max-w-7xl space-y-8">
					{/* Header */}
					<div className="space-y-2">
						<h1 className="text-4xl font-bold text-gray-900">
							Car Verification
						</h1>
						<p className="text-lg text-gray-600">
							Review and verify dealer-submitted car listings
						</p>
					</div>					{/* Stats Cards */}
					<div className="grid gap-6 md:grid-cols-4">
						<StatusCountComponent status="All" cars={cars} />
						<StatusCountComponent status="Pending" cars={cars} />
						<StatusCountComponent status="Approved" cars={cars} />
						<StatusCountComponent status="Rejected" cars={cars} />
					</div>

					{/* Filter Section */}
					<div className="rounded-2xl bg-white p-6 shadow-md border border-gray-100">
						<FilterUI />
					</div>

					{/* Data Table */}
					<div className="rounded-2xl bg-white shadow-md border border-gray-100 overflow-hidden">
						<CarDataTable cars={cars.items} />
					</div>
				</div>
			</div>
		</FilterProvider>
	);
};

const FilterUI = () => {
	const { filter, setFilter, clearFilters } = useCarFilterContext();

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-4">
				<div className="flex flex-1 items-center gap-4">
					{/* Search Input */}
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
						<input
							className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all shadow-sm"
							type="text"
							placeholder="Search by car name, make, model, or ID..."
							value={filter.searchData}
							onChange={(e) => setFilter({ searchData: e.currentTarget.value })}
						/>
					</div>

					{/* Status Filter */}
					<div className="relative">
						<select
							name="status-type"
							id="car-status"
							className="cursor-pointer appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 pr-10 text-gray-700 font-medium focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all hover:border-primary-300 shadow-sm"
							value={filter.statusType}
							onChange={(e) =>
								setFilter({ statusType: e.currentTarget.value as CarStatusType })
							}
						>
							<option value="All">All Status</option>
							<option value="Pending">Pending</option>
							<option value="Approved">Approved</option>
							<option value="Rejected">Rejected</option>
						</select>
						<SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
					</div>

					{/* Condition Filter */}
					<div className="relative">
						<select
							name="condition-type"
							id="car-condition"
							className="cursor-pointer appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 pr-10 text-gray-700 font-medium focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all hover:border-primary-300 shadow-sm"
							value={filter.conditionType}
							onChange={(e) =>
								setFilter({
									conditionType: e.currentTarget.value as CarConditionType,
								})
							}
						>
							<option value="All">All Conditions</option>
							<option value="New">New</option>
							<option value="Used">Used</option>
						</select>
						<Car className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
					</div>

					{/* Fuel Type Filter */}
					<div className="relative">
						<select
							name="fuel-type"
							id="car-fuel"
							className="cursor-pointer appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 pr-10 text-gray-700 font-medium focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all hover:border-primary-300 shadow-sm"
							value={filter.fuelType}
							onChange={(e) =>
								setFilter({ fuelType: e.currentTarget.value as FuelTypeFilter })
							}
						>
							<option value="All">All Fuel Types</option>
							<option value="Petrol">Petrol</option>
							<option value="Diesel">Diesel</option>
							<option value="Electric">Electric</option>
							<option value="Hybrid">Hybrid</option>
						</select>
						<Fuel className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
					</div>
				</div>

				{/* Clear Filters Button */}
				<button
					onClick={clearFilters}
					className="px-6 py-3 bg-primary-50 text-primary-700 rounded-xl font-medium hover:bg-primary-100 transition-colors flex items-center gap-2 border border-primary-200 shadow-sm"
				>
					<FilterIcon className="h-5 w-5" />
					Clear
				</button>
			</div>
		</div>
	);
};

const StatusCountComponent = ({
	status,
	cars,
}: {
	status: string;
	cars: Omit<CursorBaseDTO, "items"> & { items: CarItems[] };
}) => {
	const colorConfig = {
		Approved: {
			iconBg: "bg-primary-100 text-primary-700",
			icon: <CircleCheck className="h-6 w-6" />,
		},
		All: {
			iconBg: "bg-blue-100 text-blue-700",
			icon: <LayoutGrid className="h-6 w-6" />,
		},
		Pending: {
			iconBg: "bg-orange-100 text-orange-700",
			icon: <Clock className="h-6 w-6" />,
		},
		Rejected: {
			iconBg: "bg-red-100 text-red-700",
			icon: <CircleX className="h-6 w-6" />,
		},
	};

	const config = colorConfig[status as keyof typeof colorConfig];

	return (
		<div className="group rounded-2xl bg-white p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
			<div className="flex items-center justify-between">
				<div
					className={`rounded-xl p-3 ${config.iconBg} transition-transform duration-300 group-hover:scale-110`}
				>
					{config.icon}
				</div>
			</div>
			<div className="mt-4">
				<p className="text-sm font-medium text-gray-600">{status} Listings</p>
				<p className="mt-1 text-3xl font-bold text-gray-900">
					{status === "All" ? cars.items.length : carFilter(cars, status)}
				</p>
			</div>
		</div>
	);
};

export default AdminCarVerification;
