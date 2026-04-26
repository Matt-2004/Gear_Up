import clsx from "clsx";

export type Status = "Pending" | "Approved" | "Rejected";

const StatusUI = ({ status }: { status: Status }) => {
  return (
    <div
      className={clsx(
        status === "Pending" && "bg-yellow-100",
        status === "Approved" && "bg-green-100",
        status === "Rejected" && "bg-red-100",
        "flex h-6 w-28 items-center justify-evenly rounded-full text-center",
      )}
    >
      <div
        className={clsx(
          status === "Pending" && "bg-yellow-700",
          status === "Approved" && "bg-primary",
          status === "Rejected" && "bg-red-700",
          "h-2 w-2 rounded-full",
        )}
      />
      <h1
        className={clsx(
          status === "Pending" && "text-yellow-700",
          status === "Approved" && "rounded-full text-primary",
          status === "Rejected" && "text-red-700",
        )}
      >
        {status}
      </h1>
    </div>
  );
};

export default StatusUI;
