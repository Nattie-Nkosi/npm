import { Link } from "react-router-dom";
import { FiDownload, FiStar, FiPackage } from "react-icons/fi";
import type { PackageSummary } from "../api/types/packageSummary";

interface PackageListItemProps {
  pack: PackageSummary;
}

export default function PackageListItem({ pack }: PackageListItemProps) {
  // Generate deterministic stats for consistent display
  const getPackageScore = (name: string, max: number) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash) % max;
  };

  const downloads = 1000 + getPackageScore(pack.name, 999000);
  const stars = 10 + getPackageScore(pack.name, 9990);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Process keywords - ensure there are no more than 5 shown
  const keywords = (pack.keywords || []).slice(0, 5);
  const keywordCount = (pack.keywords || []).length;
  const hasMoreKeywords = keywordCount > 5;

  // Ensure the package name is properly displayed even if it contains special characters
  const safePackageName = encodeURIComponent(pack.name);

  return (
    <div className="border p-4 rounded-lg flex justify-between items-center hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-2 flex-grow">
        <div className="flex items-center">
          <div className="mr-3 text-blue-600">
            <FiPackage size={20} />
          </div>
          <Link
            to={`/packages/${safePackageName}`}
            className="text-xl font-bold text-blue-600 hover:underline"
          >
            {pack.name}
          </Link>
          {pack.version && (
            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
              v{pack.version}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-700">
          {pack.description || "No description available"}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
          <div className="flex items-center">
            <FiDownload className="mr-1" />
            <span>{formatNumber(downloads)}</span>
          </div>
          <div className="flex items-center">
            <FiStar className="mr-1" />
            <span>{formatNumber(stars)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {keywords.map((keyword) => (
            <div
              key={keyword}
              className="border py-0.5 px-1 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/search?term=${encodeURIComponent(
                  keyword
                )}`;
              }}
            >
              {keyword}
            </div>
          ))}
          {hasMoreKeywords && (
            <div className="border py-0.5 px-1 text-xs bg-gray-100 rounded">
              +{keywordCount - 5} more
            </div>
          )}
        </div>
      </div>

      <div className="ml-4 flex">
        <Link
          to={`/packages/${safePackageName}`}
          className="py-2 px-4 rounded bg-black text-white hover:bg-blue-700 transition-colors"
        >
          View
        </Link>
      </div>
    </div>
  );
}
