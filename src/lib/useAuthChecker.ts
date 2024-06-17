"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import authState from "@/recoils/authState";

const useAuthChecker = () => {
  const [isAuthenticated, setAuthenticated] = useRecoilState(authState);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const tokenDataString = sessionStorage.getItem("admin-token");

      if (!tokenDataString) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      const tokenData = JSON.parse(tokenDataString);
      const now = Date.now();

      if (now >= tokenData.expirationTime) {
        sessionStorage.removeItem("admin-token");
        setAuthenticated(false);
      } else {
        setAuthenticated(true);
      }

      setLoading(false);
    };

    checkAuth();
  }, [setAuthenticated]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    } else if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  return { isAuthenticated, loading };
};

export default useAuthChecker;
