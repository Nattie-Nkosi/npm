import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { HomeLoaderResult } from "./homeLoader";
import { useState } from "react";
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
    <div className="group relative flex flex-col justify-between gap-4 border border-zinc-200 rounded-2xl shadow-sm p-6 h-full hover:shadow-xl hover:border-zinc-300 bg-white transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-bl-full opacity-50 -z-10"></div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs bg-zinc-100 text-zinc-700 rounded-full px-3 py-1.5 font-medium border border-zinc-200">
            {pack.license || "No license"}
          </span>
          <span className="text-xs text-zinc-500 font-medium">
            v{pack.version || "1.0.0"}
          </span>
        </div>

        <div className="font-bold text-xl text-center mt-2">
          <Link
            to={`/packages/${pack.name}`}
            className="text-zinc-900 hover:text-zinc-600 transition-all duration-200"
          >
            {pack.name}
          </Link>
        </div>

        <div className="text-sm text-zinc-600 line-clamp-2 min-h-[40px] text-center">
          {pack.description || "No description available"}
        </div>

        <div className="flex justify-between items-center mt-3 text-xs text-zinc-600 bg-zinc-50 rounded-lg p-3">
          <div className="flex items-center gap-1">
            <svg
              className="h-4 w-4"
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
            <span className="font-medium">{pack.maintainers?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiDownload className="text-zinc-700" />
            <span className="font-medium">{formatNumber(downloads)}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiStar className="text-zinc-700" />
            <span className="font-medium">{formatNumber(stars)}</span>
          </div>
        </div>
      </div>

      <Link
        to={`/packages/${pack.name}`}
        className="rounded-xl bg-zinc-900 text-white py-3 px-4 text-center hover:bg-zinc-800 transition-all duration-200 mt-4 flex items-center justify-center gap-2 font-medium shadow-lg group-hover:shadow-xl"
      >
        View Details <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default function HomePage() {
  const data = useLoaderData() as HomeLoaderResult;
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?term=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Retry loading if featured packages failed to load
  const handleRetry = () => {
    window.location.reload();
  };

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

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-zinc-50 py-20 px-4 rounded-3xl shadow-xl mx-4 lg:mx-8 border border-zinc-200">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-100 rounded-full filter blur-3xl opacity-50 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-zinc-100 rounded-full filter blur-3xl opacity-50 -z-10"></div>

        <div className="max-w-4xl mx-auto space-y-8 text-center relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-zinc-900 rounded-2xl filter blur-xl opacity-30"></div>
              <div className="relative bg-zinc-900 p-4 rounded-2xl shadow-lg">
                <FiPackage className="h-14 w-14 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-900 leading-tight">
            Find the perfect packages for your project
          </h1>

          <p className="text-xl text-zinc-600 max-w-2xl mx-auto font-medium">
            Search the NPM Registry to discover JavaScript packages used by
            millions of developers worldwide.
          </p>

          {/* Search Form - Modern design */}
          <div className="mt-10 mx-auto max-w-2xl">
            <form onSubmit={handleSearch} className="flex gap-2 shadow-2xl rounded-2xl overflow-hidden">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="h-6 w-6 text-zinc-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for packages..."
                  className="block w-full py-4 pl-14 pr-4 border-2 border-zinc-200 rounded-l-2xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900 text-lg bg-white"
                  aria-label="Search for packages"
                />
              </div>
              <button
                type="submit"
                className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-4 rounded-r-2xl font-semibold text-lg transition-all duration-200 shadow-lg"
              >
                Search
              </button>
            </form>
          </div>

          {/* Popular searches */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            <span className="text-zinc-600 text-sm font-medium mr-2 self-center">
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
                className="px-4 py-2 bg-white hover:bg-zinc-50 border-2 border-zinc-200 hover:border-zinc-300 rounded-full text-sm text-zinc-700 hover:text-zinc-900 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white shadow-lg rounded-2xl mx-4 lg:mx-8 grid grid-cols-2 md:grid-cols-4 gap-6 p-8 border border-zinc-100">
        <div className="flex flex-col items-center justify-center p-4 group hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-center w-14 h-14 bg-zinc-100 rounded-xl mb-3 group-hover:bg-zinc-200 transition-all">
            <FiPackage size={28} className="text-zinc-700" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-900">2M+</div>
          <div className="text-sm text-zinc-600 font-medium">Packages</div>
        </div>

        <div className="flex flex-col items-center justify-center p-4 group hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-center w-14 h-14 bg-zinc-100 rounded-xl mb-3 group-hover:bg-zinc-200 transition-all">
            <FiDownload size={28} className="text-zinc-700" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-900">30B+</div>
          <div className="text-sm text-zinc-600 font-medium">Downloads/Week</div>
        </div>

        <div className="flex flex-col items-center justify-center p-4 group hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-center w-14 h-14 bg-zinc-100 rounded-xl mb-3 group-hover:bg-zinc-200 transition-all">
            <svg
              className="h-7 w-7 text-zinc-700"
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
          <div className="text-3xl font-extrabold text-zinc-900">15M+</div>
          <div className="text-sm text-zinc-600 font-medium">Developers</div>
        </div>

        <div className="flex flex-col items-center justify-center p-4 group hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-center w-14 h-14 bg-zinc-100 rounded-xl mb-3 group-hover:bg-zinc-200 transition-all">
            <FiGithub size={28} className="text-zinc-700" />
          </div>
          <div className="text-3xl font-extrabold text-zinc-900">900K+</div>
          <div className="text-sm text-zinc-600 font-medium">Contributors</div>
        </div>
      </div>

      {/* Featured Packages */}
      <div className="px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold flex items-center text-zinc-900">
              <FiStar className="mr-3 text-zinc-700" size={32} /> Featured Packages
            </h2>
            <Link
              to="/search?term=popular"
              className="group flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all duration-200 font-semibold shadow-lg"
            >
              View all <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
        <div className="relative overflow-hidden bg-zinc-900 rounded-3xl p-12 text-center shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800 rounded-full filter blur-3xl opacity-50 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-800 rounded-full filter blur-3xl opacity-50 -z-10"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
              Join the JavaScript Community
            </h2>
            <p className="text-zinc-300 text-lg max-w-2xl mx-auto mb-8 font-medium">
              Discover packages, contribute to open source, and connect with
              developers from around the world.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/Nattie-Nkosi/npm"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-zinc-100 text-zinc-900 px-8 py-4 rounded-xl flex items-center gap-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                <FiGithub size={20} /> View on GitHub
              </a>
              <a
                href="https://www.npmjs.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-700 text-white px-8 py-4 rounded-xl flex items-center gap-2 transition-all duration-200 font-semibold hover:scale-105"
              >
                <FiPackage size={20} /> Visit Official NPM
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
