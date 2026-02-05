/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function MyAppointments() {
  const {  logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  // Fetch appointments on mount
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      setAccessDenied(false);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAccessDenied(true);
          throw new Error("Authentication required");
        }

        const res = await fetch(
          "http://localhost:5000/appointments/getAppointment",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // Handle authentication errors
        if (res.status === 401 || res.status === 403) {
          setAccessDenied(true);
          localStorage.removeItem("token");
          if (logout) logout();
          throw new Error("Session expired. Please log in again.");
        }

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Failed to load appointments (Status: ${res.status})`,
          );
        }

        const data = await res.json();
        console.log("Fetched appointments:", data);

        if (!Array.isArray(data.appointment)) {
          throw new Error("Unexpected data format received from server");
        }

        // Sort appointments (upcoming first, then by date)
        const sorted = [...data.appointment].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          const now = new Date();

          const isUpcomingA = dateA >= now;
          const isUpcomingB = dateB >= now;

          if (isUpcomingA !== isUpcomingB) return isUpcomingB ? 1 : -1;
          return dateA - dateB;
        });

        setAppointments(sorted);
      } catch (err) {
        console.error("Fetch appointments error:", err);

        if (!accessDenied) {
          const errorMsg =
            err.message ||
            "Failed to load appointments. Please try again later.";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [logout]);

  // Cancel appointment handler
  const cancelAppointment = async (id) => {
    const appointment = appointments.find((app) => app._id === id);
    if (!appointment) return;

    // Prevent cancellation of past appointments
    if (new Date(appointment.date) < new Date()) {
      toast.info("Cannot cancel appointments that have already occurred");
      return;
    }

    // Enhanced confirmation
    const doctorName = appointment.doctor?.name || "Unknown Doctor";
    const formattedDate = new Date(appointment.date).toLocaleString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (
      !window.confirm(
        `Cancel appointment with Dr. ${doctorName}?\n` +
          `Date: ${formattedDate}\n` +
          `Reason: ${appointment.reason || "N/A"}\n\n` +
          "This action cannot be undone.",
      )
    ) {
      return;
    }

    setCancellingId(id);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Session expired. Please log in again.");

      const res = await fetch(
        `http://localhost:5000/appointments/deleteAppoitement/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message || "Failed to cancel appointment. Please try again.",
        );
      }

      // Optimistic UI update
      setAppointments((prev) => prev.filter((app) => app._id !== id));
      toast.success("✅ Appointment cancelled successfully!");
    } catch (err) {
      console.error("Cancel appointment error:", err);
      toast.error(
        err.message || "Failed to cancel appointment. Please try again.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  // Format date with validation
  const formatAppointmentDate = (dateString) => {
    if (!dateString) return { valid: false, display: "Invalid date" };

    const date = new Date(dateString);
    if (isNaN(date)) return { valid: false, display: "Invalid date" };

    const isPast = date < new Date();
    const display = date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return { valid: true, display, isPast };
  };

  // Get time until appointment
  const getTimeUntil = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date - now;

    if (diff < 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `in ${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `in ${hours} hour${hours > 1 ? "s" : ""}`;
    return "soon";
  };

  // ===== ACCESS DENIED VIEW =====
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-10 text-center border border-blue-100">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-50 mb-6 border-2 border-blue-200">
            <svg
              className="h-10 w-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Please sign in to view and manage your medical appointments
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-md text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Sign In
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full px-6 py-3 border border-blue-300 rounded-xl text-base font-semibold text-blue-700 bg-white hover:bg-blue-50 transition-all"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md w-full border border-blue-100">
          <div className="relative mb-6">
            <svg
              className="w-16 h-16 text-blue-600 animate-spin mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Loading Your Appointments
          </h2>
          <p className="text-gray-600">
            Please wait while we retrieve your medical schedule...
          </p>
        </div>
      </div>
    );
  }

  // ===== MAIN VIEW =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-blue-600 shadow-md mr-4">
              <svg
                className="h-7 w-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                My Appointments
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage your medical appointments
              </p>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-5 mb-6 shadow-sm">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">
                  Error Loading Appointments
                </h3>
                <p className="text-red-700 text-sm">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 text-sm font-medium text-red-600 hover:text-red-800 underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-2xl border-2 border-dashed border-blue-200 shadow-sm p-16 text-center">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-50 mb-6 border-2 border-blue-200">
                <svg
                  className="h-10 w-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                No Appointments Scheduled
              </h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
                You don't have any appointments yet. Schedule your first medical
                visit today.
              </p>
              <button
                onClick={() => navigate("/add-appointment")}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-semibold rounded-xl shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Schedule New Appointment
              </button>
            </div>
          ) : (
            // Appointment Cards
            <>
              {appointments.map((app) => {
                const {  display, isPast } = formatAppointmentDate(
                  app.date,
                );
                const isCancelling = cancellingId === app._id;
                const doctorName = app?.doctor?.name || "Unknown Doctor";
                const doctorSpecialty =
                  app?.doctor?.specialty || "General Practice";
                const doctorImage = app?.doctor?.image;
                const timeUntil = getTimeUntil(app.date);

                return (
                  <div
                    key={app._id}
                    className={`bg-white rounded-xl shadow-md border transition-all duration-200 overflow-hidden ${
                      isPast
                        ? "border-gray-200 opacity-75"
                        : "border-blue-100 hover:shadow-lg hover:border-blue-200"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Left Section - Doctor Info */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start space-x-4">
                          {/* Doctor Avatar */}
                          <div className="flex-shrink-0">
                            {doctorImage ? (
                              <img
                                className={`w-20 h-20 rounded-xl object-cover border-2 shadow-sm ${
                                  isPast ? "border-gray-200" : "border-blue-200"
                                }`}
                                src={`http://localhost:5000/pic-uploads/${doctorImage}`}
                                alt={doctorName}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorName)}&background=2563eb&color=fff&size=128`;
                                }}
                              />
                            ) : (
                              <div
                                className={`w-20 h-20 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-sm ${
                                  isPast ? "bg-gray-400" : "bg-blue-600"
                                }`}
                              >
                                {doctorName.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>

                          {/* Doctor Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <h3 className="text-xl font-bold text-gray-900">
                                Dr. {doctorName}
                              </h3>
                              {isPast ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Completed
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                                  Upcoming
                                </span>
                              )}
                            </div>

                            {doctorSpecialty && (
                              <div className="mb-4">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
                                    isPast
                                      ? "bg-gray-100 text-gray-700"
                                      : "bg-blue-50 text-blue-700"
                                  }`}
                                >
                                  <svg
                                    className="w-4 h-4 mr-1.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                  </svg>
                                  {doctorSpecialty}
                                </span>
                              </div>
                            )}

                            {/* Appointment Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                              {/* Date & Time */}
                              <div
                                className={`flex items-center p-3 rounded-lg ${
                                  isPast ? "bg-gray-50" : "bg-blue-50"
                                }`}
                              >
                                <svg
                                  className={`w-5 h-5 mr-3 flex-shrink-0 ${
                                    isPast ? "text-gray-500" : "text-blue-600"
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Date & Time
                                  </p>
                                  <p
                                    className={`font-semibold text-sm mt-0.5 ${
                                      isPast ? "text-gray-600" : "text-gray-900"
                                    }`}
                                  >
                                    {display}
                                  </p>
                                  {!isPast && timeUntil && (
                                    <p className="text-xs text-blue-600 font-medium mt-0.5">
                                      {timeUntil}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Reason */}
                              <div
                                className={`flex items-center p-3 rounded-lg ${
                                  isPast ? "bg-gray-50" : "bg-blue-50"
                                }`}
                              >
                                <svg
                                  className={`w-5 h-5 mr-3 flex-shrink-0 ${
                                    isPast ? "text-gray-500" : "text-blue-600"
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Reason
                                  </p>
                                  <p
                                    className={`font-semibold text-sm mt-0.5 ${
                                      isPast ? "text-gray-600" : "text-gray-900"
                                    }`}
                                  >
                                    {app?.reason || "Not specified"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Actions */}
                      <div
                        className={`flex lg:flex-col items-center justify-center p-6 lg:w-44 border-t lg:border-t-0 lg:border-l ${
                          isPast
                            ? "bg-gray-50 border-gray-200"
                            : "bg-blue-50 border-blue-100"
                        }`}
                      >
                        <button
                          onClick={() => cancelAppointment(app._id)}
                          disabled={isPast || isCancelling}
                          className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center min-w-[120px] ${
                            isPast
                              ? "bg-gray-200 cursor-not-allowed text-gray-500"
                              : isCancelling
                                ? "bg-red-200 cursor-wait text-red-700"
                                : "bg-white hover:bg-red-50 border border-red-200 hover:border-red-300 shadow-sm hover:shadow text-red-600 font-medium"
                          }`}
                        >
                          {isCancelling ? (
                            <>
                              <svg
                                className="w-5 h-5 text-red-600 animate-spin mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              <span className="text-sm">Cancelling...</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              <span className="text-sm font-semibold">
                                {isPast ? "Cancelled" : "Cancel"}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Summary Footer */}
        {appointments.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-blue-100 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Status Legend */}
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm font-medium text-gray-700">
                    Upcoming
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                  <span className="text-sm font-medium text-gray-700">
                    Completed
                  </span>
                </div>
              </div>

              {/* Appointment Count */}
              <div className="flex items-center px-6 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="text-sm font-semibold text-blue-900">
                  {appointments.length} Total Appointment
                  {appointments.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAppointments;
