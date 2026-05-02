export function timeFormat(iso: Date, format: "Hour" | "Date") {
  const d = new Date(iso);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");

  if (format === "Hour") {
    return `${day}/${month}/${year} ${hour}:${minute}`;
  }
  return `${day}/${month}/${year}`;
}

type TimeDiff =
  | { value: number; unit: "minute" }
  | { value: number; unit: "hour" }
  | { value: number; unit: "day" };

export function formatRelativeTime(iso: string): TimeDiff {
  const diffMs = Date.now() - new Date(iso).getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 60) {
    return { value: minutes, unit: "minute" };
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return { value: hours, unit: "hour" };
  }

  const days = Math.floor(hours / 24);
  return { value: days, unit: "day" };
}
