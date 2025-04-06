import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { HomeLoaderResult } from "./homeLoader";
import { useLoading } from "../../context/LoadingContext";
import { useEffect, useState } from "react";
import { Loader } from "../../components/Loader";
import PageTitle from "../../components/PageTitle";
import {
  FiSearch,
  FiPackage,
  FiDownload,
  FiStar,
  FiGithub,
  FiArrowRight,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

// Define the package interface
interface Package {
  license?: string;
  name: string;
  description?: string;
  maintainers?: any[];
  version?: string;
}

// Package card component
const PackageCard = ({ pack }: { pack: Package }) => {
  // Generate deterministic stats based on package name for consistency
  const getPackageScore = (name: string, max: number) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash) % max;
  };

  const downloads = 50000 + getPackageScore(pack.name, 950000);
  const stars = 100 + getPackageScore(pack.name, 9900);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="flex flex-col justify-between gap-3 border rounded-lg shadow-sm p-5 h-full hover:shadow-md hover:border-blue-200 bg-white transition-all duration-300">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-1 font-medium">
            {pack.license || "No license"}
          </span>
          <span className="text-xs text-gray-500">
            v{pack.version || "1.0.0"}
          </span>
        </div>

        <div className="font-bold text-lg text-center mt-2">
          <Link
            to={`/packages/${pack.name}`}
            className="text-gray-800 hover:text-blue-600 hover:underline transition-colors"
          >
            {pack.name}
          </Link>
        </div>

        <div className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
          {pack.description || "No description available"}
        </div>

        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <div className="flex items-center">
            <svg
              className="h-4 w-4 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {pack.maintainers?.length || 0}
          </div>
          <div className="flex items-center">
            <FiDownload className="mr-1" /> {formatNumber(downloads)}
          </div>
          <div className="flex items-center">
            <FiStar className="mr-1" /> {formatNumber(stars)}
          </div>
        </div>
      </div>

      <Link
        to={`/packages/${pack.name}`}
        className="rounded-md bg-black text-white py-2 px-4 text-center hover:bg-blue-600 transition-colors mt-4 flex items-center justify-center gap-2"
      >
        View Details <FiArrowRight size={14} />
      </Link>
    </div>
  );
};

export default function HomePage() {
  const data = useLoaderData() as HomeLoaderResult;
  const { setIsLoading } = useLoading();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLocalLoading] = useState(false);

  useEffect(() => {
    // Ensure loading state is cleared
    setIsLoading(false);
  }, [setIsLoading]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?term=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Retry loading if featured packages failed to load
  const handleRetry = () => {
    setIsLocalLoading(true);
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-16">
        <Loader size="medium" />
      </div>
    );
  }

  // Show error state if there was an error
  if (data?.error) {
    return (
      <div className="max-w-3xl mx-auto my-12">
        <PageTitle title="Error - NPM Registry" />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <FiAlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-red-700">
            Something went wrong
          </h1>
          <p className="text-red-600 mb-6">{data.error}</p>

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <FiRefreshCw className="inline mr-2" /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 space-y-12">
      <PageTitle title="NPM Registry - Search and Explore Packages" />

      {/* Hero Section with LIGHT BACKGROUND for better visibility */}
      <div className="bg-blue-100 py-16 px-4 rounded-lg shadow-lg mx-4 lg:mx-8">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-lg">
              <FiPackage className="h-12 w-12 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
            Find the perfect packages for your project
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search the NPM Registry to discover JavaScript packages used by
            millions of developers worldwide.
          </p>

          {/* Search Form - Clearly visible on light background */}
          <div className="mt-8 mx-auto max-w-2xl">
            <form onSubmit={handleSearch} className="flex shadow-md">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for packages..."
                  className="block w-full py-3 pl-10 pr-3 border border-gray-300 rounded-l-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  aria-label="Search for packages"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-lg font-medium text-lg transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Popular searches */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <span className="text-gray-600 text-sm mr-2 self-center">
              Popular:
            </span>
            {[
              "react",
              "typescript",
              "vue",
              "webpack",
              "express",
              "tailwind",
            ].map((term) => (
              <button
                key={term}
                onClick={() =>
                  navigate(`/search?term=${encodeURIComponent(term)}`)
                }
                className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-full text-sm text-gray-700 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white shadow-sm rounded-lg mx-4 lg:mx-8 grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
        <div className="flex flex-col items-center justify-center p-4">
          <div className="flex items-center text-blue-600 mb-2">
            <FiPackage size={24} />
          </div>
          <div className="text-2xl font-bold">2M+</div>
          <div className="text-sm text-gray-500">Packages</div>
        </div>

        <div className="flex flex-col items-center justify-center p-4">
          <div className="flex items-center text-green-600 mb-2">
            <FiDownload size={24} />
          </div>
          <div className="text-2xl font-bold">30B+</div>
          <div className="text-sm text-gray-500">Downloads/Week</div>
        </div>

        <div className="flex flex-col items-center justify-center p-4">
          <div className="flex items-center text-purple-600 mb-2">
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div className="text-2xl font-bold">15M+</div>
          <div className="text-sm text-gray-500">Developers</div>
        </div>

        <div className="flex flex-col items-center justify-center p-4">
          <div className="flex items-center text-orange-600 mb-2">
            <FiGithub size={24} />
          </div>
          <div className="text-2xl font-bold">900K+</div>
          <div className="text-sm text-gray-500">Contributors</div>
        </div>
      </div>

      {/* Featured Packages */}
      <div className="px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <FiStar className="mr-2 text-yellow-500" /> Featured Packages
            </h2>
            <Link
              to="/search?term=popular"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
            >
              View all <FiArrowRight size={14} />
            </Link>
          </div>

          {data?.featuredPackages?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.featuredPackages.map((p) => (
                <PackageCard key={p.name} pack={p} />
              ))}
            </div>
          ) : (
            // Display message when no featured packages are available
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <FiPackage size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium mb-2">
                No featured packages available
              </h3>
              <p className="text-gray-600 mb-6">
                Try searching for specific packages using the search bar above.
              </p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FiRefreshCw className="inline mr-2" /> Reload Packages
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Community section */}
      <div className="px-4 lg:px-8 max-w-6xl mx-auto">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Join the JavaScript Community
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Discover packages, contribute to open source, and connect with
            developers from around the world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/Nattie-Nkosi/npm"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-md flex items-center gap-2 transition-colors"
            >
              <FiGithub /> View on GitHub
            </a>
            <a
              href="https://www.npmjs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-md flex items-center gap-2 transition-colors"
            >
              <FiPackage /> Visit Official NPM
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
