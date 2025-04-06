import { searchPackages } from "../../api/queries/searchPackages";
import { PackageSummary } from "../../api/types/packageSummary";

export interface SearchLoaderResult {
  searchResults: PackageSummary[];
  term: string;
  error?: string;
}

export async function searchLoader({ request }: { request: Request }): Promise<SearchLoaderResult> {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("term");

  if (!term) {
    throw new Response("Search term must be provided", {
      status: 400,
      statusText: "Bad Request"
    });
  }

  try {
    const results = await searchPackages(term);

    return {
      searchResults: results,
      term
    };
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      // Rate limiting errors
      if (error.message.includes('Too many requests') || error.message.includes('429')) {
        throw new Response("Rate limit exceeded. Please try again later.", {
          status: 429,
          statusText: "Too Many Requests"
        });
      }

      // Network or connectivity issues
      if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Response("Network error. Please check your connection and try again.", {
          status: 503,
          statusText: "Service Unavailable"
        });
      }

      // Return empty results with error information
      console.error(`Search error for term "${term}":`, error);
      return {
        searchResults: [],
        term,
        error: error.message
      };
    }

    // Fallback error handling
    return {
      searchResults: [],
      term,
      error: "An unexpected error occurred while searching"
    };
  }
}