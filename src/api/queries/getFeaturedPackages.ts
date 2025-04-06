import type { PackageDetails } from "../types/packageDetails";

const FEATURED_PACKAGES = [
  'react',
  'typescript',
  'bootstrap',
  'vite',
];

// Added retry logic and better error handling
export async function getFeaturedPackages() {
  const fetchWithRetry = async (name: string, retries = 2) => {
    for (let i = 0; i <= retries; i++) {
      try {
        const res = await fetch(`https://registry.npmjs.org/${name}`);
        if (res.ok) {
          return await res.json();
        }

        // If we're rate limited, wait before retrying
        if (res.status === 429 && i < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        console.warn(`Failed to fetch ${name}, status: ${res.status}`);
        return null;
      } catch (error) {
        console.error(`Error fetching ${name}:`, error);
        if (i < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        return null;
      }
    }
    return null;
  };

  const promises = FEATURED_PACKAGES.map(name => fetchWithRetry(name));

  try {
    const results = await Promise.all(promises);
    const filteredResults = results.filter(Boolean) as PackageDetails[];

    // Provide fallback if we couldn't fetch any packages
    if (filteredResults.length === 0) {
      console.warn('Could not fetch any featured packages. Using fallback data.');
      return getFallbackPackages();
    }

    return filteredResults;
  } catch (error) {
    console.error('Error fetching featured packages:', error);
    return getFallbackPackages();
  }
}

// Fallback data to use when API calls fail
function getFallbackPackages(): PackageDetails[] {
  return [
    {
      name: 'react',
      description: 'A JavaScript library for building user interfaces',
      version: '18.2.0',
      license: 'MIT',
      author: {
        name: 'Facebook',
        email: 'opensource@fb.com'
      },
      maintainers: [{ name: 'React Team', email: 'react-core@fb.com' }],
      readme: '# React\n\nA JavaScript library for building user interfaces.',
      repository: { url: 'https://github.com/facebook/react' },
      homepage: 'https://reactjs.org'
    },
    {
      name: 'typescript',
      description: 'TypeScript is a language for application scale JavaScript development',
      version: '5.0.4',
      license: 'Apache-2.0',
      author: {
        name: 'Microsoft Corp.',
        email: 'typescript@microsoft.com'
      },
      maintainers: [{ name: 'TypeScript Team', email: 'typescript@microsoft.com' }],
      readme: '# TypeScript\n\nTypeScript is a language for application scale JavaScript development.',
      repository: { url: 'https://github.com/microsoft/TypeScript' },
      homepage: 'https://www.typescriptlang.org/'
    }
  ];
}