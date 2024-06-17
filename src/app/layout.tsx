import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { cn } from "@/lib/utils";
import RecoilProvider from "@/lib/recoilProvider";
import UserLayout from "@/components/layout";
import { Toaster } from "@/components/UI/Toast/toaster";

export const metadata: Metadata = {
  title: "Lou Patisserie | Celebration of Sweet Moments",
  description: "Lou Patisserie's Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body id="portal" className={`${cn(GeistSans.variable)} bg-luoBiege`}>
        <Toaster />
        <RecoilProvider>
          <UserLayout>{children}</UserLayout>
        </RecoilProvider>
      </body>
    </html>
  );
}
