import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";
import { searchLoader } from "./pages/search/searchLoader";
import detailsLoader from "./pages/details/detailsLoader";
import { homeLoader } from "./pages/home/homeLoader";
import ErrorPage from "./pages/ErrorPage";
import { LoadingProvider } from "./context/LoadingContext";
// Import the Root component directly
import Root from "./pages/Root";
import AppLoadingSkeleton from "./components/AppLoadingSkeleton";

// Simple route-level loading component
function RouteLoadingSkeleton() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 ml-4">Loading content...</p>
    </div>
  );
}

// Lazy load route components, but use direct import for Root
const HomePage = lazy(() => import("./pages/home/HomePage"));
const SearchPage = lazy(() => import("./pages/search/SearchPage"));
const DetailsPage = lazy(() => import("./pages/details/DetailsPage"));

// Create the router with better metadata and error handling
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
        errorElement: <ErrorPage />, // Add dedicated error boundary
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
        errorElement: <ErrorPage />, // Add dedicated error boundary
      },
    ],
  },
]);

function App() {
  const [appLoaded, setAppLoaded] = useState(false);

  // Fix for infinite loading: ensure app loads even if preload fails
  useEffect(() => {
    // Update the default page title
    document.title = "NPM Registry - Search and Explore Packages";

    // Set a hard maximum timeout to prevent infinite loading
    const maxLoadingTimer = setTimeout(() => {
      console.warn("Maximum loading time reached, forcing app to load");
      setAppLoaded(true);
    }, 5000); // 5 second maximum loading time

    // Simplified preloading with robust error handling
    const preloadResources = async () => {
      try {
        // Try to prefetch initial data
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        try {
          // Simple prefetch of a critical resource
          await fetch("https://registry.npmjs.org/react", {
            signal: controller.signal,
          });
        } catch (fetchError) {
          // Log but continue even if fetch fails
          console.warn("Failed to prefetch initial data:", fetchError);
        } finally {
          clearTimeout(timeoutId);
        }

        // Minimum loading time of 800ms to prevent flash
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Set app as loaded
        setAppLoaded(true);
      } catch (error) {
        console.error("Error during preload:", error);
        // Still set app as loaded even if something went wrong
        setAppLoaded(true);
      }
    };

    // Start preloading
    preloadResources();

    // Clean up timers
    return () => {
      clearTimeout(maxLoadingTimer);
    };
  }, []);

  // Show app loading skeleton while initial resources are loading
  if (!appLoaded) {
    return <AppLoadingSkeleton />;
  }

  return (
    <LoadingProvider initialLoading={false}>
      <RouterProvider router={router} />
    </LoadingProvider>
  );
}

export default App;
