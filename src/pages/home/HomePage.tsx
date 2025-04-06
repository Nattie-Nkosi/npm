import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { HomeLoaderResult } from "./homeLoader";
import { useLoading } from "../../context/LoadingContext";
import { useEffect, useState } from "react";
import { Loader } from "../../components/Loader";
import PageTitle from "../../components/PageTitle";
//import { FiSearch, FiPackage, FiDownload, FiStar, FiGithub } from "react-icons/fi";

// Define the package interface
interface Package {
  license?: string;
  name: string;
  description?: string;
  maintainers?: any[];
}

// Simplified package card for stability
const PackageCard = ({ pack }: { pack: Package }) => {
  return (
    <div className="flex flex-col justify-between gap-3 border rounded-lg shadow-sm p-5 h-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600">
            {pack.license || "No license"}
          </span>
        </div>

        <div className="font-bold text-lg text-center mt-2">{pack.name}</div>

        <div className="text-sm text-gray-600">
          {pack.description || "No description available"}
        </div>

        <div className="text-xs text-gray-500 mt-2">
          {pack.maintainers?.length || 0} Maintainers
        </div>
      </div>

      <Link
        to={`/packages/${pack.name}`}
        className="rounded-md bg-black text-white py-2 px-4 text-center hover:bg-gray-800 transition-colors mt-4"
      >
        View Details
      </Link>
    </div>
  );
};

export default function HomePage() {
  const data = useLoaderData() as HomeLoaderResult;
  const { setIsLoading } = useLoading();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure loading state is cleared
    setIsLoading(false);
  }, [setIsLoading]);

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?term=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Show simple loader if data isn't available
  if (!data || !data.featuredPackages) {
    return (
      <div className="flex justify-center items-center my-16">
        <Loader size="medium" />
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12 space-y-8">
      <PageTitle title="NPM Registry - Search and Explore Packages" />

      {/* Hero Section - Simplified */}
      <div className="space-y-4 md:space-y-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold">The NPM Registry</h1>
        <p className="mx-auto max-w-[600px] text-gray-500 px-4">
          The package manager for Javascript. Search and view packages.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex max-w-lg mx-auto mt-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for packages..."
            className="py-2 px-4 flex-grow border rounded-l"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-r"
          >
            Search
          </button>
        </form>
      </div>

      {/* Packages Grid - Simplified */}
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-[900px] items-stretch gap-4 px-4">
        {data.featuredPackages.map((p) => (
          <PackageCard key={p.name} pack={p} />
        ))}
      </div>
    </div>
  );
}
