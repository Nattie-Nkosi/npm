// src/components/RouteChangeHandler.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";

export default function RouteChangeHandler() {
  const location = useLocation();
  const { setIsLoading } = useLoading();

  // Reset loading state on route change
  useEffect(() => {
    setIsLoading(true);
    // Small timeout to allow loading to show
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]); // Removed setIsLoading from dependency array

  return null; // This component doesn't render anything
}
