export const DEALER_TABS = [
  {
    id: "car-management",
    label: "Car Management",
  },
  {
    id: "post-management",
    label: "Post Management",
  },
  {
    id: "appointment-management",
    label: "Appointment Management",
  },
  {
    id: "revenue-management",
    label: "Revenue Management",
  },
  {
    id: "setting",
    label: "Setting",
  },
] as const;

export type DealerTabId = (typeof DEALER_TABS)[number]["id"];

export const DEFAULT_DEALER_TAB: DealerTabId = "car-management";

export function isDealerTabId(value: string | null): value is DealerTabId {
  return DEALER_TABS.some((tab) => tab.id === value);
}
