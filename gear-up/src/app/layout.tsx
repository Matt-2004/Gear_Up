import StoreProvider from "@/app/hooks/StoreProvider";
import CookieSetter from "@/components/CookieSetter";
import ConditionalNavbar from "@/components/Navbar/ConditionalNavbar";
import NotificationProvider from "@/Context/NotificationContext";
import { UserDataProvider } from "@/Context/UserDataContext";
import NextAuthSessionProvider from "@/provider/NextAuthSessionProvider";
import ReactQueryProvider from "@/provider/ReactQueryProvider";
import { getDecryptedFullUserData } from "@/utils/cookieHelper";
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
  const cookieStore = await cookies();
  const user_data_cookie = cookieStore.get("user_data")?.value;

  // Get user data from cached cookie instead of making API call
  if (user_data_cookie) {
    console.log("User data cookie found in layout, decrypting...");
    try {
      user = await getDecryptedFullUserData(user_data_cookie);

    } catch (error) {
      console.error("Failed to decrypt user data in layout:", error);
    }
  }

  return (
    <html lang="en" className={`${roboto.className}`}>
      <body className={`antialiased`}>
        <NextAuthSessionProvider>
          <StoreProvider>
            <ReactQueryProvider>
              <UserDataProvider initialUser={user}>
                <NotificationProvider>
                  <CookieSetter />
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
