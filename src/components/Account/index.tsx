"use client";

import { useCallback, useEffect, useState } from "react";
import ContentWrapper from "../UI/ContentWrapper";
import { getAllProductTypes } from "@/api/product-type-api";
import ProfileItems from "./item";
import { useRecoilState } from "recoil";
import userState from "@/recoils/userState";
import { adminProfile } from "@/api/auth-api";

const AccountComponent = () => {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(false);

  const adminTokenString =
    typeof window !== "undefined" ? sessionStorage.getItem("admin-token") : null;
  const adminToken = adminTokenString ? JSON.parse(adminTokenString) : null;

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminProfile(adminToken!.token, { token: adminToken!.token });
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to get admin profile:", error);
      setLoading(false);
    }
  }, [adminToken, setUser]);

  useEffect(() => {
    if (user === null) {
      refetch();
    }
  }, [user, refetch]);

  return (
    <>
      <section id="type-section" className="section-wrapper m-auto pt-5 max-w-[400px] w-full">
        <h1 className="text-luoDarkBiege text-2xl font-bold mb-6">Account Management</h1>
        <div className="bg-white rounded-xl p-5">
          <ProfileItems profile={user} refetch={refetch} />
        </div>
      </section>
    </>
  );
};

export default AccountComponent;
