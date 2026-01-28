"use client"

import { CarItems } from "@/app/types/car.types"
import { formatNumber } from "@/lib/numberFormatter"
import { createAppointment } from "@/utils/FetchAPI"
import {
    Calendar,
    Car,
    CheckCircle,
    ChevronLeft,
    Clock,
    FileText,
    MapPin
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AppointmentPage({ car }: { car: CarItems }) {
    const router = useRouter()
    const [formData, setFormData] = useState({
        schedule: "",
        time: "",
        location: "",
        notes: ""
    })

    console.log("Car data:: ", formData)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsSubmitting(true)

        try {
            // Combine date and time
            const scheduleDateTime = new Date(`${formData.schedule}T${formData.time}`)

            // Call API to create appointment
            await createAppointment(
                car.id, // Using car.id as agentId (you might need to adjust this)
                car.id,
                scheduleDateTime,
                formData.location,
                formData.notes || undefined
            )

            setShowSuccess(true)

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push(`/car/${car.id}`)
            }, 2000)
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to create appointment. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-green-100 p-4">
                            <CheckCircle className="h-16 w-16 text-green-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Appointment Confirmed!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Your appointment has been successfully scheduled. The dealer will contact you shortly to confirm the details.
                    </p>
                    <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                        <p className="text-sm text-primary-900 font-medium">
                            Redirecting you back to the car details...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (!car) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600">Car not found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
            <div className="mx-auto max-w-5xl px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors font-medium"
                >
                    <ChevronLeft className="h-5 w-5" />
                    Back to Car Details
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Car Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 bg-white rounded-xl shadow-lg border border-primary-100 overflow-hidden">
                            <div className="aspect-video bg-gray-900">
                                <img
                                    src={car.carImages[0]?.url}
                                    alt={`${car.make} ${car.model}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${car.carStatus === "Available"
                                        ? "bg-primary-200 text-primary-800"
                                        : "bg-red-100 text-red-800"
                                        }`}>
                                        {car.carStatus}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {car.year} {car.make} {car.model}
                                </h2>
                                <p className="text-gray-600 mb-4">{car.title}</p>
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-primary-600">
                                            ${formatNumber(car.price)}
                                        </span>
                                        <span className="text-gray-500">Baht</span>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Car className="h-4 w-4" />
                                        <span>{car.mileage.toLocaleString()} KM • {car.fuelType}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Appointment Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg border border-primary-100 p-8">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Schedule an Appointment
                                </h1>
                                <p className="text-gray-600">
                                    Fill out the form below to schedule a visit to see this car. The dealer will confirm your appointment shortly.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-800 text-sm">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Date Selection */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Calendar className="h-4 w-4 text-primary-600" />
                                        Preferred Date
                                    </label>
                                    <input
                                        type="date"
                                        name="schedule"
                                        value={formData.schedule}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-gray-900"
                                    />
                                </div>

                                {/* Time Selection */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Clock className="h-4 w-4 text-primary-600" />
                                        Preferred Time
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-gray-900"
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <MapPin className="h-4 w-4 text-primary-600" />
                                        Preferred Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Enter your preferred meeting location"
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
                                    />
                                    <p className="mt-2 text-xs text-gray-500">
                                        You can specify the dealership location or request a different meeting point
                                    </p>
                                </div>

                                {/* Additional Notes */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <FileText className="h-4 w-4 text-primary-600" />
                                        Additional Notes (Optional)
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        placeholder="Any special requests or questions about the car?"
                                        rows={4}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400 resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Scheduling...
                                            </>
                                        ) : (
                                            <>
                                                <Calendar className="h-5 w-5" />
                                                Schedule Appointment
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Info Box */}
                                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-900">
                                        <span className="font-semibold">Note:</span> By scheduling an appointment, you agree to be contacted by the dealer. Your appointment is not confirmed until the dealer accepts it.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
