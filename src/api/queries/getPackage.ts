import type { PackageDetails } from "../types/packageDetails";

const cache: Record<string, { data: PackageDetails; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getPackage(name: string): Promise<PackageDetails> {
	if (cache[name] && Date.now() - cache[name].timestamp < CACHE_DURATION) {
		return cache[name].data;
	}

	const res = await fetch(`https://registry.npmjs.org/${name}`);
	if (!res.ok) throw new Error(`Failed to fetch package: ${name}`);

	const data = await res.json();
	cache[name] = { data, timestamp: Date.now() };
	return data;
}