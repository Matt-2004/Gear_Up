import {
  CarFront,
  Home,
  Search,
  type LucideIcon,
} from "lucide-react";
import type { NavbarLink } from "./types";

// ─── Navigation Links ──────────────────────────────────────────────────────

export const PRIMARY_NAVBAR_LINKS: NavbarLink[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "browse", label: "Browse Cars", href: "/car/search" },
];

export const SECONDARY_MOBILE_LINKS = [
  { id: "discover", label: "Discover", href: "/post/discover" },
  { id: "messages", label: "Messages", href: "/messages" },
] as const;

// ─── Mobile Icon Map ───────────────────────────────────────────────────────

export const MOBILE_LINK_ICONS: Record<string, LucideIcon> = {
  home: Home,
  browse: Search,
  sell: CarFront,
};

// ─── Search ────────────────────────────────────────────────────────────────

export const SEARCH_CATEGORY_CHIPS = ["SUV", "Sedan", "EV", "Luxury"] as const;

// ─── Auth-Restricted Routes (hide navbar) ──────────────────────────────────

export const NAVBAR_HIDDEN_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/email/reset-password",
  "/auth/password/reset",
  "/profile/admin",
  "/profile/admin/login",
] as const;

// ─── Scroll ────────────────────────────────────────────────────────────────

export const SCROLL_THRESHOLD = 20;
