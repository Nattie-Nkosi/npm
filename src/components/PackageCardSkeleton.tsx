interface PackageCardSkeletonProps {
  animated?: boolean;
  delay?: number;
  count?: number;
}

export default function PackageCardSkeleton({
  animated = true,
  delay = 0,
  count = 1,
}: PackageCardSkeletonProps) {
  const animationClass = animated ? "animate-pulse" : "";

  const renderSkeleton = () => (
    <div
      className={`border rounded-lg p-5 h-60 ${animationClass}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex justify-between mb-4">
        <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
        <div className="h-5 w-10 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-7 w-3/4 bg-gray-200 rounded-md mx-auto mb-4"></div>
      <div className="space-y-2 mb-6">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
      </div>
      <div className="flex justify-between mb-4">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
      <div className="flex gap-2 mt-auto">
        <div className="h-10 bg-gray-300 rounded-md flex-grow"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            {renderSkeleton()}
          </div>
        ))}
    </div>
  );
}

interface SearchResultSkeletonProps {
  count?: number;
}

export function SearchResultSkeleton({ count = 5 }: SearchResultSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="border p-4 rounded animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex justify-between">
              <div className="space-y-3 w-3/4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="flex gap-1">
                  {Array(3)
                    .fill(0)
                    .map((_, j) => (
                      <div
                        key={j}
                        className="h-5 w-16 bg-gray-200 rounded"
                      ></div>
                    ))}
                </div>
              </div>
              <div className="w-20 flex items-center justify-center">
                <div className="h-10 w-16 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

interface DetailsSkeletonProps {
  withReadme?: boolean;
}

export function DetailsSkeleton({ withReadme = true }: DetailsSkeletonProps) {
  return (
    <div className="space-y-6 py-6 animate-pulse">
      {/* Package Header */}
      <div className="rounded-lg p-6 mb-6 border">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
          <div>
            <div className="h-8 bg-gray-200 rounded w-40 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>

        <div className="h-10 bg-gray-200 rounded mb-4"></div>

        <div className="flex gap-2">
          <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Package Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-lg p-5 border">
          <div className="h-6 bg-gray-200 rounded w-32 mb-3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>

        <div className="rounded-lg p-5 border">
          <div className="h-6 bg-gray-200 rounded w-24 mb-3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* README Section */}
      {withReadme && (
        <div className="rounded-lg overflow-hidden border">
          <div className="p-4 border-b">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>

          <div className="p-6">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="mb-4">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Add an empty state component for when no data is available
export function EmptyState({
  title = "No Data Available",
  message = "We couldn't find what you're looking for.",
  actionLabel,
  onAction,
}: {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="text-center py-12 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{message}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
