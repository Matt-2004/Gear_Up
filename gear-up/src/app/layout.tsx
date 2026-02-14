import StoreProvider from "@/app/hooks/StoreProvider";
import { IUser } from "@/app/types/user.types";
import CookieSetter from "@/components/CookieSetter";
import ConditionalNavbar from "@/components/Navbar/ConditionalNavbar";
import NotificationProvider from "@/Context/NotificationContext";
import { UserDataProvider } from "@/Context/UserDataContext";
import NextAuthSessionProvider from "@/provider/NextAuthSessionProvider";
import ReactQueryProvider from "@/provider/ReactQueryProvider";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Gear Up - Your Ultimate Car Marketplace",
    template: "%s | Gear Up",
  },
  description: "Discover, buy, and sell amazing vehicles on Gear Up. Your trusted platform for automotive excellence.",
  icons: {
    icon: "/browser_tab_logo.png",
    apple: "/browser_tab_logo.png",
  },
  openGraph: {
    title: "Gear Up - Your Ultimate Car Marketplace",
    description: "Discover, buy, and sell amazing vehicles on Gear Up. Your trusted platform for automotive excellence.",
    images: [
      {
        url: "/browser_tab_logo.png",
        width: 1200,
        height: 630,
        alt: "Gear Up Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gear Up - Your Ultimate Car Marketplace",
    description: "Discover, buy, and sell amazing vehicles on Gear Up. Your trusted platform for automotive excellence.",
    images: ["/browser_tab_logo.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  let user = null;

  try {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;

    if (access_token) {
      const res = await fetch("/api/user", {
        method: "GET",
        headers: { Cookie: `access_token=${access_token}` },
        credentials: "include",
        cache: "no-store",
      });
      if (res.ok) {
        const response = (await res.json()) as IUser;
        user = response?.data || null;
      } else {
        console.error("Failed to fetch user:", res.status, res.statusText);
      }
    }
  } catch (error) {
    console.error("Failed to fetch user in layout:", error);
  }

  return (
    <html lang="en" className={`${roboto.className}`}>
      <body className={`antialiased`}>
        <NextAuthSessionProvider>
          <StoreProvider>
            <ReactQueryProvider>
              <UserDataProvider initialUser={user}>
                <NotificationProvider>
                  <CookieSetter userId={user?.id || null} />
                  {/* TODO: Navbar not tested yet - needs testing before production */}
                  <ConditionalNavbar />
                  {children}
                </NotificationProvider>
              </UserDataProvider>
            </ReactQueryProvider>
          </StoreProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
