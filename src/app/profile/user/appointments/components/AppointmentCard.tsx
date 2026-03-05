import { IAppointment } from "@/types/appointment.types"
import SharedAppointmentCard from "@/components/Appointment/AppointmentCard"
import { formatDate, getStatusColor } from "../utils"

interface AppointmentCardProps {
	appointment: IAppointment
	loading: boolean
	onCancel: (appointmentId: string) => void
}

const AppointmentCard = ({
	appointment,
	loading,
	onCancel,
}: AppointmentCardProps) => {
	return (
		<SharedAppointmentCard
			appointment={appointment}
			loading={loading}
			mode="user"
			formatDate={formatDate}
			getStatusColor={getStatusColor}
			onCancel={onCancel}
		/>
	)
}

export default AppointmentCard
