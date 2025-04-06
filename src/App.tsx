import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { searchLoader } from "./pages/search/searchLoader";
import detailsLoader from "./pages/details/detailsLoader";
import { homeLoader } from "./pages/home/homeLoader";
import ErrorPage from "./pages/ErrorPage";
import { LoadingProvider } from "./context/LoadingContext";
// Import the Root component directly
import Root from "./pages/Root";

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
  // Update the default page title
  document.title = "NPM Registry - Search and Explore Packages";

  return (
    <LoadingProvider initialLoading={false}>
      <RouterProvider router={router} />
    </LoadingProvider>
  );
}

export default App;
