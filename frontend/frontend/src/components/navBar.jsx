import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  // Common navigation links for regular users
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/about-us", label: "About" },
  ];

  // User actions with icons
  const userActions = [
    {
      path: "/my-appointments",
      label: "Appointments",
      icon: (
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
      ),
    },
    {
      path: "/add-appointment",
      label: "Book Now",
      icon: (
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
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
      highlighted: true,
    },
  ];

  // ================= ADMIN NAVIGATION =================

  // Admin navigation items with icons
  const adminNavItems = [
    {
      path: "/admin-overview",
      label: "Overview",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      ),
    },
    {
      path: "/admin-doctors",
      label: "Doctors",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
          <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
          <circle cx="20" cy="10" r="2"></circle>
        </svg>
      ),
    },
    {
      path: "/admin-appointments",
      label: "Appointments",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
    },
    {
      path: "/admin-departments",
      label: "Departments",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
          <path d="M9 22v-4h6v4"></path>
          <path d="M8 6h.01"></path>
          <path d="M16 6h.01"></path>
          <path d="M12 6h.01"></path>
          <path d="M12 10h.01"></path>
          <path d="M12 14h.01"></path>
          <path d="M16 10h.01"></path>
          <path d="M16 14h.01"></path>
          <path d="M8 10h.01"></path>
          <path d="M8 14h.01"></path>
        </svg>
      ),
    },
    {
      path: "/admin-users",
      label: "Users",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
  ];

  // Render admin navigation items
  const renderAdminNavItems = (items, isMobile = false) => (
    <div
      className={`flex ${isMobile ? "flex-col space-y-2" : "items-center space-x-1"}`}
    >
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => isMobile && setIsMenuOpen(false)}
          className={`
            flex items-center ${isMobile ? "px-4 py-3 rounded-lg space-x-3" : "px-4 py-2.5 rounded-lg space-x-2"}
            font-medium transition-all duration-200
            ${
              isActive(item.path)
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-100 shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            }
          `}
        >
          <div
            className={`p-1.5 rounded-lg ${isActive(item.path) ? "bg-blue-100" : "bg-gray-100"}`}
          >
            {item.icon}
          </div>
          <span>{item.label}</span>
          {isActive(item.path) && !isMobile && (
            <div className="ml-1 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
          )}
        </Link>
      ))}
    </div>
  );

  // Common render function for user navigation items
  const renderUserNavItems = (links, isMobile = false) => (
    <div
      className={`flex ${isMobile ? "flex-col space-y-2" : "items-center space-x-2"}`}
    >
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          onClick={() => isMobile && setIsMenuOpen(false)}
          className={`
            inline-flex items-center ${isMobile ? "px-4 py-3 rounded-lg" : "px-4 py-2.5 rounded-lg"}
            font-medium transition-all duration-200
            ${
              isActive(link.path)
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            }
            ${
              link.highlighted && !isActive(link.path)
                ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 shadow-md hover:shadow-lg"
                : ""
            }
          `}
        >
          {link.icon && (
            <span className={`${isMobile ? "mr-3" : "mr-2"}`}>{link.icon}</span>
          )}
          {link.label}
        </Link>
      ))}
    </div>
  );

  // ================= ADMIN NAVBAR =================
  if (user?.role === "admin") {
    return (
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-blue-100 shadow-sm">
        <div className="px-4 md:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-4">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="flex items-center space-x-3"
                onClick={() => setIsMenuOpen(false)}
              >
                <img src="logoD.jpg" alt="" className="h-20 w-auto" />
              </Link>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-3 px-4 py-2 bg-blue-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                  <span className="font-bold text-white text-lg">
                    {user.name?.charAt(0) || "A"}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {user.name || "Admin"}
                  </div>
                  <div className="text-xs text-blue-600">Administrator</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
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
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-7 h-7 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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

          {/* Navigation Bar */}
          <div className="py-2 border-t border-blue-100 bg-white/80">
            <div className="flex items-center justify-between overflow-x-auto">
              <div className="flex items-center">
                {renderAdminNavItems(adminNavItems)}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-blue-100 bg-gradient-to-b from-white to-blue-50/50">
            <div className="space-y-6">
              {/* Admin Navigation */}
              <div className="space-y-2">
                <div className="px-4 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Navigation
                </div>
                {renderAdminNavItems(adminNavItems, true)}
              </div>

              {/* User Profile & Logout */}
              <div className="pt-4 border-t border-blue-100 px-4">
                <div className="flex items-center space-x-3 pb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                    <span className="font-bold text-white text-xl">
                      {user.name?.charAt(0) || "A"}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {user.name || "Admin"}
                    </div>
                    <div className="text-sm text-blue-600">Administrator</div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-sm"
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
                  <span>Logout</span>
                </button>
              </div>

              {/* Quick Stats - Optional for mobile */}
              <div className="px-4 pt-4 border-t border-blue-100">
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
                  Quick Stats
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-700">
                      Today's Appointments
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mt-1">
                      24
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-700">
                      Active Doctors
                    </div>
                    <div className="text-2xl font-bold text-green-600 mt-1">
                      18
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    );
  }

  // ================= USER NAVBAR =================
  if (user?.role === "user") {
    return (
      <nav className="sticky top-0 z-50 bg-white shadow-lg border-b border-blue-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="flex items-center space-x-3"
                onClick={() => setIsMenuOpen(false)}
              >
                <img src="logoD.jpg" alt="" className="h-20 w-auto" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Main Navigation Links */}
              <div className="flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      px-4 py-2.5 rounded-lg font-medium transition-all duration-200
                      ${
                        isActive(link.path)
                          ? "text-blue-600 bg-blue-50 font-semibold"
                          : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="h-8 w-px bg-blue-200"></div>

              {/* User Actions */}
              <div className="flex items-center space-x-3">
                {userActions.map((action) => (
                  <Link
                    key={action.path}
                    to={action.path}
                    className={`
                      flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200
                      ${
                        action.highlighted
                          ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800"
                          : isActive(action.path)
                            ? "bg-blue-100 text-blue-700"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      }
                    `}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </Link>
                ))}

                {/* User Profile Dropdown */}
                <div className="relative group">
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                    <div className="w-9 h-9 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div className="hidden md:block">
                      <div className="text-sm font-semibold text-gray-800">
                        {user.name || "User"}
                      </div>
                      <div className="text-xs text-blue-600">Patient</div>
                    </div>
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-blue-100 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                    <div className="p-4 border-b border-blue-50">
                      <div className="text-sm font-semibold text-gray-800">
                        {user.name || "User"}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        Patient Account
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Manage your health profile
                      </div>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-3 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg
                          className="w-5 h-5 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/medical-history"
                        className="flex items-center space-x-2 px-3 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg
                          className="w-5 h-5 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>Medical History</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-3 py-2.5 mt-2 rounded-lg hover:bg-red-50 text-red-600 font-medium"
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
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-7 h-7 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-6 border-t border-blue-100 bg-gradient-to-b from-white to-blue-50/50 rounded-b-xl">
              <div className="space-y-4">
                {/* Main Links */}
                <div className="grid grid-cols-2 gap-2 px-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`
                        px-4 py-3 rounded-lg text-center font-medium transition-all
                        ${
                          isActive(link.path)
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-blue-50 text-gray-700 hover:bg-blue-100"
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* User Actions */}
                <div className="space-y-2 px-2">
                  {userActions.map((action) => (
                    <Link
                      key={action.path}
                      to={action.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`
                        flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium
                        ${
                          action.highlighted
                            ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md"
                            : isActive(action.path)
                              ? "bg-blue-100 text-blue-700"
                              : "bg-blue-50 text-blue-700"
                        }
                      `}
                    >
                      {action.icon}
                      <span>{action.label}</span>
                    </Link>
                  ))}
                </div>

                {/* User Profile & Logout */}
                <div className="pt-4 border-t border-blue-100">
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {user.name || "User"}
                      </div>
                      <div className="text-sm text-blue-600">
                        Patient Account
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 px-2 mt-3">
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-3 text-center bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // ================= DEFAULT NAVBAR (No user logged in) =================
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-blue-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="flex items-center space-x-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <img src="logoD.jpg" alt="" className="h-20 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Main Navigation Links */}
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-4 py-2.5 rounded-lg font-medium transition-all duration-200
                    ${
                      isActive(link.path)
                        ? "text-blue-600 bg-blue-50 font-semibold"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="h-8 w-px bg-blue-200"></div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-5 py-2.5 text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-7 h-7 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-blue-100 bg-gradient-to-b from-white to-blue-50/50 rounded-b-xl">
            <div className="space-y-4">
              {/* Main Links */}
              <div className="grid grid-cols-2 gap-2 px-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      px-4 py-3 rounded-lg text-center font-medium transition-all
                      ${
                        isActive(link.path)
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-blue-50 text-gray-700 hover:bg-blue-100"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className="pt-4 border-t border-blue-100">
                <div className="space-y-3 px-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-medium rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-lg shadow-md"
                  >
                    Create Account
                  </Link>
                </div>

                {/* Quick Info */}
                <div className="mt-4 px-4 py-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-800">
                    Need help?
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Call us: (123) 456-7890
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
