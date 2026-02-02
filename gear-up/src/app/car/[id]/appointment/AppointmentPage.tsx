"use client";

import { useToast } from "@/app/hooks/useToast";
import { CarItems } from "@/app/types/car.types";
import AppointmentCarSummary from "@/components/Appointment/AppointmentCarSummary";
import AppointmentForm from "@/components/Appointment/AppointmentForm";
import { createAppointment } from "@/utils/API/AppointmentAPI";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AppointmentPage({ car }: { car: CarItems }) {
  const router = useRouter();
  const { ToastComponent, addToastMessage } = useToast({
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
      // Combine date and time
      const scheduleDateTime = new Date(
        `${formData.schedule}T${formData.time}`,
      );

      // Call API to create appointment
      const res = await createAppointment(
        car.dealerId, // Using car.id as agentId (you might need to adjust this)
        car.id,
        scheduleDateTime,
        formData.location,
        formData.notes || undefined,
      );

      if (res?.isSuccess) {
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
        }, 4000);
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data ||
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Car not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      <AnimatePresence>
        <ToastComponent />
      </AnimatePresence>
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
