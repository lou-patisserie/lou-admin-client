"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import authState from "@/recoils/authState";
import SpinnerWithText from "@/components/UI/Spinner";

export default function Home() {
  const [isAuthenticated, setAuthenticated] = useRecoilState(authState);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("admin-token");
      if (!token) {
        setAuthenticated(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    }
  }, [router, setAuthenticated]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <SpinnerWithText />
    </div>
  );
}
