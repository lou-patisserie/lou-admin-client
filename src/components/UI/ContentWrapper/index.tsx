import { ReactNode } from "react";
import SpinnerWithText from "../Spinner";

interface ContentWrapperProps {
  children: ReactNode;
  loading: boolean;
}

const ContentWrapper = ({ children, loading }: ContentWrapperProps) => {
  return (
    <div className="bg-white mb-10 py-4 px-6 rounded-lg min-h-[300px]">
      {loading ? (
        <div className="w-full h-[300px] flex items-center justify-center">
          <SpinnerWithText text="Loading..." />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default ContentWrapper;
