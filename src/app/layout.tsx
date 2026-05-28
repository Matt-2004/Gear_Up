import ConditionalNavbar from "@/app/features/navbar/ui/ConditionalNavbar";
import NotificationProvider from "@/app/features/notification/context/NotificationContext";
import { UserDataProvider } from "@/app/features/navbar/context/UserDataContext";

import ReactQueryProvider from "@/app/shared/provider/ReactQueryProvider";
import ToastProvider from "@/app/features/toast/provider/ToastProvider";
import SectionErrorBoundary from "@/app/shared/ui/SectionErrorBoundary";
import GlobalFooter from "@/app/shared/ui/GlobalFooter";
import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
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
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "Gear Up",
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
    locale: "en_US",
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
  return (
    <html lang="en" className={`${montserrat.variable} ${roboto.variable}`}>
      <body className="antialiased font-sans">
        <ToastProvider>
          <ReactQueryProvider>
            <UserDataProvider>
              <NotificationProvider>
                <ConditionalNavbar />
                <SectionErrorBoundary>{children}</SectionErrorBoundary>
                <GlobalFooter />
              </NotificationProvider>
            </UserDataProvider>
          </ReactQueryProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
