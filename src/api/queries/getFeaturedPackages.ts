import type { PackageDetails } from "../types/packageDetails";

const FEATURED_PACKAGES = [
  'react',
  'typescript',
  'bootstrap',
  'vite',
];

export async function getFeaturedPackages() {
  try {

    const promises = FEATURED_PACKAGES.map(async (name) => {
      const res = await fetch(`https://registry.npmjs.org/${name}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch package: ${name}`);
      }
      return res.json()
    });
    const data = await Promise.all(promises);

    return data as PackageDetails[];
  } catch (error) {
    console.error('Error fetching featured packages:', error);
    return [];
  }
}