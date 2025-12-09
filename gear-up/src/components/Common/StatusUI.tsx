import clsx from "clsx"

export type Status = "Pending" | "Approved" | "Rejected"

const StatusUI = ({ status }: { status: Status }) => {
	return (
		<div
			className={clsx(
				status === "Pending" && "bg-yellow-100",
				status === "Approved" && "bg-green-50",
				status === "Rejected" && "bg-red-100",
				"flex h-[1.5rem] w-[7rem] items-center justify-evenly rounded-full text-center",
			)}
		>
			<div className={"h-2 w-2 rounded-full bg-[#15803D]"} />
			<h1
				className={clsx(
					status === "Pending" && "bg-yellow-400",
					status === "Approved" && "rounded-full text-[#15803D]",
					status === "Rejected" && "bg-red-500",
				)}
			>
				{status}
			</h1>
		</div>
	)
}

export default StatusUI
