import clsx from "clsx";

export type Status = "Pending" | "Approved" | "Rejected";

const StatusUI = ({ status }: { status: Status }) => {
  return (
    <div
      className={clsx(
        status === "Pending" && "bg-yellow-50",
        status === "Approved" && "bg-green-50",
        status === "Rejected" && "bg-red-50",
        "flex h-6 w-28 items-center justify-evenly rounded-full text-center",
      )}
    >
      <div
        className={clsx(
          status === "Pending" && "bg-yellow-600",
          status === "Approved" && "bg-green-600",
          status === "Rejected" && "bg-red-600",
          "h-2 w-2 rounded-full",
        )}
      />
      <h1
        className={clsx(
          status === "Pending" && "text-yellow-600",
          status === "Approved" && "rounded-full text-green-600",
          status === "Rejected" && "text-red-600",
        )}
      >
        {status}
      </h1>
    </div>
  );
};

export default StatusUI;
