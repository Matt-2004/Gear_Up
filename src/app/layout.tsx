import StoreProvider from "@/app/hooks/StoreProvider";

import ConditionalNavbar from "@/components/Navbar/ConditionalNavbar";
import NotificationProvider from "@/Context/NotificationContext";
import { UserDataProvider } from "@/Context/UserDataContext";
import NextAuthSessionProvider from "@/provider/NextAuthSessionProvider";
import ReactQueryProvider from "@/provider/ReactQueryProvider";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Gear Up - Your Ultimate Car Marketplace",
    template: "%s | Gear Up",
  },
  description:
    "Discover, buy, and sell amazing vehicles on Gear Up. Your trusted platform for automotive excellence.",
  icons: [
    {
      rel: "icon",
      type: "image/x-icon",
      url: "/favicon.ico",
    },
    {
      rel: "shortcut icon",
      url: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      url: "/favicon.ico",
    },
  ],
  openGraph: {
    title: "Gear Up - Your Ultimate Car Marketplace",
    description:
      "Discover, buy, and sell amazing vehicles on Gear Up. Your trusted platform for automotive excellence.",
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
    description:
      "Discover, buy, and sell amazing vehicles on Gear Up. Your trusted platform for automotive excellence.",
    images: ["/browser_tab_logo.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // check access and refresh token
  // if exist, fetch user data
  // add data in UserDataContext

  return (
    <html lang="en" className={`${roboto.className}`}>
      <body className={`antialiased`}>
        <NextAuthSessionProvider>
          <StoreProvider>
            <ReactQueryProvider>
              <UserDataProvider>
                <NotificationProvider>
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
