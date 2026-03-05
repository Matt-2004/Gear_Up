"use client"

import { IKycSubmissions } from "@/types/kyc.types"
import { CursorBaseDTO } from "@/types/post.types"
import DataTable from "@/components/Admin/DataTable"
import FilterProvider, {
	KycDocumentType,
	StatusType,
	useKycFilterContext,
} from "@/Context/AdminKycFilterContext"
import { kycFilter } from "@/utils/Filter"
import {
	CircleCheck,
	CircleX,
	Clock,
	LayoutGrid,
	Search,
	SlidersHorizontal,
} from "lucide-react"

const AdminKycVerification = ({
	kyc,
}: {
	kyc: Omit<CursorBaseDTO, "items"> & { items: IKycSubmissions[] }
}) => {
	if (!kyc) {
		return <h3>Kyc data missing</h3>
	}
	return (
		<FilterProvider>
			<div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
				<div className="mx-auto max-w-7xl space-y-8">
					{/* Header */}
					<div className="space-y-2">
						<h1 className="text-4xl font-bold text-gray-900">
							Document Verification
						</h1>
						<p className="text-lg text-gray-600">
							Review and verify user-submitted documents
						</p>
					</div>

					{/* Stats Cards */}
					<div className="grid gap-6 md:grid-cols-4">
						<StatusCountComponent status="All" kyc={kyc} />
						<StatusCountComponent status="Pending" kyc={kyc} />
						<StatusCountComponent status="Approved" kyc={kyc} />
						<StatusCountComponent status="Rejected" kyc={kyc} />
					</div>

					{/* Filter Section */}
					<div className="rounded-2xl bg-white p-6 shadow-sm shadow-gray-100">
						<FilterUI />
					</div>

					{/* Data Table */}
					<div className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-gray-100">
						<DataTable kyc={kyc.items} />
					</div>
				</div>
			</div>
		</FilterProvider>
	)
}

const FilterUI = () => {
	const { setFilter } = useKycFilterContext()

	return (
		<div className="flex items-center justify-between gap-4">
			<div className="flex flex-1 items-center gap-4">
				{/* Search Input */}
				<div className="relative max-w-md flex-1">
					<Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
					<input
						className="focus:border-primary-500 focus:ring-primary-200 w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-12 text-gray-900 transition-all placeholder:text-gray-400 focus:ring-2 focus:outline-none"
						type="text"
						placeholder="Search by name, ID, or document type..."
						onChange={(e) => setFilter({ searchData: e.currentTarget.value })}
					/>
				</div>

				{/* Document Type Filter */}
				<div className="relative">
					<select
						name="doc-type"
						id="all-doc-type"
						className="focus:border-primary-500 focus:ring-primary-200 cursor-pointer appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 pr-10 font-medium text-gray-700 transition-all hover:border-gray-300 focus:ring-2 focus:outline-none"
						defaultValue=""
						onChange={(e) =>
							setFilter({
								documentType: e.currentTarget.value as KycDocumentType,
							})
						}
					>
						<option value="" disabled hidden>
							Document Type
						</option>
						<option value="Passport">Passport</option>
						<option value="NationalID">National ID</option>
						<option value="DriverLicense">Driver License</option>
						<option value="UtilityBill">Utility Bill</option>
						<option value="Other">Other</option>
					</select>
					<SlidersHorizontal className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
				</div>

				{/* Status Filter */}
				<div className="relative">
					<select
						name="status-type"
						id="all-status"
						className="focus:border-primary-500 focus:ring-primary-200 cursor-pointer appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 pr-10 font-medium text-gray-700 transition-all hover:border-gray-300 focus:ring-2 focus:outline-none"
						defaultValue=""
						onChange={(e) =>
							setFilter({ statusType: e.currentTarget.value as StatusType })
						}
					>
						<option value="" disabled hidden>
							Filter Status
						</option>
						<option value="All">All Status</option>
						<option value="Pending">Pending</option>
						<option value="Approved">Approved</option>
						<option value="Rejected">Rejected</option>
					</select>
					<SlidersHorizontal className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
				</div>
			</div>
		</div>
	)
}

const StatusCountComponent = ({
	status,
	kyc,
}: {
	status: string
	kyc: Omit<CursorBaseDTO, "items"> & { items: IKycSubmissions[] }
}) => {
	const colorConfig = {
		Approved: {
			iconBg: "bg-green-50 text-green-600",
			icon: <CircleCheck className="h-6 w-6" />,
		},
		All: {
			iconBg: "bg-blue-50 text-blue-600",
			icon: <LayoutGrid className="h-6 w-6" />,
		},
		Pending: {
			iconBg: "bg-orange-50 text-orange-600",
			icon: <Clock className="h-6 w-6" />,
		},
		Rejected: {
			iconBg: "bg-red-50 text-red-600",
			icon: <CircleX className="h-6 w-6" />,
		},
	}

	const config = colorConfig[status as keyof typeof colorConfig]

	return (
		<div className="group rounded-2xl bg-white p-6 shadow-sm shadow-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-gray-200">
			<div className="flex items-center justify-between">
				<div
					className={`rounded-xl p-3 ${config.iconBg} transition-transform duration-300 group-hover:scale-110`}
				>
					{config.icon}
				</div>
			</div>
			<div className="mt-4">
				<p className="text-sm font-medium text-gray-600">{status} Reviews</p>
				<p className="mt-1 text-3xl font-bold text-gray-900">
					{status === "All" ? kyc.items.length : kycFilter(kyc, status)}
				</p>
			</div>
		</div>
	)
}

export default AdminKycVerification
