import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { Loader } from "../components/Loader";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
  initialLoading?: boolean;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
  initialLoading = false,
}) => {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [loadingTimeout, setLoadingTimeout] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  // Delay showing the loading overlay to prevent flashing during quick loads
  useEffect(() => {
    let overlayTimer: number | null = null;

    if (isLoading) {
      overlayTimer = window.setTimeout(() => {
        setShowOverlay(true);
      }, 300); // Only show overlay if loading takes more than 300ms
    } else {
      setShowOverlay(false);
    }

    return () => {
      if (overlayTimer) clearTimeout(overlayTimer);
    };
  }, [isLoading]);

  // Set loading with a maximum timeout to prevent infinite loading
  const setLoadingWithTimeout = useCallback(
    (loading: boolean) => {
      setIsLoading(loading);

      // Clear any existing timeout
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        setLoadingTimeout(null);
      }

      // If setting to loading, add a safety timeout
      if (loading) {
        const timeoutId = window.setTimeout(() => {
          console.warn(
            "Loading timeout reached, forcing loading state to false"
          );
          setIsLoading(false);
          setShowOverlay(false);
          setLoadingTimeout(null);
        }, 5000); // Maximum 5 seconds loading time

        setLoadingTimeout(timeoutId);
      }
    },
    [loadingTimeout]
  );

  // Clean up timeout on unmount
  useEffect(() => {
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
      {/* Only render overlay if showOverlay is true - prevents flashing */}
      {showOverlay && isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-200">
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
