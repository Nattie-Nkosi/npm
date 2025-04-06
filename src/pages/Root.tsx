import { Outlet, useNavigation } from "react-router-dom";
import Header from "../components/Header";
import RouteChangeHandler from "../components/RouteChangeHandler";
import Footer from "../components/Footer";

// Simple progress bar component for navigation
const ProgressBar = ({ isNavigating }: { isNavigating: boolean }) => {
  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50">
      <div
        className="h-full bg-blue-600 animate-pulse transition-all duration-300 ease-in-out"
        style={{ width: "70%" }}
      />
    </div>
  );
};

export default function Root() {
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Only display the progress bar, not an additional loading indicator */}
      <ProgressBar isNavigating={isNavigating} />
      <RouteChangeHandler />

      {/* Header - directly imported */}
      <Header />

      {/* Main content - now centered with container */}
      <main className="flex-grow">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>

      {/* Footer - directly imported */}
      <Footer />
    </div>
  );
}
