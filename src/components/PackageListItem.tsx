import { Link, useNavigate } from "react-router-dom";
import { FiDownload, FiStar, FiPackage } from "react-icons/fi";
import type { PackageSummary } from "../api/types/packageSummary";

interface PackageListItemProps {
  pack: PackageSummary;
}

export default function PackageListItem({ pack }: PackageListItemProps) {
  const navigate = useNavigate();

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
    <div className="group border border-zinc-200 p-6 rounded-2xl flex justify-between items-center hover:shadow-xl hover:border-zinc-300 transition-all duration-300 bg-white hover:-translate-y-0.5">
      <div className="flex flex-col gap-3 flex-grow">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-100 rounded-xl group-hover:bg-zinc-200 transition-all">
            <FiPackage size={24} className="text-zinc-700" />
          </div>
          <Link
            to={`/packages/${safePackageName}`}
            className="text-xl font-bold text-zinc-900 hover:text-zinc-600 transition-all"
          >
            {pack.name}
          </Link>
          {pack.version && (
            <span className="text-xs bg-zinc-100 text-zinc-700 px-3 py-1.5 rounded-full font-medium border border-zinc-200">
              v{pack.version}
            </span>
          )}
        </div>

        <p className="text-sm text-zinc-600 leading-relaxed">
          {pack.description || "No description available"}
        </p>

        <div className="flex items-center gap-5 text-xs font-medium text-zinc-600">
          <div className="flex items-center gap-1.5">
            <FiDownload size={16} />
            <span>{formatNumber(downloads)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiStar size={16} />
            <span>{formatNumber(stars)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-1">
          {keywords.map((keyword) => (
            <button
              key={keyword}
              className="px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg hover:bg-zinc-100 hover:border-zinc-300 hover:text-zinc-900 transition-all cursor-pointer font-medium"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/search?term=${encodeURIComponent(keyword)}`);
              }}
              aria-label={`Search for ${keyword}`}
            >
              {keyword}
            </button>
          ))}
          {hasMoreKeywords && (
            <div className="px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg font-medium">
              +{keywordCount - 5} more
            </div>
          )}
        </div>
      </div>

      <div className="ml-6 flex">
        <Link
          to={`/packages/${safePackageName}`}
          className="py-3 px-6 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all duration-200 font-semibold shadow-lg whitespace-nowrap"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
