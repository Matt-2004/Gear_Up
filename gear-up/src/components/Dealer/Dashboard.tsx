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
	Star,
	XCircle
} from "lucide-react"
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
	const [recentCars, setRecentCars] = useState<any[]>([])
	const [recentAppointments, setRecentAppointments] = useState<any[]>([])

	useEffect(() => {
		fetchDashboardData()
	}, [])

	const fetchDashboardData = async () => {
		try {
			setLoading(true)

			// Fetch all cars data
			const [approvedRes, pendingRes, rejectedRes] = await Promise.all([
				getMyCars("approved", null),
				getMyCars("pending", null),
				getMyCars("rejected", null),
			])

			const approvedCars = approvedRes?.items || []
			const pendingCars = pendingRes?.items || []
			const rejectedCars = rejectedRes?.items || []

			// Fetch appointments
			const appointmentsRes = await dealerAppointments()
			const appointments = appointmentsRes?.items || []

			// Fetch reviews
			const reviewsRes = await getUserReviews()
			const reviews = reviewsRes || []

			// Calculate stats
			const totalCars = approvedCars.length + pendingCars.length + rejectedCars.length

			const appointmentStats = appointments.reduce(
				(acc: any, apt: any) => {
					if (apt.status === "pending") acc.pending++
					if (apt.status === "completed") acc.completed++
					if (apt.status === "cancelled") acc.cancelled++
					return acc
				},
				{ pending: 0, completed: 0, cancelled: 0 }
			)

			const avgRating = reviews.length > 0
				? reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / reviews.length
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

			// Set recent items
			setRecentCars(approvedCars.slice(0, 5))
			setRecentAppointments(appointments.slice(0, 5))

		} catch (error) {
			console.error("Error fetching dashboard data:", error)
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
			</div>
		)
	}

	return (
		<div className="min-h-screen p-8">
			<div className="mx-auto max-w-7xl space-y-8">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Dealer Dashboard</h1>
						<p className="mt-1 text-gray-600">Welcome back! Here's your business overview</p>
					</div>
					<button
						onClick={fetchDashboardData}
						className="rounded-xl bg-primary-600 px-6 py-3 text-white font-medium hover:bg-primary-700 transition-colors shadow-md"
					>
						Refresh Data
					</button>
				</div>

				{/* Stats Grid */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{/* Total Cars */}
					<StatCard
						icon={<Car className="h-6 w-6" />}
						title="Total Cars"
						value={stats.totalCars}
						subtitle={`${stats.activeCars} active`}
						color="bg-blue-500"
						bgColor="bg-blue-50"
					/>

					{/* Appointments */}
					<StatCard
						icon={<Calendar className="h-6 w-6" />}
						title="Appointments"
						value={stats.totalAppointments}
						subtitle={`${stats.pendingAppointments} pending`}
						color="bg-primary-600"
						bgColor="bg-primary-50"
					/>

					{/* Reviews */}
					<StatCard
						icon={<Star className="h-6 w-6 text-amber-500" />}
						title="Rating"
						value={stats.averageRating.toFixed(1)}
						subtitle={`${stats.totalReviews} reviews`}
						color="bg-amber-500"
						bgColor="bg-amber-50"
					/>

					{/* Pending Cars */}
					<StatCard
						icon={<Clock className="h-6 w-6" />}
						title="Pending Review"
						value={stats.pendingCars}
						subtitle="Cars awaiting approval"
						color="bg-orange-500"
						bgColor="bg-orange-50"
					/>
				</div>

				{/* Car Status Overview */}
				<div className="rounded-2xl bg-white p-6 hover:shadow-sm transition-all">
					<h2 className="mb-4 text-xl font-bold text-gray-900">Car Status Overview</h2>
					<div className="grid gap-4 md:grid-cols-3">
						<StatusItem
							icon={<CheckCircle className="h-5 w-5 text-green-600" />}
							label="Approved Cars"
							value={stats.activeCars}
							bgColor="bg-green-50"
						/>
						<StatusItem
							icon={<Clock className="h-5 w-5 text-orange-600" />}
							label="Pending Review"
							value={stats.pendingCars}
							bgColor="bg-orange-50"
						/>
						<StatusItem
							icon={<XCircle className="h-5 w-5 text-red-600" />}
							label="Rejected"
							value={stats.rejectedCars}
							bgColor="bg-red-50"
						/>
					</div>
				</div>

				{/* Two Column Layout */}
				<div className="grid gap-6 lg:grid-cols-2">
					{/* Recent Cars */}
					<div className="rounded-2xl bg-white p-6 hover:shadow-sm transition-all">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-xl font-bold text-gray-900">Recent Cars</h2>
							<Car className="h-5 w-5 text-primary-600" />
						</div>
						{recentCars.length > 0 ? (
							<div className="space-y-3">
								{recentCars.map((car, index) => (
									<div
										key={index}
										className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 hover:bg-primary-50 transition-colors"
									>
										<div className="flex-1">
											<p className="font-semibold text-gray-900">
												{car.make} {car.model}
											</p>
											<p className="text-sm text-gray-600">{car.year}</p>
										</div>
										<div className="text-right">
											<p className="font-bold text-primary-600">${car.price?.toLocaleString()}</p>
											<div className="flex items-center gap-1 text-xs text-gray-500">
												<Eye className="h-3 w-3" />
												{car.views || 0} views
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-center text-gray-500 py-8">No cars listed yet</p>
						)}
					</div>

					{/* Recent Appointments */}
					<div className="rounded-2xl bg-white p-6 hover:shadow-sm transition-all">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
							<Calendar className="h-5 w-5 text-primary-600" />
						</div>
						{recentAppointments.length > 0 ? (
							<div className="space-y-3">
								{recentAppointments.map((apt, index) => (
									<div
										key={index}
										className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 hover:bg-primary-50 transition-colors"
									>
										<div className="flex-1">
											<p className="font-semibold text-gray-900">
												{apt.userName || "User"}
											</p>
											<p className="text-sm text-gray-600">
												{new Date(apt.schedule).toLocaleDateString()}
											</p>
										</div>
										<span
											className={`rounded-full px-3 py-1 text-xs font-medium ${apt.status === "pending"
												? "bg-orange-100 text-orange-700"
												: apt.status === "completed"
													? "bg-green-100 text-green-700"
													: "bg-red-100 text-red-700"
												}`}
										>
											{apt.status}
										</span>
									</div>
								))}
							</div>
						) : (
							<p className="text-center text-gray-500 py-8">No appointments yet</p>
						)}
					</div>
				</div>

				{/* Quick Actions */}
				<div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white hover:shadow-sm transition-all">
					<h2 className="mb-4 text-xl font-bold">Quick Actions</h2>
					<div className="grid gap-4 md:grid-cols-4">
						<QuickActionButton label="Add New Car" href="?tab=car-management" />
						<QuickActionButton label="View Appointments" href="?tab=test-drive-management" />
						<QuickActionButton label="Manage Posts" href="?tab=post-management" />
						<QuickActionButton label="View Revenue" href="?tab=revenue-management" />
					</div>
				</div>
			</div>
		</div>
	)
}

// Stat Card Component
const StatCard = ({ icon, title, value, subtitle, color, bgColor }: any) => (
	<div className="rounded-2xl bg-white p-6 hover:shadow-sm transition-all">
		<div className="flex items-center justify-between">
			<div className={`rounded-full ${bgColor} p-3 ${color.replace("bg-", "text-")}`}>
				{icon}
			</div>
		</div>
		<div className="mt-4">
			<p className="text-sm font-medium text-gray-600">{title}</p>
			<p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
			<p className="mt-1 text-sm text-gray-500">{subtitle}</p>
		</div>
	</div>
)

// Status Item Component
const StatusItem = ({ icon, label, value, bgColor }: any) => (
	<div className={`rounded-xl ${bgColor} p-4 border border-transparent hover:border-gray-200 transition-all`}>
		<div className="flex items-center gap-3">
			{icon}
			<div>
				<p className="text-sm font-medium text-gray-600">{label}</p>
				<p className="text-2xl font-bold text-gray-900">{value}</p>
			</div>
		</div>
	</div>
)

// Quick Action Button Component
const QuickActionButton = ({ label, href }: { label: string; href: string }) => (
	<a
		href={href}
		className="rounded-xl bg-white/20 p-4 text-center font-medium hover:bg-white/30 transition-all backdrop-blur-sm border border-white/30"
	>
		{label}
	</a>
)

export default Dashboard
