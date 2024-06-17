import { ReactNode } from "react";

interface ContentWrapperProps {
  children: ReactNode;
  loading: boolean;
}

const ContentWrapper = ({ children, loading }: ContentWrapperProps) => {
  return (
    <div className="bg-white mb-10 py-4 px-6 rounded-lg">
      {loading ? (
        <div className="flex flex-row items-center justify-center">
          <span className="loading loading-bars loading-xs"></span>
          <span className="loading loading-bars loading-sm"></span>
          <span className="loading loading-bars loading-md"></span>
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default ContentWrapper;
