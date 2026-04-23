export type NavbarLink = {
  id: string;
  label: string;
  href: string;
};

export const getPrimaryNavbarLinks = (
  appointmentPath?: string,
): NavbarLink[] => {
  const baseLinks: NavbarLink[] = [
    { id: "home", label: "Home", href: "/" },
    { id: "discover", label: "Discover", href: "/post/discover" },
  ];

  if (!appointmentPath) return baseLinks;

  return [
    ...baseLinks,
    {
      id: "appointments",
      label: "Appointments",
      href: appointmentPath,
    },
  ];
};
