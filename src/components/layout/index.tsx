"use client";

import React, { ReactNode } from "react";
import PrivateLayout from "./Private";
import PublicLayout from "./Public";
import { useRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import authState from "@/recoils/authState";
import { useEffect } from "react";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const [isAuthenticated] = useRecoilState(authState);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, router]);

  const Layout = isAuthenticated ? PrivateLayout : PublicLayout;

  return <Layout>{children}</Layout>;
};

export default UserLayout;
