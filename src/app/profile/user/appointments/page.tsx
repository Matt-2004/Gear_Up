import { IAppointment } from "@/types/appointment.types"
import { CursorBaseDTO } from "@/types/post.types"
import { myAppointments } from "@/utils/API/AppointmentAPI"
import Appointments from "./Appointments"

export const dynamic = "force-dynamic"

async function getData(cursor?: string) {
	try {
		const res = await myAppointments(cursor)
		return res?.data
	} catch (error) {
		console.error("Failed to fetch appointments:", error)
		return { items: [], cursor: null, hasMore: false }
	}
}

const Page = async () => {
	const result: Omit<CursorBaseDTO, "items"> & { items: IAppointment[] } =
		await getData()
	const appointments = result?.items || []

	return <Appointments appointments={appointments} />
}

export default Page
