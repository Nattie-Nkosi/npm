import { useLoaderData, useSearchParams } from "react-router-dom";
import PackageListItem from "../../components/PackageListItem";
import { SearchLoaderResult } from "./searchLoader";
import { Loader } from "../../components/Loader";
import { useLoading } from "../../context/LoadingContext";
import { useEffect } from "react";
import PageTitle from "../../components/PageTitle";

export default function SearchPage() {
  const data = useLoaderData() as SearchLoaderResult;
  const [searchParams] = useSearchParams();
  const term = searchParams.get("term") || "";
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(false);

    return () => {
      setIsLoading(false);
    };
  }, [setIsLoading]);

  if (!data || !data.searchResults) {
    return (
      <div className="flex justify-center items-center my-16">
        <Loader size="medium" />
      </div>
    );
  }

  if (data.searchResults.length === 0) {
    return (
      <div className="my-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Search Results for "{term}"</h1>
        <p className="text-gray-600">
          No packages found matching your search criteria.
        </p>
        <p className="mt-2">Try searching with different keywords.</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <PageTitle title={`Search: ${term} - NPM Registry`} />
      <h1 className="text-2xl font-bold mb-6">
        Search Results for "{term}" ({data.searchResults.length})
      </h1>
      <div className="space-y-4 mt-4">
        {data.searchResults.map((result) => (
          <PackageListItem pack={result} key={result.name} />
        ))}
      </div>
    </div>
  );
}
