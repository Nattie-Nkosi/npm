import type { PackageDetails } from "../types/packageDetails";

const FEATURED_PACKAGES = [
  'react',
  'typescript',
  'bootstrap',
  'vite',
];

export async function getFeaturedPackages() {
  const promises = FEATURED_PACKAGES.map(name =>
    fetch(`https://registry.npmjs.org/${name}`)
      .then(res => res.ok ? res.json() : Promise.reject(`Failed to fetch package: ${name}`))
  );

  try {
    return await Promise.all(promises) as PackageDetails[];
  } catch (error) {
    console.error('Error fetching featured packages:', error);
    return [];
  }
}