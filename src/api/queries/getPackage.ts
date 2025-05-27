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
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

			const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(normalizedName)}`, {
				signal: controller.signal,
				headers: {
					'Accept': 'application/json',
				}
			});

			clearTimeout(timeoutId);

			if (res.ok) {
				const data = await res.json();

				// Get the latest version information
				const latestVersion = data['dist-tags']?.latest || Object.keys(data.versions || {}).pop();
				const versionData = data.versions?.[latestVersion] || {};

				// Enhance data with defaults for missing fields
				const enhancedData: PackageDetails = {
					name: data.name,
					version: latestVersion || '0.0.0',
					description: versionData.description || data.description || 'No description available',
					readme: versionData.readme || data.readme || 'No README available for this package.',
					license: versionData.license || data.license || 'Not specified',
					author: versionData.author || data.author || { name: 'Unknown', email: '' },
					maintainers: data.maintainers || [],
					repository: versionData.repository || data.repository,
					homepage: versionData.homepage || data.homepage
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
			// Handle timeout errors
			if (error instanceof Error && error.name === 'AbortError') {
				lastError = new Error('Request timed out. Please try again.');
			} else {
				lastError = error instanceof Error ? error : new Error('An unexpected error occurred');
			}

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