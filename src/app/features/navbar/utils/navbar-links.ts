import { PRIMARY_NAVBAR_LINKS } from "../constants";
import type { NavbarLink } from "../types";

export type { NavbarLink };

export const getPrimaryNavbarLinks = (): NavbarLink[] => PRIMARY_NAVBAR_LINKS;
