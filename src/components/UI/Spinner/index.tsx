import React from "react";
import { Spinner } from "./spinner";

interface SpinnerProps {
  text: string;
}

const SpinnerWithText = ({ text }: SpinnerProps) => {
  return (
    <div className="flex items-center gap-3">
      <Spinner size="large" className="text-luoDarkBiege">
        <span className="text-luoDarkBiege">{text}</span>
      </Spinner>
    </div>
  );
};

export default SpinnerWithText;
