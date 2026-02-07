import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Icons
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

const IconDollarSign = () => (
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
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

function DoctorAppointmentsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    if (!user || user.role !== "doctor") {
      navigate("/login");
      return;
    }
    fetchAppointments();
  }, [user, navigate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/doctor-appointments/getDoctorAppointments",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      const appointments = data.appointments || [];
      setAppointments(appointments);

      // Calculate stats
      const stats = {
        pending: appointments.filter((a) => a.status === "pending").length,
        confirmed: appointments.filter((a) => a.status === "confirmed").length,
        completed: appointments.filter((a) => a.status === "completed").length,
        cancelled: appointments.filter((a) => a.status === "cancelled").length,
      };
      setStats(stats);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError(error.message);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint =
        newStatus === "completed"
          ? "completeAppointment"
          : newStatus === "confirmed"
            ? "confirmAppointment"
            : "rejectAppointment";

      const response = await fetch(
        `http://localhost:3000/doctor-appointments/${endpoint}/${appointmentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to update appointment");

      const data = await response.json();
      setAppointments((prev) =>
        prev.map((apt) => (apt._id === appointmentId ? data.appointment : apt)),
      );
      toast.success(`Appointment ${newStatus} successfully`);
      fetchAppointments();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const StatCard = ({ label, value, color }) => (
    <div className={`${color} rounded-lg p-6 text-white`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );

  const filteredAppointments =
    statusFilter === "all"
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Appointments
          </h1>
          <p className="text-gray-600">Manage your patient appointments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Pending" value={stats.pending} color="bg-blue-500" />
          <StatCard
            label="Confirmed"
            value={stats.confirmed}
            color="bg-green-500"
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            color="bg-purple-500"
          />
          <StatCard
            label="Cancelled"
            value={stats.cancelled}
            color="bg-red-500"
          />
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-4">
          {["all", "pending", "confirmed", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  statusFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ),
          )}
        </div>

        {/* Appointments List */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Patient */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                    {apt.user?.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {apt.user?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {apt.user?.email}
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex items-center gap-2">
                  <IconCalendar />
                  <div>
                    <div className="font-medium">
                      {new Date(apt.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(apt.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <div className="text-sm text-gray-600">
                    Reason: <span className="font-medium">{apt.reason}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <IconDollarSign />
                  <div>
                    <div className="font-semibold">${apt.price || 150}</div>
                    <div className="text-xs text-gray-500">
                      Consultation Fee
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {apt.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(apt._id, "confirmed")}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(apt._id, "cancelled")}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {apt.status === "confirmed" && (
                    <button
                      onClick={() => handleStatusUpdate(apt._id, "completed")}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      Complete
                    </button>
                  )}
                  <span
                    className={`px-3 py-1 text-sm rounded font-medium ${
                      apt.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : apt.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : apt.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <IconCalendar />
              <p className="text-gray-600 mt-4">No appointments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorAppointmentsPage;
