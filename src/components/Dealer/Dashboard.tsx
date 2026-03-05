"use client"

import { dealerAppointments } from "@/utils/API/AppointmentAPI"
import { getMyCars } from "@/utils/API/CarAPI"
import { getUserReviews } from "@/utils/API/ReviewAPI"
import {
	Calendar,
	Car,
	CheckCircle,
	Clock,
	Eye,
	LayoutDashboard,
	MessageSquare,
	Plus,
	RefreshCw,
	Star,
	TrendingUp,
	XCircle,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface DashboardStats {
	totalCars: number
	activeCars: number
	pendingCars: number
	rejectedCars: number
	totalAppointments: number
	pendingAppointments: number
	completedAppointments: number
	cancelledAppointments: number
	averageRating: number
	totalReviews: number
}

const Dashboard = () => {
	const [stats, setStats] = useState<DashboardStats>({
		totalCars: 0,
		activeCars: 0,
		pendingCars: 0,
		rejectedCars: 0,
		totalAppointments: 0,
		pendingAppointments: 0,
		completedAppointments: 0,
		cancelledAppointments: 0,
		averageRating: 0,
		totalReviews: 0,
	})
	const [loading, setLoading] = useState(true)
	const [refreshing, setRefreshing] = useState(false)
	const [recentCars, setRecentCars] = useState<any[]>([])
	const [recentAppointments, setRecentAppointments] = useState<any[]>([])

	useEffect(() => {
		fetchDashboardData()
	}, [])

	const fetchDashboardData = async () => {
		try {
			if (!loading) setRefreshing(true)

			const [approvedRes, pendingRes, rejectedRes] = await Promise.all([
				getMyCars("approved", null),
				getMyCars("pending", null),
				getMyCars("rejected", null),
			])

			const approvedCars = approvedRes?.items || []
			const pendingCars = pendingRes?.items || []
			const rejectedCars = rejectedRes?.items || []

			const appointmentsRes = await dealerAppointments()
			const appointments = appointmentsRes?.items || []

			const reviewsRes = await getUserReviews()
			const reviews = reviewsRes || []

			const totalCars =
				approvedCars.length + pendingCars.length + rejectedCars.length

			const appointmentStats = appointments.reduce(
				(acc: any, apt: any) => {
					if (apt.status === "pending") acc.pending++
					if (apt.status === "completed") acc.completed++
					if (apt.status === "cancelled") acc.cancelled++
					return acc
				},
				{ pending: 0, completed: 0, cancelled: 0 },
			)

			const avgRating =
				reviews.length > 0
					? reviews.reduce(
						(sum: number, review: any) =>
							sum + (review.rating || 0),
						0,
					) / reviews.length
					: 0

			setStats({
				totalCars,
				activeCars: approvedCars.length,
				pendingCars: pendingCars.length,
				rejectedCars: rejectedCars.length,
				totalAppointments: appointments.length,
				pendingAppointments: appointmentStats.pending,
				completedAppointments: appointmentStats.completed,
				cancelledAppointments: appointmentStats.cancelled,
				averageRating: avgRating,
				totalReviews: reviews.length,
			})

			setRecentCars(approvedCars.slice(0, 5))
			setRecentAppointments(appointments.slice(0, 5))
		} catch (error) {
			console.error("Error fetching dashboard data:", error)
		} finally {
			setLoading(false)
			setRefreshing(false)
		}
	}

	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="relative">
					<div className="absolute inset-0 rounded-full bg-primary-400 blur-xl opacity-30 animate-pulse" />
					<div className="relative h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				{/* Header */}
				<div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div className="space-y-3">
						<div className="flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-300">
								<LayoutDashboard className="h-6 w-6 text-black" />
							</div>
							<div>
								<h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
									Dealer Dashboard
								</h1>
							</div>
						</div>
						<p className="ml-15 text-base text-gray-600">
							Welcome back! Here&apos;s your business overview at a
							glance.
						</p>
					</div>
					<button
						onClick={fetchDashboardData}
						disabled={refreshing}
						className="group flex shrink-0 items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 font-semibold text-gray-700 transition-all hover:border-blue-400 hover:bg-gray-50 hover:text-blue-600 active:scale-95 disabled:opacity-50"
					>
						<RefreshCw
							className={`h-5 w-5 transition-transform duration-150 ${refreshing ? "animate-spin" : "group-hover:rotate-45"}`}
						/>
						{refreshing ? "Refreshing..." : "Refresh"}
					</button>
				</div>

				{/* Stats Cards */}
				<div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<StatsCard
						label="Total Cars"
						value={stats.totalCars}
						icon={<Car className="h-5 w-5" />}
					/>
					<StatsCard
						label="Pending Review"
						value={stats.pendingCars}
						variant="yellow"
						icon={<Clock className="h-5 w-5" />}
					/>
					<StatsCard
						label="Approved"
						value={stats.activeCars}
						variant="green"
						icon={<CheckCircle className="h-5 w-5" />}
					/>
					<StatsCard
						label="Rejected"
						value={stats.rejectedCars}
						variant="red"
						icon={<XCircle className="h-5 w-5" />}
					/>
				</div>

				{/* Appointments & Reviews Stats */}
				<div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<StatsCard
						label="Total Appointments"
						value={stats.totalAppointments}
						icon={<Calendar className="h-5 w-5" />}
					/>
					<StatsCard
						label="Average Rating"
						value={Number(stats.averageRating.toFixed(1))}
						variant="yellow"
						icon={<Star className="h-5 w-5" />}
					/>
					<StatsCard
						label="Total Reviews"
						value={stats.totalReviews}
						variant="green"
						icon={<MessageSquare className="h-5 w-5" />}
					/>
				</div>

				{/* Two Column Layout — Recent Cars & Appointments */}
				<div className="grid gap-6 lg:grid-cols-2">
					{/* Recent Cars */}
					<div className="rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm">
						<div className="flex items-center justify-between border-b border-gray-200/70 bg-gray-50 p-6">
							<div>
								<h2 className="text-2xl font-bold text-gray-900">
									Recent Cars
								</h2>
								<p className="mt-1 text-sm text-gray-600">
									Your latest vehicle listings
								</p>
							</div>
							<Link
								href="?tab=car-management"
								className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-50"
							>
								View All
							</Link>
						</div>
						<div className="p-6">
							{recentCars.length > 0 ? (
								<div className="space-y-3">
									{recentCars.map((car, index) => (
										<div
											key={car.id || index}
											className="group flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-all hover:border-blue-300 hover:bg-blue-50/30"
											style={{
												animationDelay: `${index * 50}ms`,
											}}
										>
											<div className="flex-1">
												<p className="font-semibold text-gray-900">
													{car.make} {car.model}
												</p>
												<p className="text-sm text-gray-600">
													{car.year}
												</p>
											</div>
											<div className="text-right">
												<p className="font-bold text-primary-600">
													฿
													{car.price?.toLocaleString()}
												</p>
												<div className="flex items-center gap-1 text-xs text-gray-500">
													<Eye className="h-3 w-3" />
													{car.views || 0} views
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<EmptySection
									message="No cars listed yet"
									actionLabel="Add Vehicle"
									actionHref="/profile/dealer/cars/add?step=1"
								/>
							)}
						</div>
					</div>

					{/* Recent Appointments */}
					<div className="rounded-2xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm">
						<div className="flex items-center justify-between border-b border-gray-200/70 bg-gray-50 p-6">
							<div>
								<h2 className="text-2xl font-bold text-gray-900">
									Recent Appointments
								</h2>
								<p className="mt-1 text-sm text-gray-600">
									Latest test drive requests
								</p>
							</div>
							<Link
								href="?tab=test-drive-management"
								className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-50"
							>
								View All
							</Link>
						</div>
						<div className="p-6">
							{recentAppointments.length > 0 ? (
								<div className="space-y-3">
									{recentAppointments.map((apt, index) => (
										<div
											key={apt.id || index}
											className="group flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-all hover:border-blue-300 hover:bg-blue-50/30"
											style={{
												animationDelay: `${index * 50}ms`,
											}}
										>
											<div className="flex-1">
												<p className="font-semibold text-gray-900">
													{apt.userName || "User"}
												</p>
												<p className="text-sm text-gray-600">
													{new Date(
														apt.schedule,
													).toLocaleDateString()}
												</p>
											</div>
											<span
												className={`rounded-full border px-3 py-1.5 text-xs font-bold backdrop-blur-sm ${getAppointmentStatusColor(apt.status)}`}
											>
												{apt.status?.charAt(0).toUpperCase() +
													apt.status?.slice(1)}
											</span>
										</div>
									))}
								</div>
							) : (
								<EmptySection message="No appointments yet" />
							)}
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<QuickActionCard
						icon={
							<Plus className="h-6 w-6 text-blue-600 group-hover:rotate-90 transition-transform duration-150" />
						}
						label="Add New Car"
						description="List a new vehicle"
						href="/profile/dealer/cars/add?step=1"
						gradient="from-blue-50 to-white"
						borderColor="border-blue-100 hover:border-blue-300"
						iconBg="bg-blue-100 group-hover:bg-blue-200"
					/>
					<QuickActionCard
						icon={
							<Calendar className="h-6 w-6 text-purple-600" />
						}
						label="Appointments"
						description="Manage test drives"
						href="?tab=test-drive-management"
						gradient="from-purple-50 to-white"
						borderColor="border-purple-100 hover:border-purple-300"
						iconBg="bg-purple-100 group-hover:bg-purple-200"
					/>
					<QuickActionCard
						icon={
							<MessageSquare className="h-6 w-6 text-green-600" />
						}
						label="Manage Posts"
						description="Create & edit posts"
						href="?tab=post-management"
						gradient="from-green-50 to-white"
						borderColor="border-green-100 hover:border-green-300"
						iconBg="bg-green-100 group-hover:bg-green-200"
					/>
					<QuickActionCard
						icon={
							<TrendingUp className="h-6 w-6 text-amber-600" />
						}
						label="Revenue"
						description="View earnings & reports"
						href="?tab=revenue-management"
						gradient="from-amber-50 to-white"
						borderColor="border-amber-100 hover:border-amber-300"
						iconBg="bg-amber-100 group-hover:bg-amber-200"
					/>
				</div>
			</div>
		</div>
	)
}

// ─── Sub-components ──────────────────────────────────────────────────

interface StatsCardProps {
	label: string
	value: number
	variant?: "default" | "yellow" | "green" | "red"
	icon?: React.ReactNode
}

const StatsCard = ({
	label,
	value,
	variant = "default",
	icon,
}: StatsCardProps) => {
	const styles = {
		default: {
			border: "border-l-blue-500",
			iconColor: "text-blue-600",
		},
		yellow: {
			border: "border-l-yellow-500",
			iconColor: "text-yellow-600",
		},
		green: {
			border: "border-l-green-500",
			iconColor: "text-green-600",
		},
		red: {
			border: "border-l-red-500",
			iconColor: "text-red-600",
		},
	}

	const s = styles[variant]

	return (
		<div
			className={`rounded-xl border border-gray-200 border-l-4 ${s.border} bg-white p-5`}
		>
			<div className="flex items-start justify-between">
				<div>
					<p className="text-sm font-medium text-gray-500">{label}</p>
					<p className="mt-1.5 text-3xl font-bold text-gray-900">
						{value}
					</p>
				</div>
				{icon && (
					<div
						className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white ${s.iconColor}`}
					>
						{icon}
					</div>
				)}
			</div>
		</div>
	)
}

const getAppointmentStatusColor = (status: string) => {
	switch (status?.toLowerCase()) {
		case "pending":
			return "bg-yellow-100 text-yellow-800 border-yellow-300"
		case "completed":
			return "bg-green-100 text-green-800 border-green-300"
		case "cancelled":
			return "bg-red-100 text-red-800 border-red-300"
		case "accepted":
			return "bg-blue-100 text-blue-800 border-blue-300"
		default:
			return "bg-gray-100 text-gray-800 border-gray-300"
	}
}

const EmptySection = ({
	message,
	actionLabel,
	actionHref,
}: {
	message: string
	actionLabel?: string
	actionHref?: string
}) => (
	<div className="flex flex-col items-center justify-center py-10 text-center">
		<p className="text-gray-500">{message}</p>
		{actionLabel && actionHref && (
			<Link
				href={actionHref}
				className="mt-4 flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:scale-105 active:scale-95"
			>
				<Plus className="h-4 w-4" />
				{actionLabel}
			</Link>
		)}
	</div>
)

const QuickActionCard = ({
	icon,
	label,
	description,
	href,
	gradient,
	borderColor,
	iconBg,
}: {
	icon: React.ReactNode
	label: string
	description: string
	href: string
	gradient: string
	borderColor: string
	iconBg: string
}) => (
	<Link
		href={href}
		className={`group flex flex-col items-center rounded-xl border bg-linear-to-br ${gradient} ${borderColor} p-6 text-center transition-all hover:shadow-sm`}
	>
		<div
			className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} transition-colors duration-150`}
		>
			{icon}
		</div>
		<h4 className="font-bold text-gray-900">{label}</h4>
		<p className="mt-1 text-sm text-gray-600">{description}</p>
	</Link>
)

export default Dashboard
