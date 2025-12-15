export function timeFormat(iso: string, format: "Hour" | "Date") {
	const d = new Date(iso)

	const year = d.getFullYear()
	const month = String(d.getMonth() + 1).padStart(2, "0")
	const day = String(d.getDate()).padStart(2, "0")
	const hour = String(d.getHours()).padStart(2, "0")
	const minute = String(d.getMinutes()).padStart(2, "0")

	if (format === "Hour") {
		return `${day}/${month}/${year} ${hour}:${minute}`
	}
	return `${day}/${month}/${year}`
}
