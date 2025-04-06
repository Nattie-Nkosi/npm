import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/Root";
import HomePage from "./pages/home/HomePage";
import SearchPage from "./pages/search/SearchPage";
import DetailsPage from "./pages/details/DetailsPage";
import { searchLoader } from "./pages/search/searchLoader";
import detailsLoader from "./pages/details/detailsLoader";
import { homeLoader } from "./pages/home/homeLoader";
import ErrorPage from "./pages/ErrorPage";
import { LoadingProvider } from "./context/LoadingContext";
import { useEffect } from "react";

// Create the router with better metadata
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: homeLoader,
        handle: {
          title: "NPM Registry - Search and Explore Packages",
        },
      },
      {
        path: "/search",
        element: <SearchPage />,
        loader: searchLoader,
        handle: {
          title: "Search Results - NPM Registry",
        },
      },
      {
        path: "/packages/:name",
        element: <DetailsPage />,
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
  useEffect(() => {
    document.title = "NPM Registry - Search and Explore Packages";
  }, []);

  return (
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>
  );
}

export default App;
