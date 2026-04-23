import { AppointmentData } from "@/types/appointment.types";
import SharedAppointmentCard from "@/components/Appointment/RoleBasedAppointmentCard";
import {
  formatDate,
  getStatusColor,
} from "@/components/Appointment/appointmentUtils";

interface AppointmentCardProps {
  appointment: AppointmentData;
  loading: boolean;
  onAccept: (appointmentId: string) => void;
  onReject: (appointmentId: string, rejectionReason: string) => void;
  onComplete: (appointmentId: string) => void;
  onCancel: (appointmentId: string) => void;
}

const AppointmentCard = ({
  appointment,
  loading,
  onAccept,
  onReject,
  onComplete,
  onCancel,
}: AppointmentCardProps) => {
  return (
    <SharedAppointmentCard
      appointment={appointment}
      loading={loading}
      mode="dealer"
      getStatusColor={getStatusColor}
      onAccept={onAccept}
      onReject={onReject}
      onComplete={onComplete}
      onCancel={onCancel}
    />
  );
};

export default AppointmentCard;
