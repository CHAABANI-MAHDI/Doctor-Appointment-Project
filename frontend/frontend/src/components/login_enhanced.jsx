/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const demoAccounts = [
    {
      email: "patient@demo.com",
      password: "password123",
      role: "👤 Patient",
      color: "blue",
    },
    {
      email: "doctor@demo.com",
      password: "password123",
      role: "⚕️ Doctor",
      color: "green",
    },
    {
      email: "admin@demo.com",
      password: "password123",
      role: "👨‍💼 Admin",
      color: "purple",
    },
  ];

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setForm({ email: demoEmail, password: demoPassword });
    setErrors({ email: "", password: "", general: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", general: "" });

    const newErrors = { email: "", password: "", general: "" };
    let hasErrors = false;

    if (!form.email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Invalid email";
      hasErrors = true;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(form);

      // Role-based redirect
      if (result.role === "admin") {
        navigate("/admin-overview");
      } else if (result.role === "doctor") {
        navigate("/doctor-profile");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setErrors({
        ...newErrors,
        general: err.message || "Login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden p-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
          {/* Header Gradient */}
          <div className="h-36 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 right-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
            </div>
            <div className="relative h-full flex flex-col items-center justify-center">
              <h1 className="text-5xl font-bold text-white">🏥 MediCare</h1>
              <p className="text-blue-100 text-sm mt-2">
                Tunisian Healthcare Platform
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Error Alert */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Login Failed
                  </p>
                  <p className="text-sm text-red-700 mt-1">{errors.general}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-sm font-semibold text-gray-800 block mb-2">
                  📧 Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={isLoading}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 border-2 rounded-xl font-medium transition-all focus:outline-none disabled:bg-gray-50 ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50"
                      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs font-medium text-red-600 mt-2">
                    ❌ {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-semibold text-gray-800 block mb-2">
                  🔐 Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    disabled={isLoading}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border-2 rounded-xl font-medium transition-all focus:outline-none disabled:bg-gray-50 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {showPassword ? "🙈 Hide" : "👁️ Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-red-600 mt-2">
                    ❌ {errors.password}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⏳</span> Signing in...
                  </>
                ) : (
                  <>🔓 Sign In</>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-600 font-medium">
                    Try Demo Account
                  </span>
                </div>
              </div>

              {/* Demo Buttons */}
              <div className="space-y-2">
                {demoAccounts.map((account, idx) => {
                  const colorMap = {
                    blue: "bg-blue-50 border-blue-300 hover:border-blue-500 hover:bg-blue-100",
                    green:
                      "bg-green-50 border-green-300 hover:border-green-500 hover:bg-green-100",
                    purple:
                      "bg-purple-50 border-purple-300 hover:border-purple-500 hover:bg-purple-100",
                  };

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        fillDemoAccount(account.email, account.password)
                      }
                      disabled={isLoading}
                      className={`w-full px-4 py-3 border-2 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                        colorMap[account.color]
                      }`}
                    >
                      {account.role} • {account.email}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-center text-gray-500 mt-4">
                Demo credentials are for testing only
              </p>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-center">
              <p className="text-sm text-gray-700">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Create One
                </Link>
              </p>
              <div className="flex justify-center gap-3 text-xs text-gray-500">
                <a href="#" className="hover:text-gray-800">
                  Privacy
                </a>
                <span>•</span>
                <a href="#" className="hover:text-gray-800">
                  Terms
                </a>
                <span>•</span>
                <a href="#" className="hover:text-gray-800">
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
