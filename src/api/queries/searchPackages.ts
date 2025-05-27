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

export async function searchPackages(term: string, retries = 2): Promise<PackageSummary[]> {
	if (!term.trim()) {
		throw new Error('Search term is required');
	}

	const encodedTerm = encodeURIComponent(term.trim());
	let lastError: Error | null = null;

	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

			const res = await fetch(
				`https://registry.npmjs.org/-/v1/search?text=${encodedTerm}&size=50`,
				{
					signal: controller.signal,
					headers: {
						'Accept': 'application/json',
					}
				}
			);

			clearTimeout(timeoutId);

			if (res.ok) {
				const data: SearchResponse = await res.json();

				// Handle empty results gracefully
				if (!data.objects || data.objects.length === 0) {
					return [];
				}

				return data.objects.map(({ package: pkg }) => ({
					name: pkg.name || 'Unknown',
					description: pkg.description || '',
					version: pkg.version || '0.0.0',
					keywords: Array.isArray(pkg.keywords) ? pkg.keywords : [],
				}));
			}

			// Handle rate limiting
			if (res.status === 429) {
				if (attempt < retries) {
					// Wait longer for each retry
					const delay = 1000 * (attempt + 1);
					console.warn(`Rate limited. Retrying in ${delay}ms...`);
					await new Promise(resolve => setTimeout(resolve, delay));
					continue;
				}
				throw new Error('Too many requests. Please try again later.');
			}

			// Handle other HTTP errors
			const errorText = await res.text().catch(() => res.statusText);
			lastError = new Error(`Search failed (${res.status}): ${errorText || res.statusText}`);

			if (attempt < retries) {
				console.warn(`Search request failed. Retrying (${attempt + 1}/${retries})...`);
				await new Promise(resolve => setTimeout(resolve, 800));
				continue;
			}

			throw lastError;
		} catch (error) {
			// Handle timeout errors
			if (error instanceof Error && error.name === 'AbortError') {
				lastError = new Error('Search request timed out. Please try again.');
			} else {
				lastError = error instanceof Error
					? error
					: new Error('An unexpected error occurred');
			}

			if (attempt < retries) {
				console.warn(`Search failed. Retrying (${attempt + 1}/${retries})...`, error);
				await new Promise(resolve => setTimeout(resolve, 800));
				continue;
			}
		}
	}

	// If we get here, all retries failed
	if (lastError) {
		throw lastError;
	}

	// Fallback empty result if we somehow get here with no error
	return [];
}