import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";
import { searchLoader } from "./pages/search/searchLoader";
import detailsLoader from "./pages/details/detailsLoader";
import { homeLoader } from "./pages/home/homeLoader";
import ErrorPage from "./pages/ErrorPage";
import { LoadingProvider } from "./context/LoadingContext";
// Import the Root and other components directly to fix the initial load
import Root from "./pages/Root";

// Simple route-level loading component
function RouteLoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-lg flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading content...</p>
      </div>
    </div>
  );
}

// Lazy load route components, but use direct import for Root
const HomePage = lazy(() => import("./pages/home/HomePage"));
const SearchPage = lazy(() => import("./pages/search/SearchPage"));
const DetailsPage = lazy(() => import("./pages/details/DetailsPage"));

// Create the router with better metadata
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, // Use directly imported Root
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<RouteLoadingSkeleton />}>
            <HomePage />
          </Suspense>
        ),
        loader: homeLoader,
        handle: {
          title: "NPM Registry - Search and Explore Packages",
        },
      },
      {
        path: "/search",
        element: (
          <Suspense fallback={<RouteLoadingSkeleton />}>
            <SearchPage />
          </Suspense>
        ),
        loader: searchLoader,
        handle: {
          title: "Search Results - NPM Registry",
        },
      },
      {
        path: "/packages/:name",
        element: (
          <Suspense fallback={<RouteLoadingSkeleton />}>
            <DetailsPage />
          </Suspense>
        ),
        loader: detailsLoader,
        handle: {
          title: "Package Details - NPM Registry",
        },
      },
    ],
  },
]);

function App() {
  // Simpler loading state management with a timeout fallback
  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
    // Ensure we exit the loading state within a reasonable time
    // This prevents infinite loading
    const timeoutId = setTimeout(() => {
      setAppLoaded(true);
    }, 2000); // Maximum 2 seconds loading time

    // Normal loading logic
    const loadApp = async () => {
      try {
        // Still try to preload critical resources
        const promises = [
          // Prefetch featured packages for the homepage
          fetch("https://registry.npmjs.org/react").catch(() => null),
          fetch("https://registry.npmjs.org/typescript").catch(() => null),
        ];

        // Wait for critical resources but with a timeout
        await Promise.race([
          Promise.all(promises),
          new Promise((resolve) => setTimeout(resolve, 1500)),
        ]);

        setAppLoaded(true);
      } catch (error) {
        console.error("Error during app initialization:", error);
        setAppLoaded(true); // Ensure we still exit loading state on error
      }
    };

    loadApp();

    // Cleanup the timeout to prevent memory leaks
    return () => clearTimeout(timeoutId);
  }, []);

  // Update the default page title
  useEffect(() => {
    document.title = "NPM Registry - Search and Explore Packages";
  }, []);

  // Simple loading state with a fallback timeout
  if (!appLoaded) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading application...</p>
      </div>
    );
  }

  return (
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>
  );
}

export default App;
