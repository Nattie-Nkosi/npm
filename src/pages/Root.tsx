import { Outlet, useNavigation, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import RouteChangeHandler from "../components/RouteChangeHandler";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollToTop";

// Progress bar component for navigation
const ProgressBar = ({ isNavigating }: { isNavigating: boolean }) => {
  const [progress, setProgress] = useState(20);

  // Animate progress when navigating
  useEffect(() => {
    let progressInterval: number;

    if (isNavigating) {
      // Start at 20% and gradually increase to 70%
      setProgress(20);
      progressInterval = window.setInterval(() => {
        setProgress((prevProgress) => {
          // Slowly progress to 70%, but never complete automatically
          if (prevProgress < 70) {
            return prevProgress + (70 - prevProgress) * 0.1;
          }
          return prevProgress;
        });
      }, 200);
    } else {
      // Complete the progress bar animation when navigation is done
      setProgress(100);

      // Clear any existing interval
      progressInterval = window.setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(progressInterval);
            // Reset back to 0 after a delay
            setTimeout(() => setProgress(0), 200);
            return 100;
          }
          return 100; // Jump to 100%
        });
      }, 100);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isNavigating]);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50">
      <div
        className="h-full bg-blue-600 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Simple scroll to top on route change
const ScrollToTopOnNav = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function Root() {
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Always ensure we scroll to top on navigation */}
      <ScrollToTopOnNav />

      {/* Only display the progress bar, not an additional loading indicator */}
      <ProgressBar isNavigating={isNavigating} />
      <RouteChangeHandler />

      {/* Header - fixed at top */}
      <Header />

      {/* Main content - now centered with container and will grow to fill available space */}
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          <Outlet />
        </div>
      </main>

      {/* Footer - at bottom */}
      <Footer />

      {/* Scroll to top button */}
      <ScrollToTopButton />
    </div>
  );
}
