import React, { createContext, useContext, useState, ReactNode } from "react";
import { Loader } from "../components/Loader";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState<number | null>(null);

  // Set loading with a maximum timeout to prevent infinite loading
  const setLoadingWithTimeout = (loading: boolean) => {
    setIsLoading(loading);

    // Clear any existing timeout
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
      setLoadingTimeout(null);
    }

    // If setting to loading, add a safety timeout
    if (loading) {
      const timeoutId = window.setTimeout(() => {
        console.warn("Loading timeout reached, forcing loading state to false");
        setIsLoading(false);
        setLoadingTimeout(null);
      }, 5000); // Maximum 5 seconds loading time

      setLoadingTimeout(timeoutId);
    }
  };

  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [loadingTimeout]);

  return (
    <LoadingContext.Provider
      value={{ isLoading, setIsLoading: setLoadingWithTimeout }}
    >
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <Loader size="large" />
            <p className="text-center mt-4">Loading...</p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
