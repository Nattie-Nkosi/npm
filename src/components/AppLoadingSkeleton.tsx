import React, { useEffect, useState } from "react";
import { FiPackage } from "react-icons/fi";

interface AppLoadingSkeletonProps {}

const AppLoadingSkeleton: React.FC<AppLoadingSkeletonProps> = () => {
  const [loadingDots, setLoadingDots] = useState(".");
  const [loadingTime, setLoadingTime] = useState(0);

  // Show different messages based on loading time
  const getLoadingMessage = () => {
    if (loadingTime > 8) {
      return "Still loading... Taking longer than expected. You can refresh the page if needed.";
    } else if (loadingTime > 4) {
      return "Loading application resources...";
    }
    return "Loading application...";
  };

  // Animate loading dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setLoadingDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 400);

    // Track loading time to show different messages
    const timeInterval = setInterval(() => {
      setLoadingTime((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="p-8 rounded-lg flex flex-col items-center max-w-md text-center">
        <div className="bg-blue-600 p-4 rounded-full mb-8">
          <FiPackage className="h-12 w-12 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          NPM Registry Explorer
        </h1>

        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>

        <p className="text-gray-600 mb-2">
          {getLoadingMessage()}
          <span className="inline-block w-8">{loadingDots}</span>
        </p>

        {loadingTime > 8 && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        )}
      </div>
    </div>
  );
};

export default AppLoadingSkeleton;
