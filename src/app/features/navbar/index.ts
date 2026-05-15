// ─── Composition root ────────────────────────────────────────────────────
export { default as Navbar } from "./ui/Navbar";
export { default as ConditionalNavbar } from "./ui/ConditionalNavbar";

// ─── Container ────────────────────────────────────────────────────────────
export { NavbarContainer } from "./ui/NavbarComponents";

// ─── UI Components ────────────────────────────────────────────────────────
export { default as NavbarBrand } from "./ui/NavbarBrand";
export { default as NavbarTabs } from "./ui/NavbarTabs";
export { default as NavbarSearch } from "./ui/NavbarSearch";
export { default as NavbarUtility } from "./ui/NavbarUtility";
export { default as NavbarMobileDrawer } from "./ui/NavbarMobileDrawer";
export { default as NavbarNotificationBell } from "./ui/NavbarNotificationBell";
export { default as NavbarNotificationList } from "./ui/NavbarNotificationList";
export { default as NavbarNotificationItem } from "./ui/NavbarNotificationItem";
export { default as NavbarUserMenu } from "./ui/NavbarUserMenu";
export { default as NavbarLoginButton } from "./ui/NavbarLoginButton";

// ─── Hooks ────────────────────────────────────────────────────────────────
export { useScrollAware } from "./hooks/useScrollAware";
export { useMobileMenu } from "./hooks/useMobileMenu";
export { useSearchAutocomplete } from "./hooks/useSearchAutocomplete";
export { useNotifications } from "./hooks/useNotifications";
export { useClickOutside } from "./hooks/useClickOutside";

// ─── Constants & Types ────────────────────────────────────────────────────
export * from "./constants";
export type * from "./types";

// ─── Context ──────────────────────────────────────────────────────────────
export { useUserData, UserDataProvider } from "./context/UserDataContext";
