import React, { ReactNode } from "react";
import Footer from "@/components/UI/Footer";
import Navbar from "@/components/UI/Navbar";

interface PrivateLayoutProps {
  children: ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default PrivateLayout;
