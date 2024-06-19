"use client";

import React, { ReactNode } from "react";
import PrivateLayout from "./Private";
import PublicLayout from "./Public";
import { usePathname } from "next/navigation";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const router = usePathname();
  const privatePaths = ["/dashboard", "/type"];

  const Layout = privatePaths.includes(router) ? PrivateLayout : PublicLayout;

  return <Layout>{children}</Layout>;
};

export default UserLayout;
