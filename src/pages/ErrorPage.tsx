import { useRouteError, Link, isRouteErrorResponse } from "react-router-dom";
import { useEffect } from "react";

export default function ErrorPage() {
  const error = useRouteError();

  // Update title on error page
  useEffect(() => {
    document.title = "Error - NPM Registry";
  }, []);

  // Extract error details safely
  let errorMessage = "An unknown error occurred";
  let errorStatus = "";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || errorMessage;
    errorStatus = String(error.status || "");
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "object" && error !== null) {
    // Try to extract message from unknown error object
    const anyError = error as any;
    if (anyError.statusText) errorMessage = anyError.statusText;
    if (anyError.message) errorMessage = anyError.message;
    if (anyError.status) errorStatus = String(anyError.status);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-xl mt-4 mb-2">
          Sorry, an unexpected error has occurred.
        </p>

        {errorStatus === "404" ? (
          <div>
            <p className="text-gray-700 mb-4">
              The page you are looking for could not be found.
            </p>
            <div className="mb-8">
              <span role="img" aria-label="not found" className="text-6xl">
                🔍
              </span>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 my-4 italic">{errorMessage}</p>
        )}

        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
