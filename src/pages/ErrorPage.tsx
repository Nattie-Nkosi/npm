import { useRouteError } from "react-router-dom";
import { RouteError } from "../api/types/error";

export default function ErrorPage() {
  const error = useRouteError() as RouteError;

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Oops!</h1>
        <p className="text-xl mt-4">Sorry, an unexpected error has occurred.</p>
        <p className="text-gray-500 mt-2">
          <i>{error.statusText || error.message}</i>
        </p>
        {error.status === 404 && (
          <p className="text-gray-500 mt-2">
            The page you are looking for was not found.
          </p>
        )}
      </div>
    </div>
  );
}
