interface PackageCardSkeletonProps {
  animated?: boolean;
  delay?: number;
}

export default function PackageCardSkeleton({
  animated = true,
  delay = 0,
}: PackageCardSkeletonProps) {
  const animationClass = animated ? "animate-pulse" : "";

  return (
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

interface DetailsSkeletonProps {}

export function DetailsSkeleton({}: DetailsSkeletonProps) {
  return (
    <div className="space-y-6 py-6 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>

      <div>
        <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="p-3 bg-gray-100 rounded h-16"></div>
      </div>

      <div>
        <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="p-3 bg-gray-100 rounded h-8"></div>
      </div>

      <div>
        <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="p-3 bg-gray-100 rounded h-8"></div>
      </div>

      <div>
        <div className="h-6 bg-gray-200 rounded w-28 mb-2"></div>
        <div className="p-3 bg-gray-100 rounded h-24"></div>
      </div>

      <div>
        <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="p-3 bg-gray-100 rounded h-64"></div>
      </div>
    </div>
  );
}
