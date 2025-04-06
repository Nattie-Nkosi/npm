import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";
import { searchLoader } from "../pages/search/searchLoader";
import detailsLoader from "../pages/details/detailsLoader";
import { homeLoader } from "../pages/home/homeLoader";
import ErrorPage from "../pages/ErrorPage";
import { LoadingProvider } from "../context/LoadingContext";
import AppLoadingSkeleton from "../components/AppLoadingSkeleton";

// Lazy load components for code splitting
const Root = lazy(() => import("../pages/Root"));
const HomePage = lazy(() => import("../pages/home/HomePage"));
const SearchPage = lazy(() => import("../pages/search/SearchPage"));
const DetailsPage = lazy(() => import("../pages/details/DetailsPage"));

// Create the router with better metadata
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<RouteLoadingSkeleton />}>
        <Root />
      </Suspense>
    ),
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

// Simple route-level loading skeleton
function RouteLoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-lg flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 animate-pulse">Loading content...</p>
      </div>
    </div>
  );
}

function App() {
  const [appLoaded, setAppLoaded] = useState(false);

  // Simulate initial app loading and resource prefetching
  useEffect(() => {
    // Preload critical resources
    const preloadResources = async () => {
      try {
        // Prefetch critical API data
        const promises = [
          // Prefetch featured packages for the homepage
          fetch("https://registry.npmjs.org/react"),
          fetch("https://registry.npmjs.org/typescript"),
          // Prefetch common assets, fonts, etc. if needed
        ];

        // Wait for critical resources or timeout after 2 seconds
        await Promise.race([
          Promise.all(promises),
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ]);
      } catch (error) {
        console.error("Error preloading resources:", error);
      } finally {
        // Minimum loading time of 1 second to prevent flash
        setTimeout(() => setAppLoaded(true), 1000);
      }
    };

    preloadResources();
  }, []);

  // Update the default page title
  useEffect(() => {
    document.title = "NPM Registry - Search and Explore Packages";
  }, []);

  // Show app loading skeleton while initial resources are loading
  if (!appLoaded) {
    return <AppLoadingSkeleton />;
  }

  return (
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>
  );
}

export default App;
