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
  const [longLoading, setLongLoading] = useState(false);
  const loadingCountRef = useRef(0);
  const longLoadingTimeoutRef = useRef<number | null>(null);

  // Clean up all timeouts on unmount
  useEffect(() => {
    return () => {
      if (longLoadingTimeoutRef.current) {
        clearTimeout(longLoadingTimeoutRef.current);
      }
    };
  }, []);

  // Handle loading state changes with proper cleanup
  useEffect(() => {
    if (isLoading && loadingCountRef.current > 0) {
      // Clear any existing timeout
      if (longLoadingTimeoutRef.current) {
        clearTimeout(longLoadingTimeoutRef.current);
        longLoadingTimeoutRef.current = null;
      }

      // Show notification after 10 seconds of loading
      longLoadingTimeoutRef.current = window.setTimeout(() => {
        setLongLoading(true);
        longLoadingTimeoutRef.current = null;
      }, 10000);
    } else {
      // Clear timeout when loading stops
      if (longLoadingTimeoutRef.current) {
        clearTimeout(longLoadingTimeoutRef.current);
        longLoadingTimeoutRef.current = null;
      }

      // Hide notification
      setLongLoading(false);
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
      {/* Loading indicator - Only show for very long operations (10+ seconds) */}
      {longLoading && isLoading && loadingCountRef.current > 0 && (
        <div className="fixed top-20 right-4 z-50 transition-all duration-300">
          <div className="bg-white border-2 border-blue-500 p-4 rounded-lg shadow-xl max-w-sm">
            <div className="flex items-center gap-3">
              <Loader size="medium" />
              <div>
                <p className="font-medium text-gray-800">Still loading...</p>
                <p className="text-sm text-gray-500 mt-1">
                  This is taking longer than expected.
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="mt-3 w-full px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <FiRefreshCw className="mr-2" /> Refresh Page
            </button>
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
