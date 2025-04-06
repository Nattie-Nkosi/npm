import { Link, useLoaderData } from "react-router-dom";
import { HomeLoaderResult } from "./homeLoader";
import { useLoading } from "../../context/LoadingContext";
import { useEffect } from "react";
import { Loader } from "../../components/Loader";
import PageTitle from "../../components/PageTitle";

export default function HomePage() {
  const data = useLoaderData() as HomeLoaderResult;
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(false);

    return () => {
      setIsLoading(false);
    };
  }, [setIsLoading]);

  if (!data || !data.featuredPackages) {
    return (
      <div className="flex justify-center items-center my-16">
        <Loader size="medium" />
      </div>
    );
  }

  const renderedPackages = data.featuredPackages.map((p) => {
    return (
      <div
        key={p.name}
        className="flex flex-col justify-between gap-3 border rounded shadow p-4 h-full"
      >
        <div className="flex flex-col gap-1 mb-2">
          <div className="font-bold text-center text-lg">{p.name}</div>
          <div className="text-sm text-gray-500">{p.description}</div>
          <div className="text-sm text-gray-500 mt-1">
            {p.maintainers?.length || 0} Maintainers
          </div>
        </div>
        <Link
          to={`/packages/${p.name}`}
          className="rounded bg-black text-white py-2 px-4 text-center hover:bg-gray-800 transition-colors"
        >
          View Details
        </Link>
      </div>
    );
  });

  return (
    <div className="container py-8 md:py-12 space-y-8">
      <PageTitle title="NPM Registry - Search and Explore Packages" />
      <div className="space-y-4 md:space-y-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold">The NPM Registry</h1>
        <p className="mx-auto max-w-[600px] text-gray-500 px-4">
          The package manager for Javascript. Search and view packages.
        </p>
      </div>
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-[900px] items-stretch gap-4 px-4">
        {renderedPackages}
      </div>
    </div>
  );
}
