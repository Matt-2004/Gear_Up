export const DEALER_TABS = [
  {
    id: "car-management",
    label: "Vehicles",
  },
  {
    id: "post-management",
    label: "Posts",
  },
  {
    id: "appointment-management",
    label: "Appointments",
  },
  {
    id: "revenue-management",
    label: "Revenue",
  },
  {
    id: "setting",
    label: "Settings",
  },
] as const;

export type DealerTabId = (typeof DEALER_TABS)[number]["id"];

export const DEFAULT_DEALER_TAB: DealerTabId = "car-management";

export function isDealerTabId(value: string | null): value is DealerTabId {
  return DEALER_TABS.some((tab) => tab.id === value);
}
