import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiPackage, FiMenu, FiX, FiHeart, FiGithub } from "react-icons/fi";
import SearchInput from "./Searchinput";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Check if a nav item is active
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname + location.search === path || location.search === path.split("?")[1];
  };

  // Main navigation items
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Popular", path: "/search?term=popular" },
    { label: "Categories", path: "/search?term=framework" },
    { label: "New Releases", path: "/search?term=new" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-200/50 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-lg font-bold group"
              aria-label="NPM Registry Home"
            >
              <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-zinc-800 transition-all duration-200">
                <FiPackage className="h-5 w-5 text-white" />
              </div>
              <span className="hidden sm:inline-block text-zinc-900">
                NPM Registry
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-zinc-900 text-white shadow-md"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block w-64 lg:w-96">
              <SearchInput />
            </div>

            {/* GitHub Link */}
            <a
              href="https://github.com/Nattie-Nkosi/npm"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all duration-200"
              aria-label="GitHub Repository"
            >
              <FiGithub className="h-5 w-5" />
            </a>

            {/* Favorites - could link to a favorites page */}
            <Link
              to="/search?term=react"
              className="p-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all duration-200"
              aria-label="Favorite Packages"
            >
              <FiHeart className="h-5 w-5" />
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all duration-200"
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
            <div className="py-3 px-2 space-y-1 border-t border-zinc-200/50">
              {/* Mobile Search */}
              <div className="p-2">
                <SearchInput />
              </div>

              {/* Mobile Navigation */}
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Additional items for mobile */}
              <Link
                to="/search?term=typescript"
                className="block px-4 py-2.5 rounded-lg text-base font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                TypeScript
              </Link>
              <Link
                to="/search?term=react"
                className="block px-4 py-2.5 rounded-lg text-base font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-200"
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
