import { AppointmentData } from "@/types/appointment.types";
import { getStatusColor } from "@/components/Appointment/appointmentUtils";
import RoleBasedAppointmentCard from "@/components/Appointment/RoleBasedAppointmentCard";

interface AppointmentCardProps {
  appointment: AppointmentData;
  loading: boolean;
  onCancel: (appointmentId: string) => void;
}

const AppointmentCard = ({
  appointment,
  loading,
  onCancel,
}: AppointmentCardProps) => {
  return (
    <RoleBasedAppointmentCard
      appointment={appointment}
      loading={loading}
      mode="user"
      getStatusColor={getStatusColor}
      onCancel={onCancel}
    />
  );
};

export default AppointmentCard;
