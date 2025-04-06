import React from "react";
import { Link } from "react-router-dom";
import {
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiHeart,
  FiPackage,
  FiStar,
  FiCode,
} from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Footer navigation sections
  const footerSections = [
    {
      title: "Explore",
      links: [
        { label: "Popular Packages", path: "/search?term=popular" },
        { label: "Frameworks", path: "/search?term=framework" },
        { label: "UI Libraries", path: "/search?term=ui" },
        { label: "Testing Tools", path: "/search?term=testing" },
      ],
    },
    {
      title: "Resources",
      links: [
        {
          label: "Documentation",
          path: "https://docs.npmjs.com/",
          external: true,
        },
        { label: "NPM Blog", path: "https://blog.npmjs.org/", external: true },
        {
          label: "GitHub",
          path: "https://github.com/Nattie-Nkosi/npm-registry-search",
          external: true,
        },
        {
          label: "About NPM",
          path: "https://www.npmjs.com/about",
          external: true,
        },
      ],
    },
    {
      title: "Popular Packages",
      links: [
        { label: "React", path: "/packages/react" },
        { label: "TypeScript", path: "/packages/typescript" },
        { label: "Vite", path: "/packages/vite" },
        { label: "Bootstrap", path: "/packages/bootstrap" },
      ],
    },
  ];

  // Render either an internal Link or external anchor based on the link type
  const renderLink = (
    link: { label: string; path: string; external?: boolean },
    index: React.Key | null | undefined
  ) => {
    if (link.external) {
      return (
        <a
          key={index}
          href={link.path}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-blue-600 transition-colors"
        >
          {link.label}
        </a>
      );
    }
    return (
      <Link
        key={index}
        to={link.path}
        className="text-gray-500 hover:text-blue-600 transition-colors"
      >
        {link.label}
      </Link>
    );
  };

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Top section with links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <FiPackage className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold">NPM Registry</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Search and explore NPM packages with this registry application.
              Find the perfect dependencies for your next JavaScript project.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://github.com/Nattie-Nkosi/npm-registry-search"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900"
                aria-label="GitHub"
              >
                <FiGithub className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-400"
                aria-label="Twitter"
              >
                <FiTwitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-700"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation sections */}
          {footerSections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>{renderLink(link, linkIdx)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section with copyright */}
        <div className="pt-8 mt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} NPM Registry Explorer. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/terms"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Privacy Policy
              </Link>
              <Link
                to="/cookies"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Credits */}
          <div className="mt-6 text-center text-xs text-gray-400 flex items-center justify-center">
            <span>Made with</span>
            <FiHeart className="mx-1 text-red-500" />
            <span>by</span>
            <a
              href="https://github.com/Nattie-Nkosi"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-blue-500 hover:text-blue-700"
            >
              Nattie Nkosi
            </a>
            <span className="mx-2">|</span>
            <span className="flex items-center">
              <FiCode className="mr-1" />
              <span>Built with React & Tailwind</span>
              <FiStar className="mx-1 text-yellow-500" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
