"use client"

import { AppointmentStatus, IAppointment } from "@/app/types/appointment.types"
import { CursorBaseDTO } from "@/app/types/post.types"
import SharedAppointmentCard from "@/components/Appointment/AppointmentCard"
import {
	acceptAppointmentById,
	cancelAppointmentById,
	dealerAppointments,
	rejectAppointmentById,
} from "@/utils/API/AppointmentAPI"
import { Calendar, ChevronDown, Filter, RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"

// ─── utils ───────────────────────────────────────────────────────────────────

const getStatusColor = (status: AppointmentStatus) => {
	switch (status) {
		case "Pending":
			return "bg-yellow-100 text-yellow-800 border-yellow-300"
		case "Confirmed":
			return "bg-blue-100 text-blue-800 border-blue-300"
		case "Completed":
			return "bg-green-100 text-green-800 border-green-300"
		case "Cancelled":
			return "bg-gray-100 text-gray-800 border-gray-300"
		case "Rejected":
			return "bg-red-100 text-red-800 border-red-300"
		default:
			return "bg-gray-100 text-gray-800 border-gray-300"
	}
}

const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date)
}

// ─── sub-components ───────────────────────────────────────────────────────────

type AppointmentCounts = {
	total: number
	pending: number
	confirmed: number
	completed: number
	cancelled: number
	rejected: number
}

const StatsRow = ({ counts }: { counts: AppointmentCounts }) => {
	const stats: {
		label: string
		value: number
		cls: string
		valueCls: string
	}[] = [
		{
			label: "Total",
			value: counts.total,
			cls: "bg-white border-gray-200",
			valueCls: "text-gray-900",
		},
		{
			label: "Pending",
			value: counts.pending,
			cls: "bg-yellow-50 border-yellow-200",
			valueCls: "text-yellow-900",
		},
		{
			label: "Confirmed",
			value: counts.confirmed,
			cls: "bg-blue-50 border-blue-200",
			valueCls: "text-blue-900",
		},
		{
			label: "Completed",
			value: counts.completed,
			cls: "bg-green-50 border-green-200",
			valueCls: "text-green-900",
		},
		{
			label: "Cancelled",
			value: counts.cancelled,
			cls: "bg-gray-50 border-gray-200",
			valueCls: "text-gray-900",
		},
		{
			label: "Rejected",
			value: counts.rejected,
			cls: "bg-red-50 border-red-200",
			valueCls: "text-red-900",
		},
	]
	return (
		<div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
			{stats.map((s) => (
				<div
					key={s.label}
					className={`rounded-xl border p-4 shadow-sm ${s.cls}`}
				>
					<p className="text-xs text-gray-500">{s.label}</p>
					<p className={`text-2xl font-bold ${s.valueCls}`}>{s.value}</p>
				</div>
			))}
		</div>
	)
}

const FilterDropdown = ({
	filter,
	dropdownOpen,
	appointmentCounts,
	onToggleDropdown,
	onFilterChange,
}: {
	filter: AppointmentStatus | "All"
	dropdownOpen: boolean
	appointmentCounts: AppointmentCounts
	onToggleDropdown: () => void
	onFilterChange: (f: AppointmentStatus | "All") => void
}) => {
	const statusOptions: {
		label: string
		status: AppointmentStatus | "All"
		count: number
	}[] = [
		{ label: "All", status: "All", count: appointmentCounts.total },
		{ label: "Pending", status: "Pending", count: appointmentCounts.pending },
		{
			label: "Confirmed",
			status: "Confirmed",
			count: appointmentCounts.confirmed,
		},
		{
			label: "Completed",
			status: "Completed",
			count: appointmentCounts.completed,
		},
		{
			label: "Cancelled",
			status: "Cancelled",
			count: appointmentCounts.cancelled,
		},
		{
			label: "Rejected",
			status: "Rejected",
			count: appointmentCounts.rejected,
		},
	]

	return (
		<div className="relative">
			<button
				type="button"
				onClick={onToggleDropdown}
				className="focus:ring-primary-500 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:outline-none"
			>
				<Filter className="h-4 w-4" />
				{filter === "All" ? "All Status" : filter}
				<ChevronDown
					className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{dropdownOpen && (
				<>
					<div className="fixed inset-0 z-20" onClick={onToggleDropdown} />
					<div className="absolute right-0 z-30 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
						<ul className="p-1">
							{statusOptions.map(({ label, status, count }) => (
								<li key={status}>
									<button
										type="button"
										onClick={() => onFilterChange(status)}
										className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-blue-50 ${
											filter === status
												? "bg-blue-50 text-blue-700"
												: "text-gray-700"
										}`}
									>
										<span>{label}</span>
										<span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
											{count}
										</span>
									</button>
								</li>
							))}
						</ul>
					</div>
				</>
			)}
		</div>
	)
}

const EmptyState = ({ filter }: { filter: AppointmentStatus | "All" }) => (
	<div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
		<Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
		<h3 className="mb-2 text-lg font-medium text-gray-900">
			No appointments found
		</h3>
		<p className="text-gray-500">
			{filter === "All"
				? "You don't have any appointments yet."
				: `No ${filter.toLowerCase()} appointments at the moment.`}
		</p>
	</div>
)

// ─── main component ───────────────────────────────────────────────────────────

type AppointmentData = Omit<CursorBaseDTO, "items"> & { items: IAppointment[] }

const TestDriveManagement = () => {
	const [data, setData] = useState<AppointmentData>({ items: [] } as any)
	const [loading, setLoading] = useState(true)
	const [fetchError, setFetchError] = useState<string | null>(null)
	const [actionLoading, setActionLoading] = useState<string | null>(null)
	const [filter, setFilter] = useState<AppointmentStatus | "All">("All")
	const [dropdownOpen, setDropdownOpen] = useState(false)

	const fetchData = async () => {
		setLoading(true)
		setFetchError(null)
		try {
			const res = await dealerAppointments()
			setData(res?.data ?? { items: [] })
		} catch (err: any) {
			setFetchError(
				err?.response?.data?.errorMessage ??
					err?.message ??
					"Failed to load appointments.",
			)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	// ── action handlers ──────────────────────────────────────────────────────

	const handleAccept = async (id: string) => {
		setActionLoading(id)
		try {
			await acceptAppointmentById(id)
			setData((prev) => ({
				...prev,
				items: prev.items.map((a) =>
					a.id === id ? { ...a, status: "Confirmed" } : a,
				),
			}))
		} catch (err) {
			console.error("Failed to accept appointment:", err)
		} finally {
			setActionLoading(null)
		}
	}

	const handleReject = async (id: string, rejectionReason: string) => {
		setActionLoading(id)
		try {
			await rejectAppointmentById(id, { rejectionReason })
			setData((prev) => ({
				...prev,
				items: prev.items.map((a) =>
					a.id === id ? { ...a, status: "Rejected" } : a,
				),
			}))
		} catch (err) {
			console.error("Failed to reject appointment:", err)
		} finally {
			setActionLoading(null)
		}
	}

	const handleCancel = async (id: string) => {
		setActionLoading(id)
		try {
			await cancelAppointmentById(id)
			setData((prev) => ({
				...prev,
				items: prev.items.map((a) =>
					a.id === id ? { ...a, status: "Cancelled" } : a,
				),
			}))
		} catch (err) {
			console.error("Failed to cancel appointment:", err)
		} finally {
			setActionLoading(null)
		}
	}

	// ── derived ──────────────────────────────────────────────────────────────

	const counts: AppointmentCounts = {
		total: data.items.length,
		pending: data.items.filter((a) => a.status === "Pending").length,
		confirmed: data.items.filter((a) => a.status === "Confirmed").length,
		completed: data.items.filter((a) => a.status === "Completed").length,
		cancelled: data.items.filter((a) => a.status === "Cancelled").length,
		rejected: data.items.filter((a) => a.status === "Rejected").length,
	}

	const filtered =
		filter === "All"
			? data.items
			: data.items.filter((a) => a.status === filter)

	// ── render ───────────────────────────────────────────────────────────────

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				{/* header */}
				<div className="mb-6 flex flex-wrap items-start justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							Test Drive Management
						</h1>
						<p className="mt-1 text-sm text-gray-500">
							Manage customer test-drive appointments and schedules
						</p>
					</div>

					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={fetchData}
							disabled={loading}
							className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50"
						>
							<RotateCcw
								className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
							/>
							Refresh
						</button>

						<FilterDropdown
							filter={filter}
							dropdownOpen={dropdownOpen}
							appointmentCounts={counts}
							onToggleDropdown={() => setDropdownOpen((o) => !o)}
							onFilterChange={(f) => {
								setFilter(f)
								setDropdownOpen(false)
							}}
						/>
					</div>
				</div>

				{/* stats */}
				{!loading && !fetchError && <StatsRow counts={counts} />}

				{/* loading */}
				{loading && (
					<div className="flex flex-col items-center justify-center py-24 text-gray-400">
						<RotateCcw className="mb-3 h-8 w-8 animate-spin" />
						<p className="text-sm">Loading appointments…</p>
					</div>
				)}

				{/* error */}
				{!loading && fetchError && (
					<div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-16 text-center">
						<p className="mb-4 text-sm font-medium text-red-600">
							{fetchError}
						</p>
						<button
							type="button"
							onClick={fetchData}
							className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
						>
							<RotateCcw className="h-4 w-4" />
							Retry
						</button>
					</div>
				)}

				{/* list */}
				{!loading && !fetchError && (
					<div className="space-y-4">
						{filtered.length === 0 ? (
							<EmptyState filter={filter} />
						) : (
							filtered.map((appointment) => (
								<SharedAppointmentCard
									key={appointment.id}
									appointment={appointment}
									loading={actionLoading === appointment.id}
									mode="dealer"
									formatDate={formatDate}
									getStatusColor={getStatusColor}
									onAccept={handleAccept}
									onReject={handleReject}
									onCancel={handleCancel}
								/>
							))
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default TestDriveManagement
