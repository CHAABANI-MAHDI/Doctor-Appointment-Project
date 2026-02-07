import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Custom SVG icons (reusing from above)
const IconCalendar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const IconClock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconUser = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const IconXCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const IconCheckCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const IconAlertCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const IconChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const IconSearch = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const IconDownload = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const IconChevronDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const IconFileText = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const IconShield = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const IconHeart = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const IconBrain = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 2.5 2.5 0 0 1 2.46-3.86H9.5V2z"></path>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 2.5 2.5 0 0 0-2.46-3.86H14.5V2z"></path>
  </svg>
);

const IconBone = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5l7-7z"></path>
  </svg>
);

const IconBaby = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12h.01"></path>
    <path d="M15 12h.01"></path>
    <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"></path>
    <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path>
  </svg>
);

const IconThermometer = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
  </svg>
);

function MyAppointments() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

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
          "http://localhost:3000/appointments/getAppointment",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

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

        if (!Array.isArray(data.appointment)) {
          throw new Error("Unexpected data format received from server");
        }

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
        setFilteredAppointments(sorted);
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
  }, [logout, accessDenied]);

  useEffect(() => {
    let filtered = appointments;

    if (filter === "upcoming") {
      filtered = filtered.filter((app) => new Date(app.date) >= new Date());
    } else if (filter === "past") {
      filtered = filtered.filter((app) => new Date(app.date) < new Date());
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.doctor?.name?.toLowerCase().includes(query) ||
          app.doctor?.specialty?.toLowerCase().includes(query) ||
          app.reason?.toLowerCase().includes(query) ||
          app.date?.toLowerCase().includes(query),
      );
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchQuery, filter]);

  const totalAppointments = appointments.length;
  const upcomingAppointments = appointments.filter(
    (app) => new Date(app.date) >= new Date(),
  ).length;
  const completedAppointments = appointments.filter(
    (app) => new Date(app.date) < new Date(),
  ).length;
  const within24hAppointments = appointments.filter((app) => {
    const date = new Date(app.date);
    const now = new Date();
    const hoursUntil = Math.floor((date - now) / (1000 * 60 * 60));
    return date >= now && hoursUntil < 24;
  }).length;

  const openCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  const cancelAppointment = async () => {
    if (!selectedAppointment) return;

    const appointment = selectedAppointment;
    const id = appointment._id;

    if (new Date(appointment.date) < new Date()) {
      toast.info("Cannot cancel appointments that have already occurred");
      closeCancelModal();
      return;
    }

    setCancellingId(id);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Session expired. Please log in again.");

      const res = await fetch(
        `http://localhost:3000/appointments/deleteAppoitement/${id}`,
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

      setAppointments((prev) => prev.filter((app) => app._id !== id));
      toast.success("✅ Appointment cancelled successfully!");
    } catch (err) {
      console.error("Cancel appointment error:", err);
      toast.error(
        err.message || "Failed to cancel appointment. Please try again.",
      );
    } finally {
      setCancellingId(null);
      closeCancelModal();
    }
  };

  const formatAppointmentDate = (dateString) => {
    if (!dateString) return { valid: false, display: "Invalid date" };

    const date = new Date(dateString);
    if (isNaN(date)) return { valid: false, display: "Invalid date" };

    const isPast = date < new Date();
    const isToday = date.toDateString() === new Date().toDateString();

    let display = date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) {
      display = `Today, ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return { valid: true, display, isPast, isToday };
  };

  const getTimeUntil = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date - now;

    if (diff < 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getAppointmentStatus = (appointment) => {
    const date = new Date(appointment.date);
    const now = new Date();

    if (date < now) {
      return {
        type: "completed",
        label: "Completed",
        color: "bg-gray-100 text-gray-700",
        icon: <IconCheckCircle />,
      };
    }

    const timeUntil = getTimeUntil(appointment.date);
    const hoursUntil = Math.floor((date - now) / (1000 * 60 * 60));

    if (hoursUntil < 24) {
      return {
        type: "upcoming",
        label: "Soon",
        color: "bg-orange-100 text-orange-700",
        icon: <IconAlertCircle />,
      };
    }

    return {
      type: "upcoming",
      label: "Upcoming",
      color: "bg-green-100 text-green-700",
      icon: <IconCheckCircle />,
    };
  };

  const getSpecialtyIcon = (specialty) => {
    const icons = {
      Cardiology: <IconHeart />,
      Neurology: <IconBrain />,
      Orthopedics: <IconBone />,
      Pediatrics: <IconBaby />,
      "General Practice": <IconThermometer />,
    };
    return icons[specialty] || <IconUser />;
  };

  const exportAppointments = () => {
    const data = filteredAppointments.map((app) => ({
      Doctor: `Dr. ${app.doctor?.name || "Unknown"}`,
      Specialty: app.doctor?.specialty || "General Practice",
      Date: new Date(app.date).toLocaleString(),
      Reason: app.reason || "Not specified",
      Status: getAppointmentStatus(app).label,
    }));

    const csvContent = [
      Object.keys(data[0]).join(","),
      ...data.map((row) =>
        Object.values(row)
          .map((val) => `"${val}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointments_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Appointments exported successfully!");
  };

  const getDoctorImageUrl = (doctor) => {
    if (!doctor) return null;

    if (doctor.image) {
      const cleanImage = doctor.image.replace(/^[\\/]+/, "");
      return `http://localhost:3000/${cleanImage}`;
    }
    return null;
  };

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-10 text-center border border-blue-100">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-50 mb-6 border-2 border-blue-200">
            <IconShield />
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <IconCalendar />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Loading Your Appointments
            </h2>
            <p className="text-gray-600">
              Please wait while we retrieve your medical schedule...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Stats Cards at the Top */}
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Total Appointments */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-700">
                  {totalAppointments}
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  Total Appointments
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <IconCalendar />
              </div>
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-700">
                  {upcomingAppointments}
                </div>
                <div className="text-sm text-green-600 mt-1">Upcoming</div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <IconCheckCircle />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-700">
                  {completedAppointments}
                </div>
                <div className="text-sm text-gray-600 mt-1">Completed</div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gray-500/20 flex items-center justify-center">
                <IconCheckCircle />
              </div>
            </div>
          </div>

          {/* Within 24h */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-orange-700">
                  {within24hAppointments}
                </div>
                <div className="text-sm text-orange-600 mt-1">Within 24h</div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <IconClock />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  My Appointments
                </h1>
                <p className="text-gray-600">
                  View and manage all your medical appointments
                </p>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="relative max-w-md">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <IconSearch />
                    </div>
                    <input
                      type="text"
                      placeholder="Search appointments by doctor, specialty, or reason..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* View Toggle */}
                  <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-2 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
                    >
                      List
                    </button>
                  </div>

                  {/* Filter Dropdown */}
                  <div className="relative">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Appointments</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="past">Past</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <IconChevronDown />
                    </div>
                  </div>

                  {/* Export Button */}
                  <button
                    onClick={exportAppointments}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <IconDownload />
                    <span className="ml-2 hidden sm:inline">Export</span>
                  </button>
                </div>
              </div>

              {/* Filter Chips */}
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  All ({totalAppointments})
                </button>
                <button
                  onClick={() => setFilter("upcoming")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${filter === "upcoming" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  Upcoming ({upcomingAppointments})
                </button>
                <button
                  onClick={() => setFilter("past")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${filter === "past" ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  Past ({completedAppointments})
                </button>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-5 shadow-sm">
              <div className="flex items-start">
                <IconAlertCircle />
                <div className="flex-1 ml-3">
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

          {/* Appointments Grid/List */}
          {filteredAppointments.length === 0 ? (
            // Empty State
            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-blue-200 shadow-sm p-16 text-center">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 mb-6 border-2 border-blue-200">
                <IconCalendar />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                No Appointments Found
              </h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
                {searchQuery || filter !== "all"
                  ? "No appointments match your search criteria. Try adjusting your filters."
                  : "You don't have any appointments yet. Schedule your first medical visit today."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilter("all");
                  }}
                  className="px-6 py-3 border border-blue-300 rounded-xl text-base font-semibold text-blue-700 bg-white hover:bg-blue-50 transition-all"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => navigate("/add-appointment")}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-semibold rounded-xl shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  <IconCalendar />
                  <span className="ml-2">Schedule New Appointment</span>
                </button>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAppointments.map((app) => {
                const { display, isPast, isToday } = formatAppointmentDate(
                  app.date,
                );
                const status = getAppointmentStatus(app);
                const timeUntil = getTimeUntil(app.date);
                const doctorName = app?.doctor?.name || "Unknown Doctor";
                const doctorSpecialty =
                  app?.doctor?.specialty || "General Practice";
                const doctorImageUrl = getDoctorImageUrl(app.doctor);

                return (
                  <div
                    key={app._id}
                    className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden hover:shadow-md ${isPast ? "border-gray-200" : "border-blue-100"}`}
                  >
                    {/* Card Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {doctorImageUrl ? (
                            <img
                              src={doctorImageUrl}
                              alt={doctorName}
                              className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  doctorName,
                                )}&background=2563eb&color=fff&size=128`;
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-bold">
                              {doctorName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-gray-900">
                              Dr. {doctorName}
                            </h3>
                            <p className="text-sm text-blue-600">
                              {doctorSpecialty}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
                        >
                          {status.icon}
                          <span className="ml-1.5">{status.label}</span>
                        </div>
                      </div>

                      {/* Appointment Info */}
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <IconCalendar />
                          <span className="text-sm ml-3">{display}</span>
                          {isToday && (
                            <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              Today
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <IconClock />
                          <span className="text-sm ml-3">
                            {timeUntil ? `${timeUntil} remaining` : "Completed"}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <IconFileText />
                          <span className="text-sm ml-3 truncate">
                            {app.reason || "General checkup"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-6 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() =>
                            setExpandedCard(
                              expandedCard === app._id ? null : app._id,
                            )
                          }
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          {expandedCard === app._id
                            ? "Show Less"
                            : "View Details"}
                          <IconChevronRight
                            className={`w-4 h-4 ml-1 transition-transform ${expandedCard === app._id ? "rotate-90" : ""}`}
                          />
                        </button>
                        <div className="flex items-center space-x-2">
                          {!isPast && (
                            <button
                              onClick={() => openCancelModal(app)}
                              disabled={cancellingId === app._id}
                              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              {cancellingId === app._id
                                ? "Cancelling..."
                                : "Cancel"}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedCard === app._id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">
                                Appointment ID
                              </span>
                              <span className="text-sm font-mono text-gray-700">
                                {app._id?.slice(-8) || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">
                                Duration
                              </span>
                              <span className="text-sm text-gray-700">
                                30 minutes
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">
                                Consultation Fee
                              </span>
                              <span className="text-sm font-semibold text-gray-900">
                                $125
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {filteredAppointments.map((app) => {
                const { display, isPast, isToday } = formatAppointmentDate(
                  app.date,
                );
                const status = getAppointmentStatus(app);
                const timeUntil = getTimeUntil(app.date);
                const doctorName = app?.doctor?.name || "Unknown Doctor";
                const doctorSpecialty =
                  app?.doctor?.specialty || "General Practice";
                const doctorImageUrl = getDoctorImageUrl(app.doctor);

                return (
                  <div
                    key={app._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Left Section - Date & Status */}
                      <div className="md:w-48 p-6 bg-gray-50 border-r border-gray-200 flex flex-col items-center justify-center">
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold text-gray-900">
                            {new Date(app.date).getDate()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(app.date).toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </div>
                        </div>
                        <div
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${status.color}`}
                        >
                          {status.icon}
                          <span className="ml-1.5">{status.label}</span>
                        </div>
                        {timeUntil && !isPast && (
                          <div className="mt-3 text-sm text-blue-600 font-medium">
                            {timeUntil} remaining
                          </div>
                        )}
                      </div>

                      {/* Middle Section - Doctor & Details */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {doctorImageUrl ? (
                              <img
                                src={doctorImageUrl}
                                alt={doctorName}
                                className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    doctorName,
                                  )}&background=2563eb&color=fff&size=128`;
                                }}
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
                                {doctorName.charAt(0)}
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <h3 className="text-lg font-bold text-gray-900">
                                Dr. {doctorName}
                              </h3>
                              <div className="flex items-center text-sm text-gray-600">
                                {getSpecialtyIcon(doctorSpecialty)}
                                <span className="ml-2">{doctorSpecialty}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center">
                                <IconCalendar />
                                <div className="ml-3">
                                  <div className="text-sm text-gray-500">
                                    Date & Time
                                  </div>
                                  <div className="font-medium text-gray-900">
                                    {display}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <IconFileText />
                                <div className="ml-3">
                                  <div className="text-sm text-gray-500">
                                    Reason
                                  </div>
                                  <div className="font-medium text-gray-900">
                                    {app.reason || "General checkup"}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Additional Info */}
                            {expandedCard === app._id && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-sm text-gray-500">
                                      Appointment ID
                                    </div>
                                    <div className="font-mono text-sm text-gray-700">
                                      {app._id?.slice(-8) || "N/A"}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-500">
                                      Consultation Fee
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                      $125
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Actions */}
                      <div className="p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col justify-center items-center md:w-32">
                        <div className="space-y-3">
                          <button
                            onClick={() =>
                              setExpandedCard(
                                expandedCard === app._id ? null : app._id,
                              )
                            }
                            className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            {expandedCard === app._id
                              ? "Show Less"
                              : "View Details"}
                          </button>
                          {!isPast && (
                            <button
                              onClick={() => openCancelModal(app)}
                              disabled={cancellingId === app._id}
                              className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${cancellingId === app._id ? "bg-red-100 text-red-700 cursor-wait" : "text-red-600 hover:text-red-800 hover:bg-red-50"}`}
                            >
                              {cancellingId === app._id
                                ? "Cancelling..."
                                : "Cancel"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Appointment Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <IconXCircle />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">
                Cancel Appointment
              </h3>
              <p className="text-center text-red-100">
                Are you sure you want to cancel this appointment?
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-bold mr-4">
                    {selectedAppointment.doctor?.name?.charAt(0) || "D"}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Dr. {selectedAppointment.doctor?.name || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedAppointment.doctor?.specialty ||
                        "General Practice"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="font-semibold">
                      {formatAppointmentDate(selectedAppointment.date).display}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reason:</span>
                    <span className="font-semibold">
                      {selectedAppointment.reason || "General checkup"}
                    </span>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                  <div className="flex items-start">
                    <IconAlertCircle />
                    <div className="text-sm text-yellow-800 ml-3">
                      <strong className="font-semibold">Note:</strong>{" "}
                      Cancellations made less than 24 hours before the
                      appointment may be subject to a fee.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelAppointment}
                  disabled={cancellingId === selectedAppointment._id}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancellingId === selectedAppointment._id ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Cancelling...
                    </span>
                  ) : (
                    "Yes, Cancel Appointment"
                  )}
                </button>
                <button
                  onClick={closeCancelModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={cancellingId === selectedAppointment._id}
                >
                  No, Keep Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAppointments;
