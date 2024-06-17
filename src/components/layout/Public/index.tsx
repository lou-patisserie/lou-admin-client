import React, { ReactNode } from "react";
import Footer from "@/components/UI/Footer";
import Navbar from "@/components/UI/Navbar";

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-screen">
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
