export const ADMIN_TABS = [
  {
    id: "dashboard",
    label: "Dashboard",
  },
  {
    id: "kyc-verification",
    label: "Kyc Verification",
  },
  {
    id: "car-verification",
    label: "Car Verification",
  },
] as const;

export type AdminTabId = (typeof ADMIN_TABS)[number]["id"];

export const DEFAULT_ADMIN_TAB: AdminTabId = "dashboard";

export function isAdminTabId(value: string | null): value is AdminTabId {
  return ADMIN_TABS.some((tab) => tab.id === value);
}
