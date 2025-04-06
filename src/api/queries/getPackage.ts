import type { PackageDetails } from "../types/packageDetails";

const cache: Record<string, { data: PackageDetails; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getPackage(name: string, retries = 2): Promise<PackageDetails> {
	if (!name || typeof name !== 'string') {
		throw new Error('Invalid package name');
	}

	// Normalize package name
	const normalizedName = name.trim();

	// Check cache first
	if (cache[normalizedName] && Date.now() - cache[normalizedName].timestamp < CACHE_DURATION) {
		return cache[normalizedName].data;
	}

	let lastError: Error | null = null;

	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(normalizedName)}`);

			if (res.ok) {
				const data = await res.json();

				// Enhance data with defaults for missing fields
				const enhancedData = {
					...data,
					description: data.description || 'No description available',
					readme: data.readme || 'No README available for this package.',
					license: data.license || 'Not specified',
					author: data.author || { name: 'Unknown', email: '' },
					maintainers: data.maintainers || [],
				};

				// Update cache
				cache[normalizedName] = { data: enhancedData, timestamp: Date.now() };
				return enhancedData;
			}

			// Handle specific status codes
			if (res.status === 404) {
				throw new Error(`Package not found: ${normalizedName}`);
			} else if (res.status === 429 && attempt < retries) {
				// Wait longer for each retry on rate limiting
				await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
				continue;
			}

			// Handle other errors
			const errorText = await res.text().catch(() => res.statusText);
			lastError = new Error(`Failed to fetch package (${res.status}): ${errorText}`);

			if (attempt < retries) {
				await new Promise(resolve => setTimeout(resolve, 800));
				continue;
			}

			throw lastError;
		} catch (error) {
			lastError = error instanceof Error ? error : new Error('An unexpected error occurred');

			if (attempt < retries) {
				await new Promise(resolve => setTimeout(resolve, 800));
				continue;
			}
		}
	}

	// All retries failed
	if (lastError) {
		if (lastError.message.includes('Package not found')) {
			throw new Error(`Package not found: ${normalizedName}`);
		}
		throw lastError;
	}

	throw new Error(`Failed to fetch package: ${normalizedName}`);
}