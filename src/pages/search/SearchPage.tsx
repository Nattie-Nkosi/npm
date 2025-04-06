import {
  useLoaderData,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import PackageListItem from "../../components/PackageListItem";
import { SearchLoaderResult } from "./searchLoader";
import { Loader } from "../../components/Loader";
import { useLoading } from "../../context/LoadingContext";
import { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiArrowUp,
  FiArrowDown,
  FiList,
  FiGrid,
} from "react-icons/fi";
import { SearchResultSkeleton } from "../../components/PackageCardSkeleton";

// Sorting options
type SortOption = "relevance" | "name" | "popularity" | "newest";

export default function SearchPage() {
  const data = useLoaderData() as SearchLoaderResult;
  const [searchParams, setSearchParams] = useSearchParams();
  const term = searchParams.get("term") || "";
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  // UI state
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filterQuery, setFilterQuery] = useState("");
  const [searchInput, setSearchInput] = useState(term);
  const [isSearching, setIsSearching] = useState(false);

  // Reset loading state when component mounts or unmounts
  useEffect(() => {
    setIsLoading(false);
    return () => {
      setIsLoading(false);
    };
  }, [setIsLoading]);

  // Apply filter and sorting to results
  const processedResults = data?.searchResults
    ? [...data.searchResults]
        // Filter by local filter query if present
        .filter(
          (item) =>
            !filterQuery ||
            item.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
            (item.description &&
              item.description
                .toLowerCase()
                .includes(filterQuery.toLowerCase())) ||
            (item.keywords &&
              item.keywords.some((kw) =>
                kw.toLowerCase().includes(filterQuery.toLowerCase())
              ))
        )
        // Sort based on selected sort option
        .sort((a, b) => {
          switch (sortBy) {
            case "name":
              return sortDirection === "asc"
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
            case "popularity":
              // Mock popularity based on downloads
              const aDownloads = Math.floor(Math.random() * 10000);
              const bDownloads = Math.floor(Math.random() * 10000);
              return sortDirection === "asc"
                ? aDownloads - bDownloads
                : bDownloads - aDownloads;
            case "newest":
              // Mock dates for sorting
              const aDate = new Date(Date.now() - Math.random() * 10000000000);
              const bDate = new Date(Date.now() - Math.random() * 10000000000);
              return sortDirection === "asc"
                ? aDate.getTime() - bDate.getTime()
                : bDate.getTime() - aDate.getTime();
            default: // relevance
              return 0; // Keep original order from API for relevance
          }
        })
    : [];

  // Handle new search submission
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setIsSearching(true);
      // Update URL params and navigate
      setSearchParams({ term: searchInput });
      // Simulate loading for better UX
      setTimeout(() => {
        setIsSearching(false);
      }, 800);
    }
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Rendering loading state
  if (isSearching) {
    return (
      <div className="py-6">
        <PageTitle title={`Searching: ${searchInput} - NPM Registry`} />
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-4">
            Searching for "{searchInput}"
          </h1>
          <Loader size="medium" className="mx-auto" />
        </div>
        <div className="mt-8">
          <SearchResultSkeleton count={5} />
        </div>
      </div>
    );
  }

  // Rendering loading state for initial load
  if (!data || !data.searchResults) {
    return (
      <div className="flex flex-col justify-center items-center my-16">
        <Loader size="medium" />
        <p className="mt-4 text-gray-600">Loading search results...</p>
      </div>
    );
  }

  // Rendering empty state
  if (data.searchResults.length === 0) {
    return (
      <div className="max-w-3xl mx-auto my-12 text-center">
        <PageTitle title={`No Results: ${term} - NPM Registry`} />
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-100">
              <FiSearch size={48} className="text-gray-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">
            No results found for "{term}"
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn't find any packages matching your search criteria.
          </p>

          <div className="space-y-2 mb-8 max-w-md mx-auto">
            <p className="text-left text-sm text-gray-600 font-medium">Try:</p>
            <ul className="text-left text-sm text-gray-600 list-disc pl-6">
              <li>Using more general keywords</li>
              <li>Checking for typos or misspellings</li>
              <li>Searching for related technologies</li>
            </ul>
          </div>

          <form onSubmit={handleSearch} className="flex max-w-md mx-auto">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Try a new search..."
              className="border rounded-l px-4 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FiSearch />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t">
            <p className="text-gray-600 mb-3">Or browse popular packages:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["react", "typescript", "webpack", "vite", "tailwind"].map(
                (pkg) => (
                  <Link
                    key={pkg}
                    to={`/search?term=${pkg}`}
                    className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                  >
                    {pkg}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main view with search results
  return (
    <div className="py-6">
      <PageTitle title={`Search: ${term} - NPM Registry`} />

      {/* Search header with filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <h1 className="text-2xl font-bold">
            Results for "{term}"{" "}
            <span className="text-gray-500">({processedResults.length})</span>
          </h1>

          <form onSubmit={handleSearch} className="flex max-w-md">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Refine your search..."
              className="border rounded-l px-4 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FiSearch />
            </button>
          </form>
        </div>

        {/* Filters and controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* View toggles */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">View:</span>
            <div className="flex border rounded overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                aria-label="List view"
              >
                <FiList size={16} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                aria-label="Grid view"
              >
                <FiGrid size={16} />
              </button>
            </div>
          </div>

          {/* Sort options */}
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Relevance</option>
                <option value="name">Name</option>
                <option value="popularity">Popularity</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <button
              onClick={toggleSortDirection}
              className="p-2 border rounded hover:bg-gray-50"
              aria-label={
                sortDirection === "asc" ? "Sort ascending" : "Sort descending"
              }
            >
              {sortDirection === "asc" ? (
                <FiArrowUp size={16} />
              ) : (
                <FiArrowDown size={16} />
              )}
            </button>
          </div>

          {/* Filter input */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-sm text-gray-500">
              <FiFilter className="inline" /> Filter:
            </span>
            <input
              type="text"
              placeholder="Filter results..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
            />
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          Showing {processedResults.length}{" "}
          {processedResults.length === 1 ? "package" : "packages"}
          {filterQuery && ` filtered by "${filterQuery}"`}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <FiRefreshCw size={14} /> Refresh results
        </button>
      </div>

      {/* Results List */}
      {viewMode === "list" ? (
        <div className="space-y-4 mt-4">
          {processedResults.map((result) => (
            <PackageListItem pack={result} key={result.name} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {processedResults.map((result) => (
            <div
              key={result.name}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <Link
                to={`/packages/${result.name}`}
                className="text-xl font-bold text-blue-600 hover:underline"
              >
                {result.name}
              </Link>
              <p className="text-sm mt-2 text-gray-700 line-clamp-2">
                {result.description || "No description available"}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {(result.keywords || []).slice(0, 3).map((keyword) => (
                  <div
                    key={keyword}
                    className="border py-0.5 px-1 text-xs bg-gray-100 rounded"
                  >
                    {keyword}
                  </div>
                ))}
                {(result.keywords || []).length > 3 && (
                  <div className="border py-0.5 px-1 text-xs bg-gray-100 rounded">
                    +{result.keywords!.length - 3} more
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-gray-500">v{result.version}</span>
                <Link
                  to={`/packages/${result.name}`}
                  className="py-1 px-3 rounded bg-black text-white text-sm hover:bg-gray-800 transition-colors"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No filtered results */}
      {processedResults.length === 0 && filterQuery && (
        <div className="bg-gray-50 rounded-lg p-8 text-center my-8">
          <FiFilter size={32} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium">
            No matches for "{filterQuery}"
          </h3>
          <p className="text-gray-600 mt-2">
            Try adjusting your filter criteria
          </p>
          <button
            onClick={() => setFilterQuery("")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
}
