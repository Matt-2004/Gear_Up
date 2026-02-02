import { IAppointment } from "@/app/types/appointment.types";
import {
    Calendar,
    Car,
    Clock,
    MapPin,
    StickyNote,
    User,
    XCircle,
} from "lucide-react";
import { formatDate, getStatusColor } from "../utils";

interface AppointmentCardProps {
    appointment: IAppointment;
    loading: boolean;
    onCancel: (appointmentId: string) => void;
}

const AppointmentCard = ({
    appointment,
    loading,
    onCancel,
}: AppointmentCardProps) => {
    return (
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-3">
                        <Car className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {appointment.carTitle}
                        </h3>
                        <p className="text-sm text-gray-600">
                            Appointment ID: {appointment.id.slice(0, 8)}
                        </p>
                    </div>
                </div>
                <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(
                        appointment.status,
                    )}`}
                >
                    {appointment.status}
                </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2 mb-4">
                <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-gray-700">
                            Scheduled Date
                        </p>
                        <p className="text-sm text-gray-600">
                            {formatDate(appointment.schedule)}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-gray-700">Location</p>
                        <p className="text-sm text-gray-600">
                            {appointment.location}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-gray-700">Dealer</p>
                        <p className="text-sm text-gray-600">
                            {appointment.agentName}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-gray-700">Created</p>
                        <p className="text-sm text-gray-600">
                            {formatDate(appointment.createdAt)}
                        </p>
                    </div>
                </div>
            </div>

            {appointment.notes && (
                <div className="flex items-start gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                    <StickyNote className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-gray-700">Notes</p>
                        <p className="text-sm text-gray-600">{appointment.notes}</p>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                {(appointment.status === "Pending" ||
                    appointment.status === "Confirmed") && (
                        <button
                            onClick={() => onCancel(appointment.id)}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <XCircle className="h-4 w-4" />
                            {loading ? "Cancelling..." : "Cancel Appointment"}
                        </button>
                    )}
            </div>
        </div>
    );
};

export default AppointmentCard;
