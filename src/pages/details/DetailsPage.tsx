import { useLoaderData } from "react-router-dom";
import { DetailsLoaderResult } from "./detailsLoader";
import { useState, useEffect } from "react";

export default function DetailsPage() {
  const data = useLoaderData() as DetailsLoaderResult;
  const [details, setDetails] = useState<DetailsLoaderResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setDetails(data);
      setLoading(false);
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold my-4">{details?.details.name}</h1>
      <div>
        <h3 className="text-lg font-bold">Description</h3>
        <div className="p-3 bg-gray-200 rounded">
          {details?.details.description}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold">License</h3>
        <div className="p-3 bg-gray-200 rounded">
          {details?.details.license}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold">Author</h3>
        <div className="p-3 bg-gray-200 rounded">
          {details?.details.author?.name}
        </div>
      </div>
    </div>
  );
}
