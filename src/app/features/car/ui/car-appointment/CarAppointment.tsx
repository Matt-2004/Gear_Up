"use client";

import { useToast } from "@/app/features/toast/hooks/useToast";
import { CarItems } from "@/app/features/car/types/car.types";
import AppointmentCarSummary from "@/app/features/appointments/ui/appointment-card/AppointmentCarSummary";
import AppointmentForm from "@/app/features/appointments/ui/appointment-form/AppointmentForm";
import { createAppointment } from "@/app/shared/utils/API/AppointmentAPI";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CarAppointment({ car }: { car: CarItems }) {
  const router = useRouter();
  const { addToastMessage } = useToast({
    toastType: null,
    message: null,
  });
  const [formData, setFormData] = useState({
    schedule: "",
    time: "",
    location: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Combine date and time and convert to ISO string for backend compatibility
      const scheduleDateTime = new Date(
        `${formData.schedule}T${formData.time}`,
      ).toISOString();

      // Call API to create appointment
      const res = await createAppointment(
        car.dealerId, // Using car.id as agentId (you might need to adjust this)
        car.id,
        scheduleDateTime as any, // Cast as any in case the function strictly expects a Date object type
        formData.location,
        formData.notes || "",
      );

      // Instead of relying on empty body error throwing
      addToastMessage(
        "success",
        "Appointment scheduled successfully! Redirecting...",
      );

      setFormData({
        schedule: "",
        time: "",
        location: "",
        notes: "",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/car/${car.id}`);
      }, 2500);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create appointment. Please try again.";
      setError(errorMessage);
      addToastMessage("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!car) {
    return (
      <div className="to-primary-50 flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600">Car not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="cursor-pointer hover:text-primary-700 mb-6 flex items-center gap-2 font-medium transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to Car Details
        </button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Car Summary */}
          <div className="lg:col-span-1">
            <AppointmentCarSummary car={car} />
          </div>

          {/* Right Column - Appointment Form */}
          <div className="lg:col-span-2">
            <AppointmentForm
              formData={formData}
              isSubmitting={isSubmitting}
              error={error}
              onSubmit={handleSubmit}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
