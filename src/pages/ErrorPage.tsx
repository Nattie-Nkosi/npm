import { useRouteError, Link, isRouteErrorResponse } from "react-router-dom";
import { useEffect } from "react";
import { FiAlertCircle, FiArrowLeft, FiRefreshCw } from "react-icons/fi";

export default function ErrorPage() {
  const error = useRouteError();

  // Update title on error page
  useEffect(() => {
    document.title = "Error - NPM Registry";
  }, []);

  // Extract error details safely
  let errorMessage = "An unknown error occurred";
  let errorStatus = "";
  let isNotFound = false;
  let isNetworkError = false;
  let isRateLimited = false;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || errorMessage;
    errorStatus = String(error.status || "");

    // Check for specific error types
    isNotFound = error.status === 404;
    isRateLimited = error.status === 429;
  } else if (error instanceof Error) {
    errorMessage = error.message;

    // Check if it's a network error
    isNetworkError =
      errorMessage.toLowerCase().includes("network") ||
      errorMessage.toLowerCase().includes("fetch") ||
      errorMessage.toLowerCase().includes("failed to load");

    // Check if it mentions rate limiting
    isRateLimited =
      errorMessage.toLowerCase().includes("rate limit") ||
      errorMessage.toLowerCase().includes("too many requests") ||
      errorMessage.toLowerCase().includes("429");
  } else if (typeof error === "object" && error !== null) {
    // Try to extract message from unknown error object
    const anyError = error as any;
    if (anyError.statusText) errorMessage = anyError.statusText;
    if (anyError.message) errorMessage = anyError.message;
    if (anyError.status) {
      errorStatus = String(anyError.status);
      isNotFound = anyError.status === 404;
      isRateLimited = anyError.status === 429;
    }
  }

  // Get current path for the retry button
  const currentPath = window.location.pathname + window.location.search;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-4">
          <FiAlertCircle className="h-16 w-16 text-red-500" />
        </div>

        <h1 className="text-4xl font-bold text-red-600 mb-4">
          {isNotFound ? "Page Not Found" : "Oops!"}
        </h1>

        <p className="text-xl mt-4 mb-2">
          {isNotFound
            ? "The page you are looking for doesn't exist."
            : isRateLimited
            ? "Rate limit exceeded."
            : "Sorry, an unexpected error has occurred."}
        </p>

        {isNotFound ? (
          <div>
            <p className="text-gray-700 mb-4">
              The resource you requested could not be found.
            </p>
            <div className="mb-8">
              <span role="img" aria-label="not found" className="text-6xl">
                🔍
              </span>
            </div>
          </div>
        ) : isRateLimited ? (
          <div className="my-4">
            <p className="text-gray-600 mb-4">
              Too many requests were made in a short period of time. Please wait
              a moment and try again.
            </p>
            <div className="mb-4">
              <span role="img" aria-label="rate limited" className="text-5xl">
                ⏱️
              </span>
            </div>
          </div>
        ) : isNetworkError ? (
          <div className="my-4">
            <p className="text-gray-600 mb-4">
              There was a problem connecting to the server. Please check your
              internet connection and try again.
            </p>
            <div className="mb-4">
              <span role="img" aria-label="network error" className="text-5xl">
                🌐
              </span>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 my-4 italic">{errorMessage}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Link
            to="/"
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            <FiArrowLeft className="mr-2" /> Return to Home
          </Link>

          {!isNotFound && (
            <button
              onClick={() => (window.location.href = currentPath)}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <FiRefreshCw className="mr-2" /> Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
