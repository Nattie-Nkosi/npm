import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiSearch,
  FiMenu,
  FiX,
  FiHeart,
  FiGithub,
} from "react-icons/fi";
import SearchInput from "./Searchinput";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Main navigation items
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Popular", path: "/search?term=popular" },
    { label: "Categories", path: "/search?term=framework" },
    { label: "New Releases", path: "/search?term=new" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-lg font-bold"
              aria-label="NPM Registry Home"
            >
              <FiPackage className="h-6 w-6 text-blue-600" />
              <span className="hidden sm:inline-block text-black">
                NPM Registry
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:block w-64 lg:w-96">
              <SearchInput />
            </div>

            {/* GitHub Link */}
            <a
              href="https://github.com/Nattie-Nkosi/npm-registry-search"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="GitHub Repository"
            >
              <FiGithub className="h-5 w-5" />
            </a>

            {/* Favorites - could link to a favorites page */}
            <Link
              to="/search?term=react"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Favorite Packages"
            >
              <FiHeart className="h-5 w-5" />
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="py-3 px-2 space-y-1 border-t">
              {/* Mobile Search */}
              <div className="p-2">
                <SearchInput />
              </div>

              {/* Mobile Navigation */}
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Additional items for mobile */}
              <Link
                to="/search?term=typescript"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                TypeScript
              </Link>
              <Link
                to="/search?term=react"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                React
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
