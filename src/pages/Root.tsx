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
        className="h-full bg-blue-600 animate-pulse"
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
      <ProgressBar isNavigating={isNavigating} />
      <RouteChangeHandler />

      {/* Header - directly imported */}
      <Header />

      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer - directly imported */}
      <Footer />
    </div>
  );
}
