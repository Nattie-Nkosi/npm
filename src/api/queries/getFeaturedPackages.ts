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
      .then(res => res.ok ? res.json() : null)
      .catch(() => null)
  );

  const results = await Promise.all(promises);
  return results.filter(Boolean) as PackageDetails[];
}