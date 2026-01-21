import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-purple-900/90 backdrop-blur-md border-b border-purple-700/50 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-white hover:text-purple-300 transition">
              Campus-Connect
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
              Home
            </Link>
            <Link to="/marketplace" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
              Marketplace
            </Link>
            <Link to="/create-listing" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
              Post Listing
            </Link>
            <Link to="/login" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-md"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 hover:text-white focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-purple-900/95 border-t border-purple-700/50">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-purple-800/50 transition"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-purple-800/50 transition"
              onClick={() => setIsOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              to="/create-listing"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-purple-800/50 transition"
              onClick={() => setIsOpen(false)}
            >
              Post Listing
            </Link>
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-purple-800/50 transition"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block px-3 py-2 rounded-md text-base font-medium bg-purple-600 hover:bg-purple-700 text-white transition"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;