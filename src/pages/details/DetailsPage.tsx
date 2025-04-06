import { useLoaderData, useParams } from "react-router-dom";
import { DetailsLoaderResult } from "./detailsLoader";
import { Loader } from "../../components/Loader";
import { useLoading } from "../../context/LoadingContext";
import { useEffect } from "react";
import ReadmeRenderer from "../../components/ReadmeRenderer";
import PageTitle from "../../components/PageTitle";

export default function DetailsPage() {
  const { details } = useLoaderData() as DetailsLoaderResult;
  const { isLoading, setIsLoading } = useLoading();
  const { name } = useParams();

  useEffect(() => {
    setIsLoading(false);

    return () => {
      setIsLoading(false);
    };
  }, [setIsLoading]);

  if (!details) {
    return (
      <div className="flex justify-center items-center my-16">
        <Loader size="medium" />
      </div>
    );
  }

  return (
    <div className="space-y-4 py-6">
      <PageTitle title={`${details.name} - NPM Registry`} />
      <h1 className="text-3xl font-bold my-4">{details.name}</h1>
      <div>
        <h3 className="text-lg font-bold">Description</h3>
        <div className="p-3 bg-gray-100 rounded">
          {details.description || "No description available"}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold">License</h3>
        <div className="p-3 bg-gray-100 rounded">
          {details.license || "No license information"}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold">Author</h3>
        <div className="p-3 bg-gray-100 rounded">
          {details.author?.name || "Unknown author"}
        </div>
      </div>

      {details.maintainers && details.maintainers.length > 0 && (
        <div>
          <h3 className="text-lg font-bold">Maintainers</h3>
          <div className="p-3 bg-gray-100 rounded">
            <ul className="list-disc pl-5">
              {details.maintainers.map((maintainer, index) => (
                <li key={index}>
                  {maintainer.name}{" "}
                  {maintainer.email && `(${maintainer.email})`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {details.readme && (
        <div>
          <h3 className="text-lg font-bold">README</h3>
          <div className="p-3 bg-gray-100 rounded prose max-w-none">
            <ReadmeRenderer content={details.readme} />
          </div>
        </div>
      )}
    </div>
  );
}
