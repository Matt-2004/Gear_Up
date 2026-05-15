import type { ReactNode } from "react";

export interface NavbarLink {
  id: string;
  label: string;
  href: string;
}

export interface NavbarLinkWithIcon extends NavbarLink {
  icon: ReactNode;
}

export interface MenuItem {
  label: string;
  href: string;
  icon: ReactNode;
  divider?: boolean;
}

export type NotificationTab = "app" | "chat";
