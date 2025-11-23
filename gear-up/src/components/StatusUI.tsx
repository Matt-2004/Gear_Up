import clsx from "clsx";

export type Status = "Pending" | "Approved" | "Rejected";

const StatusUI = ({ status }: { status: Status }) => {
  return (
    <div
      className={clsx(
        status === "Pending" && "bg-yellow-100",
        status === "Approved" && "bg-green-50",
        status === "Rejected" && "bg-red-100",
        "w-[7rem] h-[1.5rem] flex items-center text-center justify-evenly  rounded-full",
      )}
    >
      <div className={"w-2 h-2 rounded-full bg-[#15803D]"} />
      <h1
        className={clsx(
          status === "Pending" && "bg-yellow-400",
          status === "Approved" && "text-[#15803D] rounded-full",
          status === "Rejected" && "bg-red-500",
        )}
      >
        {status}
      </h1>
    </div>
  );
};

export default StatusUI;
