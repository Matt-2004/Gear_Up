export interface AppointmentDateColumnProps {
  scheduleMonth: string;
  scheduleDay: number;
  scheduleYear: number;
  scheduleTime: string;
}

export const AppointmentDateColumn = ({
  scheduleMonth,
  scheduleDay,
  scheduleYear,
  scheduleTime,
}: AppointmentDateColumnProps) => {
  // Parse time
  const timeString = scheduleTime.toString().slice(0, 5); // e.g., "14:30"
  const [hoursStr, minutesStr] = timeString.split(":");
  let hours = parseInt(hoursStr || "0", 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const displayTime = `${hours}:${minutesStr || "00"}`;

  return (
    <div className="relative flex w-full shrink-0 flex-col items-center justify-center border-b border-gray-200 bg-gray-50/50 p-6 sm:w-44 sm:border-b-0 sm:border-r">
      {/* Month, Day Header */}
      <div className="mb-3 flex flex-col items-center justify-center text-center">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
          {scheduleMonth} {scheduleDay}, {scheduleYear}
        </span>
      </div>

      {/* Large Time Indicator */}
      <div className="flex flex-col items-center justify-center">
        <span className="text-4xl font-black tracking-tight text-gray-900 transition-colors group-hover:text-primary-600">
          {displayTime}
        </span>
        <span className="mt-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-primary-700">
          {ampm}
        </span>
      </div>
    </div>
  );
};
