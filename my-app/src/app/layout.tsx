import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

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
      <body className={`${GeistSans.variable}`}>{children}</body>
    </html>
  );
}
