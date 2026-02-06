import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import {
  Calendar,
  Clock,
  User,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  RefreshCw,
  FileText,
  Shield,
} from "lucide-react";

const AppointmentsPage = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    today: 0,
    upcoming: 0,
  });

  // Check if user has admin/staff role
  const isAdminOrStaff = user?.role === "admin" || user?.role === "staff";

  useEffect(() => {
    if (isAdminOrStaff) {
      fetchAllAppointments();
    } else {
      fetchUserAppointments();
    }
  }, [isAdminOrStaff]);

  useEffect(() => {
    calculateStats();
  }, [appointments]);

  // Fetch ALL appointments (for admin/staff)
  const fetchAllAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Use admin endpoint or modify existing one to get all appointments
      const response = await fetch(
        "http://localhost:5000/appointments/getAllAppointments", // New endpoint needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Fallback to regular endpoint if admin endpoint doesn't exist
        const fallbackResponse = await fetch(
          "http://localhost:5000/appointments/getAppointment",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (!fallbackResponse.ok) {
          throw new Error("Failed to fetch appointments");
        }
        
        const fallbackData = await fallbackResponse.json();
        setAppointments(fallbackData.appointment || []);
      } else {
        const data = await response.json();
        setAppointments(data.appointments || data.appointment || []);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's own appointments
  const fetchUserAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/appointments/getAppointment",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data.appointment || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = appointments.length;
    const confirmed = appointments.filter(
      (a) => a.status === "confirmed" || a.status === "Confirmed"
    ).length;
    const pending = appointments.filter(
      (a) => a.status === "pending" || a.status === "Pending"
    ).length;
    const cancelled = appointments.filter(
      (a) => a.status === "cancelled" || a.status === "Cancelled"
    ).length;
    const completed = appointments.filter(
      (a) => a.status === "completed" || a.status === "Completed"
    ).length;
    
    const today = appointments.filter((a) => {
      const appDate = new Date(a.date);
      const todayDate = new Date();
      return appDate.toDateString() === todayDate.toDateString();
    }).length;

    const upcoming = appointments.filter((a) => {
      const appDate = new Date(a.date);
      const now = new Date();
      return appDate > now && (a.status === "pending" || a.status === "confirmed");
    }).length;

    setStats({ total, confirmed, pending, cancelled, today, upcoming, completed });
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    setUpdatingStatus(appointmentId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/appointments/updateStatus/${appointmentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === appointmentId ? { ...app, status: newStatus } : app
        )
      );

      toast.success("Appointment status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/appointments/deleteAppoitement/${appointmentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }

      // Remove from local state
      setAppointments((prev) => prev.filter((app) => app._id !== appointmentId));
      toast.success("Appointment deleted successfully");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Failed to delete appointment");
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      (appointment.patient?.name || appointment.patientName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (appointment.doctor?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (appointment.reason || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" ||
      (appointment.status || "").toLowerCase() === statusFilter.toLowerCase();

    // Date filter
    const matchesDate =
      dateFilter === "" ||
      new Date(appointment.date).toDateString() ===
        new Date(dateFilter).toDateString();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    const statusLower = (status || "").toLowerCase();
    const styles = {
      confirmed: "bg-green-100 text-green-800 border border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      cancelled: "bg-red-100 text-red-800 border border-red-200",
      completed: "bg-blue-100 text-blue-800 border border-blue-200",
    };
    return styles[statusLower] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const getStatusIcon = (status) => {
    const statusLower = (status || "").toLowerCase();
    switch (statusLower) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    
    const isToday = date.toDateString() === new Date().toDateString();
    
    if (isToday) {
      return `Today, ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDoctorImageUrl = (doctor) => {
    if (!doctor) return null;
    if (doctor.image) {
      const cleanImage = doctor.image.replace(/^[\\/]+/, "");
      return `http://localhost:5000/${cleanImage}`;
    }
    return null;
  };

  const StatCard = ({ label, value, color, icon }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm font-medium text-gray-600 mt-1">{label}</p>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>
          <div className={`${color.replace('bg-', 'text-').replace('/20', '')}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );

  const AppointmentRow = ({ appointment }) => {
    const doctorName = appointment.doctor?.name || "Unknown Doctor";
    const patientName = appointment.patient?.name || appointment.patientName || "Unknown Patient";
    const doctorImageUrl = getDoctorImageUrl(appointment.doctor);
    const status = appointment.status || "pending";

    return (
      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mr-3">
              {patientName.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {patientName}
              </div>
              <div className="text-xs text-gray-500">
                ID: {appointment._id?.slice(-6) || "N/A"}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            {doctorImageUrl ? (
              <img
                src={doctorImageUrl}
                alt={doctorName}
                className="w-10 h-10 rounded-lg object-cover border-2 border-gray-200 mr-3"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    doctorName
                  )}&background=2563eb&color=fff&size=128`;
                }}
              />
            ) : (
              <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center mr-3">
                <span className="font-bold text-green-600 text-sm">Dr</span>
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-gray-900">
                Dr. {doctorName}
              </div>
              <div className="text-xs text-gray-500">
                {appointment.doctor?.specialty || "General Practice"}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {formatDate(appointment.date)}
          </div>
          <div className="text-xs text-gray-500 flex items-center mt-1">
            <Clock className="w-3 h-3 mr-1" />
            Duration: 30 mins
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                status
              )}`}
            >
              <span className="flex items-center">
                {getStatusIcon(status)}
                <span className="ml-1.5">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </span>
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSelectedAppointment(appointment);
                setShowDetailsModal(true);
              }}
              className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors flex items-center"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            
            {isAdminOrStaff && (
              <>
                <select
                  value={status}
                  onChange={(e) =>
                    handleStatusUpdate(appointment._id, e.target.value)
                  }
                  disabled={updatingStatus === appointment._id}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
                
                <button
                  onClick={() => handleDeleteAppointment(appointment._id)}
                  className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                  title="Delete Appointment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Loading Appointments
            </h2>
            <p className="text-gray-600">
              Please wait while we retrieve appointment data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isAdminOrStaff ? "All Appointments" : "My Appointments"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isAdminOrStaff
                  ? "Manage and track all medical appointments"
                  : "View and manage your appointments"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={isAdminOrStaff ? fetchAllAppointments : fetchUserAppointments}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatCard
              label="Total Appointments"
              value={stats.total}
              color="bg-blue-100"
              icon={<Calendar className="w-6 h-6 text-blue-600" />}
            />
            <StatCard
              label="Today"
              value={stats.today}
              color="bg-green-100"
              icon={<Clock className="w-6 h-6 text-green-600" />}
            />
            <StatCard
              label="Upcoming"
              value={stats.upcoming}
              color="bg-yellow-100"
              icon={<AlertCircle className="w-6 h-6 text-yellow-600" />}
            />
            <StatCard
              label="Confirmed"
              value={stats.confirmed}
              color="bg-green-100"
              icon={<CheckCircle className="w-6 h-6 text-green-600" />}
            />
            <StatCard
              label="Cancelled"
              value={stats.cancelled}
              color="bg-red-100"
              icon={<XCircle className="w-6 h-6 text-red-600" />}
            />
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative max-w-lg">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search appointments by patient, doctor, or reason..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                </div>
                <div>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {(searchQuery || statusFilter !== "all" || dateFilter) && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setDateFilter("");
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <AppointmentRow
                      key={appointment._id}
                      appointment={appointment}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Calendar className="w-16 h-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No appointments found
                        </h3>
                        <p className="text-gray-600">
                          {searchQuery || statusFilter !== "all" || dateFilter
                            ? "No appointments match your search criteria"
                            : "There are no appointments scheduled yet"}
                        </p>
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                            setDateFilter("");
                          }}
                          className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredAppointments.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{filteredAppointments.length}</span>{" "}
              of <span className="font-medium">{appointments.length}</span>{" "}
              appointments
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg">
                1
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Appointment Details</h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Patient & Doctor Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Patient Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-600">Name</div>
                        <div className="font-medium">
                          {selectedAppointment.patient?.name || selectedAppointment.patientName || "Unknown"}
                        </div>
                      </div>
                      {selectedAppointment.patient?.email && (
                        <div>
                          <div className="text-sm text-gray-600">Email</div>
                          <div className="font-medium">
                            {selectedAppointment.patient.email}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Doctor Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-600">Name</div>
                        <div className="font-medium">
                          Dr. {selectedAppointment.doctor?.name || "Unknown"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Specialty</div>
                        <div className="font-medium">
                          {selectedAppointment.doctor?.specialty || "General Practice"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Appointment Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Date & Time</span>
                      <span className="font-medium">
                        {formatDate(selectedAppointment.date)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Reason</span>
                      <span className="font-medium text-right max-w-xs">
                        {selectedAppointment.reason || "General checkup"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          selectedAppointment.status
                        )}`}
                      >
                        <span className="flex items-center">
                          {getStatusIcon(selectedAppointment.status)}
                          <span className="ml-1.5">
                            {selectedAppointment.status?.charAt(0).toUpperCase() +
                              selectedAppointment.status?.slice(1)}
                          </span>
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Appointment ID</span>
                      <span className="font-mono text-sm">
                        {selectedAppointment._id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes Section (for admin/staff) */}
                {isAdminOrStaff && (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      placeholder="Add clinical notes or observations about this appointment..."
                      defaultValue={selectedAppointment.notes || ""}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {isAdminOrStaff && (
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
                    Save Notes
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;