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
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [showOverlay, setShowOverlay] = useState(false);
  const [longLoading, setLongLoading] = useState(false);
  const loadingTimeoutRef = useRef<number | null>(null);
  const overlayTimeoutRef = useRef<number | null>(null);
  const longLoadingTimeoutRef = useRef<number | null>(null);

  // Force reset loading state on component mount to avoid stuck states
  useEffect(() => {
    const resetTimeout = setTimeout(() => {
      setIsLoading(false);
      setShowOverlay(false);
      setLongLoading(false);
    }, 100);

    // Clean up all timeouts when component unmounts
    return () => {
      clearTimeout(resetTimeout);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
      }
      if (longLoadingTimeoutRef.current) {
        clearTimeout(longLoadingTimeoutRef.current);
      }
    };
  }, []);

  // Delay showing the loading overlay to prevent flashing during quick loads
  useEffect(() => {
    if (isLoading) {
      // Clear any existing overlay timeout
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
        overlayTimeoutRef.current = null;
      }

      if (longLoadingTimeoutRef.current) {
        clearTimeout(longLoadingTimeoutRef.current);
        longLoadingTimeoutRef.current = null;
      }

      // Set a new overlay timeout
      overlayTimeoutRef.current = window.setTimeout(() => {
        setShowOverlay(true);
        overlayTimeoutRef.current = null;

        // Set long loading timeout to show refresh option
        longLoadingTimeoutRef.current = window.setTimeout(() => {
          setLongLoading(true);
          longLoadingTimeoutRef.current = null;
        }, 10000); // Show refresh option after 10 seconds
      }, 400); // Only show overlay if loading takes more than 400ms
    } else {
      // Clear overlay and long loading timeouts if we're no longer loading
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
        overlayTimeoutRef.current = null;
      }

      if (longLoadingTimeoutRef.current) {
        clearTimeout(longLoadingTimeoutRef.current);
        longLoadingTimeoutRef.current = null;
      }

      // Delay hiding overlay slightly for smoother transitions
      setTimeout(() => {
        setShowOverlay(false);
        setLongLoading(false);
      }, 100);
    }
  }, [isLoading]);

  // Set loading with a maximum timeout to prevent infinite loading
  const setLoadingWithTimeout = useCallback((loading: boolean) => {
    setIsLoading(loading);

    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    // If setting to loading, add a safety timeout
    if (loading) {
      loadingTimeoutRef.current = window.setTimeout(() => {
        console.warn("Loading timeout reached, forcing loading state to false");
        setIsLoading(false);
        setShowOverlay(false);
        setLongLoading(false);
        loadingTimeoutRef.current = null;
      }, 15000); // 15 second maximum loading time
    }
  }, []);

  // Convenience methods to start and stop loading
  const startLoading = useCallback(() => {
    setLoadingWithTimeout(true);
  }, [setLoadingWithTimeout]);

  const stopLoading = useCallback(() => {
    setLoadingWithTimeout(false);
  }, [setLoadingWithTimeout]);

  // Force refresh the page if loading takes too long
  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setIsLoading: setLoadingWithTimeout,
        startLoading,
        stopLoading,
      }}
    >
      {children}
      {/* Only render overlay if showOverlay is true - prevents flashing */}
      {showOverlay && isLoading && (
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
