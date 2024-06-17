import React from "react";
import { Spinner } from "./spinner";

const SpinnerWithText = () => {
  return (
    <div className="flex items-center gap-3">
      <Spinner size="large" className="text-red-400">
        <span className="text-red-400">Please Wait . . .</span>
      </Spinner>
    </div>
  );
};

export default SpinnerWithText;
