import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/departments", label: "Departments" },
    { path: "/doctors", label: "Our Doctors" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm border-b border-gray-100">
          <div className="flex items-center space-x-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>Emergency: +216 123 456 789</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Mon - Sat: 8:00 AM - 8:00 PM</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-blue-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Main navbar */}
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img className="h-20 w-auto" src="/logoD.jpg" alt="Logo" />
          </Link>

          {/* Desktop menu - RIGHT SIDE */}
          <div className="hidden lg:flex items-center space-x-8">
            <ul className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`
                      text-sm font-semibold transition-colors duration-200 pb-1
                      ${
                        isActive(link.path)
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              to="/appointment"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Book Appointment
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      block px-4 py-2 rounded-lg text-sm font-medium
                      ${
                        isActive(link.path)
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 px-4">
                <Link
                  to="/appointment"
                  className="block w-full px-4 py-3 bg-blue-600 text-white text-center font-semibold rounded-lg"
                >
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
