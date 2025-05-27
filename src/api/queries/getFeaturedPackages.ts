import type { PackageDetails } from "../types/packageDetails";

const FEATURED_PACKAGES = [
  'react',
  'typescript',
  'bootstrap',
  'vite',
];

// Added retry logic and better error handling
export async function getFeaturedPackages() {
  const fetchWithRetry = async (name: string, retries = 2): Promise<PackageDetails | null> => {
    for (let i = 0; i <= retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const res = await fetch(`https://registry.npmjs.org/${name}`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          // Ensure we have the latest version
          const latestVersion = data['dist-tags']?.latest || Object.keys(data.versions || {}).pop();
          const versionData = data.versions?.[latestVersion] || {};

          return {
            name: data.name,
            version: latestVersion,
            description: versionData.description || data.description || 'No description available',
            license: versionData.license || data.license || 'Not specified',
            author: versionData.author || data.author || { name: 'Unknown', email: '' },
            maintainers: data.maintainers || [],
            readme: versionData.readme || data.readme || 'No README available',
            repository: versionData.repository || data.repository,
            homepage: versionData.homepage || data.homepage
          };
        }

        // If we're rate limited, wait before retrying
        if (res.status === 429 && i < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
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
      readme: '# React\n\nA JavaScript library for building user interfaces.\n\n## Features\n\n- **Declarative**: React makes it painless to create interactive UIs.\n- **Component-Based**: Build encapsulated components that manage their own state.\n- **Learn Once, Write Anywhere**: We don\'t make assumptions about your technology stack.',
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
      readme: '# TypeScript\n\nTypeScript is a language for application scale JavaScript development.\n\n## Features\n\n- **Static Type-Checking**: TypeScript adds static typing to JavaScript.\n- **ECMAScript Features**: TypeScript supports new ECMAScript standards.\n- **Rich IDE Support**: TypeScript provides code completion, refactoring, and navigation.',
      repository: { url: 'https://github.com/microsoft/TypeScript' },
      homepage: 'https://www.typescriptlang.org/'
    },
    {
      name: 'vite',
      description: 'Next generation frontend tooling',
      version: '4.3.9',
      license: 'MIT',
      author: {
        name: 'Evan You',
        email: ''
      },
      maintainers: [{ name: 'Vite Team', email: '' }],
      readme: '# Vite\n\nNext Generation Frontend Tooling.\n\n## Features\n\n- **Instant Server Start**: Lightning fast cold server start.\n- **Lightning Fast HMR**: Hot Module Replacement that stays fast.\n- **Optimized Build**: Pre-configured Rollup build with multi-page and library mode support.',
      repository: { url: 'https://github.com/vitejs/vite' },
      homepage: 'https://vitejs.dev/'
    },
    {
      name: 'bootstrap',
      description: 'The most popular front-end framework for developing responsive, mobile first projects on the web.',
      version: '5.3.0',
      license: 'MIT',
      author: {
        name: 'The Bootstrap Authors',
        email: ''
      },
      maintainers: [{ name: 'Bootstrap Team', email: '' }],
      readme: '# Bootstrap\n\nThe most popular HTML, CSS, and JS library in the world.\n\n## Features\n\n- **Responsive Grid System**: Mobile-first flexbox grid.\n- **Extensive Components**: Dozens of reusable components.\n- **Powerful JavaScript Plugins**: Bring Bootstrap components to life.',
      repository: { url: 'https://github.com/twbs/bootstrap' },
      homepage: 'https://getbootstrap.com/'
    }
  ];
}