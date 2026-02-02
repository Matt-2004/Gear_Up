"use client";

import { AppointmentStatus, IAppointment } from "@/app/types/appointment.types";
import { cancelAppointmentById } from "@/utils/API/AppointmentAPI";
import { useState } from "react";
import AppointmentCard from "./components/AppointmentCard";
import EmptyState from "./components/EmptyState";
import FilterDropdown from "./components/FilterDropdown";
import StatsCard from "./components/StatsCard";

interface AppointmentsProps {
    appointments: IAppointment[];
}

const Appointments = ({
    appointments: initialAppointments,
}: AppointmentsProps) => {
    const [appointments, setAppointments] =
        useState<IAppointment[]>(initialAppointments || []);
    const [filter, setFilter] = useState<AppointmentStatus | "All">("All");
    const [loading, setLoading] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const filteredAppointments =
        filter === "All"
            ? appointments
            : (appointments || []).filter((apt) => apt.status === filter);

    const handleCancel = async (appointmentId: string) => {
        if (!confirm("Are you sure you want to cancel this appointment?")) return;

        setLoading(appointmentId);
        try {
            await cancelAppointmentById(appointmentId);
            setAppointments((prev) =>
                prev.map((apt) =>
                    apt.id === appointmentId ? { ...apt, status: "Cancelled" } : apt,
                ),
            );
        } catch (error) {
            console.error("Failed to cancel appointment:", error);
            alert("Failed to cancel appointment. Please try again.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            My Appointments
                        </h1>
                        <p className="text-gray-600">
                            View and manage your test drive appointments
                        </p>
                    </div>

                    {/* Filter Dropdown */}
                    <FilterDropdown
                        filter={filter}
                        dropdownOpen={dropdownOpen}
                        onToggleDropdown={() => setDropdownOpen(!dropdownOpen)}
                        onFilterChange={(newFilter) => {
                            setFilter(newFilter);
                            setDropdownOpen(false);
                        }}
                    />
                </div>

                {/* Stats Cards */}
                <div className="mb-8 grid gap-4 md:grid-cols-4">
                    <StatsCard label="Total" value={(appointments || []).length} />
                    <StatsCard
                        label="Pending"
                        value={(appointments || []).filter((a) => a.status === "Pending").length}
                        variant="yellow"
                    />
                    <StatsCard
                        label="Confirmed"
                        value={(appointments || []).filter((a) => a.status === "Confirmed").length}
                        variant="blue"
                    />
                    <StatsCard
                        label="Completed"
                        value={(appointments || []).filter((a) => a.status === "Completed").length}
                        variant="green"
                    />
                </div>

                {/* Appointments List */}
                <div className="space-y-4">
                    {(filteredAppointments || []).length === 0 ? (
                        <EmptyState filter={filter} />
                    ) : (
                        (filteredAppointments || []).map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                loading={loading === appointment.id}
                                onCancel={handleCancel}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Appointments;
