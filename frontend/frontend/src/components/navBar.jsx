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

  // Common navigation links
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
  ];

  // User actions
  const userActions = [
    {
      path: "/my-appointments",
      label: "My Appointments",
      icon: (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      path: "/add-appointment",
      label: "Book Appointment",
      icon: (
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
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
  ];

  // ADMIN NAVBAR - White and Blue Design
  if (user?.role === "admin") {
    return (
      <nav className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4">
      

          {/* Mobile Admin Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200">
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-base font-medium
                        ${
                          isActive(link.path)
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-blue-50"
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}

                

                <li>
                  <Link
                    to="/admin-dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium
                      ${
                        isActive("/admin-dashboard")
                          ? "bg-blue-600 text-white"
                          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      }
                    `}
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <span>Dashboard</span>
                  </Link>
                </li>

                <li className="pt-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
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
              </ul>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // User navbar design (keep existing)
  if (user?.role === "user") {
    return (
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <img src="/logoD.jpg" alt="Clinic Logo" className="h-12 w-auto" />
            </Link>

            {/* Desktop menu */}
            <div className="hidden lg:flex items-center gap-6">
              <ul className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`font-medium ${
                        isActive(link.path)
                          ? "text-indigo-600"
                          : "text-gray-700 hover:text-indigo-600"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}

                {userActions.map((action) => (
                  <li key={action.path}>
                    <Link
                      to={action.path}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm
                        ${
                          isActive(action.path)
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {action.icon}
                      <span>{action.label}</span>
                    </Link>
                  </li>
                ))}

                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg"
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
                    Logout
                  </button>
                </li>
              </ul>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2"
              aria-expanded={isMenuOpen}
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
                      className={`block px-4 py-3 rounded-lg font-medium
                        ${
                          isActive(link.path)
                            ? "bg-indigo-100 text-indigo-800"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}

                {userActions.map((action) => (
                  <li key={action.path}>
                    <Link
                      to={action.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium
                        ${
                          isActive(action.path)
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {action.icon}
                      <span>{action.label}</span>
                    </Link>
                  </li>
                ))}

                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
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
              </ul>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // Default navbar (no user logged in) - keep existing
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <img src="/logoD.jpg" alt="Clinic Logo" className="h-12 w-auto" />
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-6">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`font-medium ${
                      isActive(link.path)
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2"
            aria-expanded={isMenuOpen}
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
                    className={`block px-4 py-3 rounded-lg font-medium
                      ${
                        isActive(link.path)
                          ? "bg-blue-100 text-blue-800"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full px-4 py-3 bg-blue-600 text-white text-center font-medium rounded-lg hover:bg-blue-700"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full px-4 py-3 bg-white border border-blue-600 text-blue-600 text-center font-medium rounded-lg hover:bg-blue-50"
                >
                  Register
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
