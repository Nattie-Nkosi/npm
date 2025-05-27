import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Loader } from "../components/Loader";
import { FiRefreshCw } from "react-icons/fi";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
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
  const [isLoading, setIsLoadingState] = useState(initialLoading);
  const [showOverlay, setShowOverlay] = useState(false);
  const [longLoading, setLongLoading] = useState(false);
  const loadingCountRef = useRef(0);
  const overlayTimeoutRef = useRef<number | null>(null);
  const longLoadingTimeoutRef = useRef<number | null>(null);

  // Clean up all timeouts on unmount
  useEffect(() => {
    return () => {
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
      }
      if (longLoadingTimeoutRef.current) {
        clearTimeout(longLoadingTimeoutRef.current);
      }
    };
  }, []);

  // Handle loading state changes with proper cleanup
  useEffect(() => {
    if (isLoading && loadingCountRef.current > 0) {
      // Clear any existing timeouts
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
        overlayTimeoutRef.current = null;
      }
      if (longLoadingTimeoutRef.current) {
        clearTimeout(longLoadingTimeoutRef.current);
        longLoadingTimeoutRef.current = null;
      }

      // Show overlay after 400ms to prevent flashing
      overlayTimeoutRef.current = window.setTimeout(() => {
        setShowOverlay(true);
        overlayTimeoutRef.current = null;

        // Show refresh option after 10 seconds
        longLoadingTimeoutRef.current = window.setTimeout(() => {
          setLongLoading(true);
          longLoadingTimeoutRef.current = null;
        }, 10000);
      }, 400);
    } else {
      // Clear timeouts when loading stops
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
        overlayTimeoutRef.current = null;
      }
      if (longLoadingTimeoutRef.current) {
        clearTimeout(longLoadingTimeoutRef.current);
        longLoadingTimeoutRef.current = null;
      }

      // Hide overlay with a slight delay for smooth transition
      const hideTimer = setTimeout(() => {
        setShowOverlay(false);
        setLongLoading(false);
      }, 100);

      return () => clearTimeout(hideTimer);
    }
  }, [isLoading]);

  // Set loading with reference counting to handle concurrent operations
  const setIsLoading = useCallback((loading: boolean) => {
    if (loading) {
      loadingCountRef.current += 1;
      setIsLoadingState(true);
    } else {
      loadingCountRef.current = Math.max(0, loadingCountRef.current - 1);
      if (loadingCountRef.current === 0) {
        setIsLoadingState(false);
      }
    }
  }, []);

  // Convenience methods
  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, [setIsLoading]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  // Force refresh the page
  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        isLoading: isLoading && loadingCountRef.current > 0,
        setIsLoading,
        startLoading,
        stopLoading,
      }}
    >
      {children}
      {/* Loading overlay */}
      {showOverlay && isLoading && loadingCountRef.current > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-200">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <Loader size="large" />
            <p className="text-center mt-4">
              {longLoading ? "Still loading..." : "Loading..."}
            </p>

            {/* Show refresh button for long loading times */}
            {longLoading && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 mb-2">
                  This is taking longer than expected.
                </p>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center mx-auto"
                >
                  <FiRefreshCw className="mr-2" /> Refresh Page
                </button>
              </div>
            )}
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
