/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "user",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      role: "",
      general: "",
    });

    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      role: "",
      general: "",
    };
    let hasErrors = false;

    if (!form.name) {
      newErrors.name = "Name is required";
      hasErrors = true;
    }

    if (!form.email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Invalid email";
      hasErrors = true;
    }

    if (!form.phone) {
      newErrors.phone = "Phone number is required";
      hasErrors = true;
    } else if (form.phone.length < 8) {
      newErrors.phone = "Phone number must be at least 8 digits";
      hasErrors = true;
    }

    if (!form.role) {
      newErrors.role = "Please select a role";
      hasErrors = true;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasErrors = true;
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      hasErrors = true;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch {
      setErrors({
        ...newErrors,
        general: "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 overflow-hidden p-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
          {/* Header Gradient */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-blue-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 right-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
            </div>
            <div className="relative h-full flex items-end justify-center pb-6">
              <div>
                <h1 className="text-4xl font-bold text-white">🏥 MediCare</h1>
                <p className="text-blue-100 text-sm">
                  Join Our Healthcare Network
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Error */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  👤 Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={isLoading}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all disabled:bg-gray-50"
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  📧 Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={isLoading}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all disabled:bg-gray-50"
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  📱 Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  disabled={isLoading}
                  placeholder="+216 XX XXX XXX"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all disabled:bg-gray-50"
                />
                {errors.phone && (
                  <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">
                  {form.role === "doctor"
                    ? "⚕️ Register As Doctor"
                    : "👤 Register As Patient"}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "user" })}
                    className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                      form.role === "user"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">👤</div>
                    <p className="font-semibold text-sm text-gray-900">
                      Patient
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Book appointments
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "doctor" })}
                    className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                      form.role === "doctor"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">⚕️</div>
                    <p className="font-semibold text-sm text-gray-900">
                      Doctor
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Manage patients
                    </p>
                  </button>
                </div>
                {errors.role && (
                  <p className="text-xs text-red-600 mt-1">{errors.role}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all disabled:bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  🔒 Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    disabled={isLoading}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all disabled:bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <input type="checkbox" className="mt-1.5" required />
                <label className="text-xs text-gray-600">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-gray-600 mt-6 pt-4 border-t border-gray-200">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
