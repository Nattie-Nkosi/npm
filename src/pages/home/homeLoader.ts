import { getFeaturedPackages } from "../../api/queries/getFeaturedPackages";
import { PackageDetails } from "../../api/types/packageDetails";

export interface HomeLoaderResult {
  featuredPackages: PackageDetails[];
  error?: string;
}

export async function homeLoader(): Promise<HomeLoaderResult> {
  try {
    const featuredPackages = await getFeaturedPackages();

    return {
      featuredPackages
    };
  } catch (error) {
    console.error("Error loading home page data:", error);

    // Still return partial data so the page can render with fallback content
    return {
      featuredPackages: [],
      error: error instanceof Error
        ? error.message
        : "Failed to load featured packages"
    };
  }
}