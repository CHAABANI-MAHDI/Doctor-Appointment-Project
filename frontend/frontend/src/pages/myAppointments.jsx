import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Trash2,
  Loader,
  AlertCircle,
  Calendar,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";

// Color Palette Constants (Professional Blue Spectrum)
const COLORS = {
  primary: "#0066CC", // Deep trustworthy blue
  secondary: "#00A8E8", // Vibrant accent blue
  light: "#E6F4FF", // Soft background blue
  lighter: "#F5FAFF", // Card background
  dark: "#003D7A", // Text/dark elements
  success: "#00C896", // Status indicators
  warning: "#FFAA00", // Past appointments
  error: "#FF4D4F", // Cancel actions
};

function MyAppointments() {
  const { user, logout } = useContext(AuthContext);
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
          "http://localhost:5000/appointments/getAppointments",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // Handle authentication errors
        if (res.status === 401 || res.status === 403) {
          setAccessDenied(true);
          localStorage.removeItem("token");
          if (logout) logout(); // Trigger global logout if available
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
        if (!Array.isArray(data)) {
          throw new Error("Unexpected data format received from server");
        }

        // Sort appointments: upcoming first (chronological), then past
        const sorted = [...data].sort((a, b) => {
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

        // Only set generic error if not access denied
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

    // Enhanced confirmation with appointment details
    const formattedDate = new Date(appointment.date).toLocaleString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (
      !window.confirm(
        `Cancel appointment with Dr. ${appointment.doctor?.name || "Unknown"}?\n` +
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
        `http://localhost:5000/appointments/deleteAppointment/${id}`,
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

  // Format date with validation and visual indicator
  const formatAppointmentDate = (dateString) => {
    if (!dateString) return { valid: false, display: "Invalid date" };

    const date = new Date(dateString);
    if (isNaN(date)) return { valid: false, display: "Invalid date" };

    const isPast = date < new Date();
    const display = date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return { valid: true, display, isPast };
  };

  // ===== ACCESS DENIED VIEW =====
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center border border-blue-100">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mb-6">
            <Lock className="h-8 w-8 text-blue-600" strokeWidth={1.5} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Restricted
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to view your appointments. <br />
            Your session may have expired or you lack required permissions.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => {
                if (logout) logout();
                window.location.href = "/login";
              }}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go to Login
            </button>

            <button
              onClick={() => window.history.back()}
              className="w-full px-6 py-3 border border-blue-200 rounded-lg text-base font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition-colors"
            >
              Go Back
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-blue-100">
            <p className="text-sm text-gray-500">
              Need help? Contact support at <br />
              <a
                href="mailto:support@clinic.com"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                support@clinic.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full border border-blue-100">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
            <Loader
              className="w-16 h-16 text-blue-600 animate-spin mx-auto relative"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Loading Your Appointments
          </h2>
          <p className="text-gray-600">
            Please wait while we securely fetch your schedule
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-24 h-1 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 animate-pulse rounded-full w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== MAIN VIEW =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <Calendar className="h-6 w-6 text-blue-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-600">
            My Appointments
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your upcoming and past appointments with our healthcare
            providers
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div
            role="alert"
            className="bg-red-50 border-l-4 border-red-500 p-5 rounded-xl mb-10 shadow-sm"
          >
            <div className="flex items-start">
              <AlertCircle
                className="w-6 h-6 text-red-500 mt-1 flex-shrink-0 mr-3"
                strokeWidth={1.5}
              />
              <div>
                <h3 className="font-bold text-red-800">
                  Appointment Loading Error
                </h3>
                <p className="text-red-700 mt-1">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800"
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appointments List */}
        <div className="space-y-6">
          {appointments.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-10 md:p-16 text-center transition-all duration-300 hover:shadow-md">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-blue-50 mb-6 mx-auto">
                <Calendar
                  className="h-10 w-10 text-blue-600"
                  strokeWidth={1.5}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                No Appointments Found
              </h2>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                You don't have any scheduled appointments yet. Book your first
                appointment to get started!
              </p>
              <button
                onClick={() => (window.location.href = "/book-appointment")}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book New Appointment
              </button>
            </div>
          ) : (
            // Appointment Cards
            appointments.map((app) => {
              const { valid, display, isPast } = formatAppointmentDate(
                app.date,
              );
              const isCancelling = cancellingId === app._id;
              const doctorName = app?.doctor?.name || "Unknown Doctor";

              return (
                <div
                  key={app._id}
                  role="listitem"
                  className={`flex flex-col md:flex-row items-start md:items-center justify-between bg-white rounded-xl p-5 shadow-sm border transition-all duration-200 ${
                    isPast
                      ? "border-gray-200 hover:shadow"
                      : "border-blue-200 hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex items-start w-full md:w-auto mb-4 md:mb-0 flex-1 min-w-0">
                    <div className="flex-shrink-0 relative">
                      <div
                        className={`absolute -inset-1 bg-gradient-to-r ${isPast ? "from-gray-200 to-gray-300" : "from-blue-300 to-blue-400"} rounded-full opacity-20 blur animate-pulse`}
                      ></div>
                      <img
                        className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 ${
                          isPast ? "border-gray-300" : "border-blue-400"
                        } shadow-sm`}
                        src={
                          app?.doctor?.image
                            ? `http://localhost:5000/pic-uploads/${app.doctor.image}`
                            : `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath fill='${COLORS.primary}' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.5c-2.33 0-4.32-1.45-5.12-3.5h1.67c.69 1.19 1.97 2 3.45 2s2.75-.81 3.45-2h1.67c-.8 2.05-2.79 3.5-5.12 3.5z'/%3E%3C/svg%3E`
                        }
                        alt={doctorName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath fill='${COLORS.primary}' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.5c-2.33 0-4.32-1.45-5.12-3.5h1.67c.69 1.19 1.97 2 3.45 2s2.75-.81 3.45-2h1.67c-.8 2.05-2.79 3.5-5.12 3.5z'/%3E%3C/svg%3E`;
                        }}
                      />
                      {!isPast && (
                        <span className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white rounded-full w-3 h-3 shadow-md"></span>
                      )}
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <h3
                          className="text-xl font-bold text-gray-900 truncate"
                          title={doctorName}
                        >
                          Dr. {doctorName}
                        </h3>
                        {app?.doctor?.specialty && (
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              isPast
                                ? "bg-gray-100 text-gray-700"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {app.doctor.specialty}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-4 text-gray-700">
                        <div className="flex items-start sm:items-center mb-2 sm:mb-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 flex-shrink-0 mr-2">
                            Reason
                          </span>
                          <span className="text-sm">
                            {app?.reason || "Not specified"}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <Calendar
                            className={`w-4 h-4 mr-1.5 flex-shrink-0 ${
                              isPast ? "text-gray-400" : "text-blue-600"
                            }`}
                            strokeWidth={1.5}
                          />
                          <span
                            className={`font-medium text-sm ${
                              isPast
                                ? "text-gray-500 line-through"
                                : "text-blue-700"
                            }`}
                            title={
                              valid
                                ? new Date(app.date).toISOString()
                                : undefined
                            }
                          >
                            {display}
                          </span>
                          {isPast && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1"></span>
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 mt-4 md:mt-0">
                    <button
                      onClick={() => cancelAppointment(app._id)}
                      disabled={isPast || isCancelling}
                      aria-label={`Cancel appointment with Dr. ${doctorName} on ${display}`}
                      title={
                        isPast
                          ? "Cannot cancel past appointments"
                          : "Cancel appointment"
                      }
                      className={`group relative p-3 rounded-lg transition-all duration-200 flex flex-col items-center min-w-[72px] ${
                        isPast
                          ? "bg-gray-100 cursor-not-allowed"
                          : isCancelling
                            ? "bg-red-100 cursor-wait"
                            : "bg-red-50 hover:bg-red-100 border border-red-200"
                      }`}
                    >
                      {isCancelling ? (
                        <Loader
                          className="w-5 h-5 text-red-500 animate-spin"
                          strokeWidth={2}
                        />
                      ) : (
                        <>
                          <Trash2
                            className={`w-5 h-5 mb-1 ${
                              isPast
                                ? "text-gray-400"
                                : "text-red-500 group-hover:text-red-600"
                            } transition-colors`}
                            strokeWidth={1.5}
                          />
                          <span
                            className={`text-xs font-medium ${
                              isPast ? "text-gray-400" : "text-red-700"
                            }`}
                          >
                            Cancel
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Status Legend */}
        {appointments.length > 0 && (
          <div className="mt-12 pt-8 border-t border-blue-100 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center bg-blue-50 rounded-full px-4 py-2">
              <div className="flex items-center mr-6">
                <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full mr-2 border border-white shadow-sm"></span>
                <span className="text-sm font-medium text-blue-800">
                  Upcoming
                </span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-2.5 h-2.5 bg-gray-400 rounded-full mr-2"></span>
                <span className="text-sm font-medium text-gray-600">Past</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAppointments;
