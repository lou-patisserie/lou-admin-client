import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { cn } from "@/lib/utils";
import RecoilProvider from "@/lib/recoilProvider";
import UserLayout from "@/components/layout";
import { Toaster } from "@/components/UI/Toast/toaster";

export const metadata: Metadata = {
  title: "Admin Panel | Lou Patisserie",
  description:
    "Lou's Patisserie Admin Dashboard",
  keywords: "lou patisserie, pastry & gelato, lou patisserie gading serpong, lou patisserie pastry & gelato",
  authors: [
    {
      name: "Lou Patisserie & Grivo.id",
      url: "https://wwww.loupatisserie.com",
    },
  ],
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: "https://wwww.loupatisserie.com",
    title: "Luo Patisserie",
    description:
      "Lou's Patisserie Admin Dashboard",
    siteName: "Lou Patisserie",
    images: [
      {
        url: "https://firebasestorage.googleapis.com/v0/b/lou-patisserie.appspot.com/o/logo%2FLOU%20L%20Symbol%20BG-02.png?alt=media&token=d50eea79-30b8-4622-86e8-ae0023d9c6b1",
      },
    ],
  },
  icons: {
    icon: "/lou-logo.png",
  },
  twitter: {
    card: "summary_large_image",
    site: "https://wwww.loupatisserie.com",
    creator: "Lou Patisserie & Grivo.id",
    images: "https://firebasestorage.googleapis.com/v0/b/lou-patisserie.appspot.com/o/logo%2FLOU%20L%20Symbol%20BG-02.png?alt=media&token=d50eea79-30b8-4622-86e8-ae0023d9c6b1",
  },
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
