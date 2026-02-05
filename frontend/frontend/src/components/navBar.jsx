/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  // Special action links configuration with icons and styling
  const adminActions = [
    {
      path: "/add-doctor",
      label: "Add Doctor",
      icon: (
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
      mobileIcon: (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      path: "/add-departments",
      label: "Add Departments",
      icon: (
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      mobileIcon: (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
  ];

  const userActions = [
    {
      path: "/my-appointments",
      label: "My Appointments",
      icon: (
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      mobileIcon: (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      path: "/add-appointment",
      label: "Add Appointments",
      icon: (
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
      mobileIcon: (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        {/* ================= TOP BAR ================= */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm border-b border-gray-100">
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
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

            <div className="flex items-center gap-2">
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

          <div className="flex items-center gap-4 text-gray-600">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition"
              aria-label="Twitter"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775a4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827a4.996 4.996 0 01-2.212.085a4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985c0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
          </div>
        </div>

        {/* ================= MAIN NAV ================= */}
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="flex items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <img src="/logoD.jpg" alt="Clinic Logo" className="h-16 w-auto" />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-10">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.path} className="group relative">
                  <Link
                    to={link.path}
                    className={`text-sm font-semibold transition-colors duration-300
                      ${isActive(link.path) ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-[2px] bg-blue-600 transition-all duration-300
                        ${isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"}
                      `}
                    />
                  </Link>
                </li>
              ))}

              {user?.role === "admin" && (
                <>
                  {adminActions.map((action) => (
                    <li key={action.path}>
                      <Link
                        to={action.path}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all duration-200
                          ${
                            isActive(action.path)
                              ? "bg-blue-100 text-blue-800 shadow-sm"
                              : "text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-900"
                          }
                        `}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {action.icon}
                        <span>{action.label}</span>
                      </Link>
                    </li>
                  ))}
                </>
              )}

              {user?.role === "user" && (
                <>
                  {userActions.map((action) => (
                    <li key={action.path}>
                      <Link
                        to={action.path}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all duration-200
                          ${
                            isActive(action.path)
                              ? "bg-indigo-100 text-indigo-800 shadow-sm"
                              : "text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-900"
                          }
                        `}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {action.icon}
                        <span>{action.label}</span>
                      </Link>
                    </li>
                  ))}
                </>
              )}

              {!user ? (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-md hover:shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-800 font-medium transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50"
                    aria-label="Logout"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Logout</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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

        {/* ================= MOBILE MENU ================= */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden py-4 border-t border-gray-200 animate-fadeIn"
            role="dialog"
            aria-modal="true"
          >
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium flex items-center gap-3
                      ${
                        isActive(link.path)
                          ? "bg-blue-100 text-blue-800 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}

              {user?.role === "admin" && (
                <>
                  {adminActions.map((action) => (
                    <li key={action.path}>
                      <Link
                        to={action.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-4 py-3 rounded-xl text-base font-medium flex items-center gap-3
                          ${
                            isActive(action.path)
                              ? "bg-blue-100 text-blue-800"
                              : "text-blue-700 bg-blue-50 hover:bg-blue-100"
                          }
                        `}
                      >
                        {action.mobileIcon}
                        <span>{action.label}</span>
                      </Link>
                    </li>
                  ))}
                </>
              )}

              {user?.role === "user" && (
                <>
                  {userActions.map((action) => (
                    <li key={action.path}>
                      <Link
                        to={action.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-4 py-3 rounded-xl text-base font-medium flex items-center gap-3
                          ${
                            isActive(action.path)
                              ? "bg-indigo-100 text-indigo-800"
                              : "text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                          }
                        `}
                      >
                        {action.mobileIcon}
                        <span>{action.label}</span>
                      </Link>
                    </li>
                  ))}
                </>
              )}

              {!user ? (
                <>
                  <li className="pt-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-3 bg-blue-600 text-white text-center font-semibold rounded-xl hover:bg-blue-700 transition shadow-md"
                    >
                      Login
                    </Link>
                  </li>
                  <li className="pt-2">
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition"
                    >
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <li className="pt-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full px-4 py-3 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </li>
              )}

              <li className="pt-4 mt-4 border-t border-gray-100">
                <Link
                  to="/appointment"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full px-4 py-3 bg-green-600 text-white text-center font-semibold rounded-xl hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
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
