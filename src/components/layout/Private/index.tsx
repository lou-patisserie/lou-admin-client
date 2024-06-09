import React, { ReactNode } from "react";
import Footer from "@/components/UI/Footer";
import Navbar from "@/components/UI/Navbar";

interface PrivateLayoutProps {
  children: ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default PrivateLayout;
