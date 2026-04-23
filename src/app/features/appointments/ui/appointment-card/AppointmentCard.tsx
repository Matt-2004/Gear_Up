import { AppointmentData } from "@/app/features/appointments/types/appointment.types";
import { getStatusColor } from "@/app/features/appointments/utils/appointmentUtils";
import RoleBasedAppointmentCard from "@/app/features/appointments/ui/appointment-card/RoleBasedAppointmentCard";

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
