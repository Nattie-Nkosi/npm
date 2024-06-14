import { useLoaderData } from "react-router-dom";
import PackageListItem from "../../components/PackageListItem";
import { SearchLoaderResult } from "./searchLoader";
import { useState, useEffect } from "react";

export default function SearchPage() {
  const data = useLoaderData() as SearchLoaderResult;
  const [searchResults, setSearchResults] = useState<SearchLoaderResult | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setSearchResults(data);
      setLoading(false);
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderedResults = searchResults?.searchResults.map((result) => (
    <PackageListItem pack={result} key={result.name} />
  ));

  return (
    <div>
      <h1 className="text-2xl font-bold my-6">Search Results</h1>
      <div className="space-y-4 mt-4">{renderedResults}</div>
    </div>
  );
}
