import { useEffect, useRef } from "react";
import { useLocation, useNavigation } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";

export default function RouteChangeHandler() {
  const location = useLocation();
  const navigation = useNavigation();
  const { setIsLoading } = useLoading();
  const prevPathRef = useRef<string>(location.pathname);
  const navigationTimeoutRef = useRef<number | null>(null);

  // Reset loading state on route change and navigation state changes
  useEffect(() => {
    const currentPath = location.pathname;
    const isNewRoute = currentPath !== prevPathRef.current;

    // Update previous path reference
    prevPathRef.current = currentPath;

    // Handle navigation states
    if (navigation.state === "loading") {
      // Clear any existing timeout
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }

      // Set loading state
      setIsLoading(true);

      // Set a timeout to prevent infinite loading state
      navigationTimeoutRef.current = window.setTimeout(() => {
        setIsLoading(false);
        navigationTimeoutRef.current = null;
      }, 5000); // 5 second safety timeout
    } else {
      // Small delay to prevent abrupt transitions
      if (isNewRoute) {
        // Small delay for visual transition
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 100);

        return () => {
          clearTimeout(timer);
        };
      } else {
        // Immediately turn off loading if we're not changing routes
        setIsLoading(false);
      }

      // Clear any pending navigation timeouts
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }
    }

    // Clean up timeout on unmount
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [location.pathname, location.search, navigation.state, setIsLoading]);

  // Track page views (could be integrated with analytics)
  useEffect(() => {
    // This would be a good place to add analytics tracking
    const currentPath = location.pathname + location.search;

    // Example of logging page views (replace with actual analytics)
    console.log("Page viewed:", currentPath);

    // Here you could add code like:
    // if (window.gtag) {
    //   window.gtag('config', 'GA_MEASUREMENT_ID', {
    //     page_path: currentPath
    //   });
    // }
  }, [location.pathname, location.search]);

  return null; // This component doesn't render anything
}
