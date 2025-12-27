import { useLoaderData, useParams, useNavigate } from "react-router-dom";
import { DetailsLoaderResult } from "./detailsLoader";
import { useState } from "react";
import ReadmeRenderer from "../../components/ReadmeRenderer";
import PageTitle from "../../components/PageTitle";
import {
  FiArrowLeft,
  FiPackage,
  FiFileText,
  FiUser,
  FiUsers,
  FiBook,
  FiClipboard,
  FiExternalLink,
  FiDownload,
  FiStar,
  FiGitBranch,
  FiClock,
  FiLock,
  FiCheck,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

export default function DetailsPage() {
  const loaderData = useLoaderData() as DetailsLoaderResult;
  const { name } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [readmeExpanded, setReadmeExpanded] = useState(true);

  // Get details from loader data, handle case where it might be undefined
  const details = loaderData?.details;
  const error = loaderData?.error;

  // Generate deterministic stats for packages
  const getPackageScore = (packageName: string, min: number, max: number) => {
    let hash = 0;
    for (let i = 0; i < packageName.length; i++) {
      hash = (hash << 5) - hash + packageName.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return min + (Math.abs(hash) % (max - min));
  };

  // Generate mock data for visual enhancement (since API doesn't provide these)
  const mockStats = details
    ? {
        downloads: getPackageScore(details.name, 500000, 10000000),
        stars: getPackageScore(details.name, 1000, 50000),
        version: details.version || "1.0.0",
        lastUpdated: new Date(
          Date.now() -
            getPackageScore(details.name, 1, 30) * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],
      }
    : null;

  const handleCopyToClipboard = () => {
    if (!details) return;

    const installCommand = `npm install ${details.name}`;
    navigator.clipboard.writeText(installCommand).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const toggleReadme = () => {
    setReadmeExpanded(!readmeExpanded);
  };

  // Handle error state
  if (error || !details) {
    return (
      <div className="max-w-3xl mx-auto my-12">
        <PageTitle title={`Error - NPM Registry`} />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <FiAlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-red-700">
            Error Loading Package Details
          </h1>
          <p className="text-red-600 mb-6">
            {error || `Could not load details for package "${name}".`}
          </p>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <FiRefreshCw className="inline mr-2" /> Try Again
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              <FiArrowLeft className="inline mr-2" /> Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <PageTitle title={`${details.name} - NPM Registry`} />

      {/* Navigation */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
        >
          <FiArrowLeft /> Back to results
        </button>
      </div>

      {/* Package Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-700 p-3 rounded-lg mr-4">
              <FiPackage size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{details.name}</h1>
              <p className="text-gray-500 mt-1">v{mockStats?.version}</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm" title="Note: Estimated metrics">
              <FiDownload className="mr-1 text-blue-600" />
              <span>{formatNumber(mockStats?.downloads || 0)}+ est. downloads</span>
            </div>
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm" title="Note: Estimated metrics">
              <FiStar className="mr-1 text-yellow-500" />
              <span>{formatNumber(mockStats?.stars || 0)}+ est. stars</span>
            </div>
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm" title="Note: Estimated date">
              <FiClock className="mr-1 text-green-600" />
              <span>Est. updated {mockStats?.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Info banner about estimated stats */}
        <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-3 text-sm text-blue-800">
          <p className="flex items-center gap-2">
            <FiAlertCircle size={16} />
            <span>Stats shown are estimated values for demonstration purposes. Visit NPM for accurate data.</span>
          </p>
        </div>

        {/* Installation Command */}
        <div className="mt-6 mb-4">
          <div className="flex items-center justify-between bg-gray-800 text-white p-3 rounded-md">
            <code className="font-mono">npm install {details.name}</code>
            <button
              onClick={handleCopyToClipboard}
              className="bg-gray-700 hover:bg-gray-600 p-2 rounded-md transition"
              aria-label="Copy to clipboard"
            >
              {copied ? <FiCheck /> : <FiClipboard />}
            </button>
          </div>
          {copied && (
            <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
              <FiCheck /> Copied to clipboard
            </div>
          )}
        </div>

        {/* External Links */}
        <div className="flex flex-wrap gap-2 mt-4">
          <a
            href={`https://www.npmjs.com/package/${details.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full"
          >
            <FiExternalLink size={14} /> NPM
          </a>
          {details.homepage && (
            <a
              href={details.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full"
            >
              <FiExternalLink size={14} /> Homepage
            </a>
          )}
          {details.repository && (
            <a
              href={
                typeof details.repository === "object"
                  ? details.repository.url
                  : details.repository
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full"
            >
              <FiGitBranch size={14} /> Repository
            </a>
          )}
        </div>
      </div>

      {/* Package Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Description */}
        <div className="bg-white shadow-md rounded-lg p-5">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
            <FiFileText className="text-gray-600" /> Description
          </h3>
          <div className="p-3 bg-gray-50 rounded border border-gray-100">
            {details.description || "No description available"}
          </div>
        </div>

        {/* License */}
        <div className="bg-white shadow-md rounded-lg p-5">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
            <FiLock className="text-gray-600" /> License
          </h3>
          <div className="p-3 bg-gray-50 rounded border border-gray-100">
            {details.license ? (
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                  {details.license}
                </span>
                <a
                  href={`https://opensource.org/licenses/${details.license}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View license details
                </a>
              </div>
            ) : (
              "No license information"
            )}
          </div>
        </div>

        {/* Author */}
        <div className="bg-white shadow-md rounded-lg p-5">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
            <FiUser className="text-gray-600" /> Author
          </h3>
          <div className="p-3 bg-gray-50 rounded border border-gray-100">
            {details.author ? (
              <div className="flex items-center">
                <div className="bg-blue-100 text-blue-800 w-10 h-10 rounded-full flex items-center justify-center mr-3 font-bold">
                  {details.author.name
                    ? details.author.name.charAt(0).toUpperCase()
                    : "?"}
                </div>
                <div>
                  <div className="font-medium">
                    {details.author.name || "Unknown"}
                  </div>
                  {details.author.email && (
                    <div className="text-sm text-gray-500">
                      {details.author.email}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              "Unknown author"
            )}
          </div>
        </div>

        {/* Maintainers */}
        {details.maintainers && details.maintainers.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-5">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
              <FiUsers className="text-gray-600" /> Maintainers
            </h3>
            <div className="p-3 bg-gray-50 rounded border border-gray-100">
              <div className="flex flex-wrap gap-2">
                {details.maintainers.map((maintainer, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-white p-2 rounded border"
                  >
                    <div className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm font-bold">
                      {maintainer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {maintainer.name}
                      </div>
                      {maintainer.email && (
                        <div className="text-xs text-gray-500">
                          {maintainer.email}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* README */}
      {details.readme ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FiBook className="text-gray-600" /> README
            </h3>
            <button
              onClick={toggleReadme}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              {readmeExpanded ? "Collapse" : "Expand"}
            </button>
          </div>
          {readmeExpanded && (
            <div className="p-6">
              <ReadmeRenderer content={details.readme} />
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center my-8">
          <FiBook size={32} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium">No README available</h3>
          <p className="text-gray-600 mt-2">
            This package does not have a README file.
          </p>
        </div>
      )}
    </div>
  );
}
