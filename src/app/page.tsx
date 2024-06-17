"use client";

import SpinnerWithText from "@/components/UI/Spinner";
import useAuthChecker from "@/lib/useAuthChecker";

export default function Home() {
  const { loading } = useAuthChecker();

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center overflow-clip">
        <SpinnerWithText />
      </div>
    );
  }
}
