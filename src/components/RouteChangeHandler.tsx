// src/components/RouteChangeHandler.tsx
import { useEffect } from "react";
import { useLocation, useNavigation } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";

export default function RouteChangeHandler() {
  const location = useLocation();
  const navigation = useNavigation();
  const { setIsLoading } = useLoading();

  // Reset loading state on route change and navigation state changes
  useEffect(() => {
    // Only set loading to true when actively navigating between routes
    if (navigation.state === "loading") {
      setIsLoading(true);
    } else {
      // Small timeout to prevent abrupt transitions
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [location.pathname, navigation.state, setIsLoading]);

  return null; // This component doesn't render anything
}
