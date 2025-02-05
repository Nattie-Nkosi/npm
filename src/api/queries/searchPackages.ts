import type { PackageSummary } from "../types/packageSummary";

interface SearchResponse {
	objects: {
		package: {
			name: string;
			description: string;
			version: string;
			keywords: string[];
		}
	}[]
}

export async function searchPackages(term: string): Promise<PackageSummary[]> {
	if (!term.trim()) {
		throw new Error('Search term is required');
	}

	try {
		const res = await fetch(
			`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(term)}`
		);

		if (!res.ok) {
			if (res.status === 429) {
				throw new Error('Too many requests. Please try again later.');
			}
			throw new Error(`Search failed: ${res.statusText}`);
		}

		const data: SearchResponse = await res.json();
		return data.objects.map(({ package: { name, description, version, keywords } }) => ({
			name,
			description,
			version,
			keywords,
		}));
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('An unexpected error occurred');
	}
}