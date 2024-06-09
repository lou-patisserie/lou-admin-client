import React, { ReactNode } from "react";
import Footer from "@/components/UI/Footer";
import Navbar from "@/components/UI/Navbar";

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

export default PublicLayout;
