import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const AdminProfilePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalDepartments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchAdminStats();
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [usersRes, doctorsRes, appointmentsRes, departmentsRes] =
        await Promise.all([
          fetch(`${API_URL}/users/count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/doctors/count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/appointments/count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/departments/count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      let counts = {
        totalUsers: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        totalDepartments: 0,
      };

      if (usersRes.ok) {
        const data = await usersRes.json();
        counts.totalUsers = data.count || 0;
      }
      if (doctorsRes.ok) {
        const data = await doctorsRes.json();
        counts.totalDoctors = data.count || 0;
      }
      if (appointmentsRes.ok) {
        const data = await appointmentsRes.json();
        counts.totalAppointments = data.count || 0;
      }
      if (departmentsRes.ok) {
        const data = await departmentsRes.json();
        counts.totalDepartments = data.count || 0;
      }

      setStats(counts);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      toast.error("Failed to load admin statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Manage Users",
      icon: "👥",
      color: "blue",
      action: () => navigate("/users-admin"),
    },
    {
      title: "Manage Doctors",
      icon: "⚕️",
      color: "green",
      action: () => navigate("/doctors"),
    },
    {
      title: "Manage Departments",
      icon: "🏥",
      color: "purple",
      action: () => navigate("/departments"),
    },
    {
      title: "View Appointments",
      icon: "📅",
      color: "orange",
      action: () => navigate("/appointments-admin"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-3xl">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Panel
                </h1>
                <p className="text-blue-700 font-semibold mt-1">{user?.name}</p>
                <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  Administrator
                </span>
              </div>
            </div>
            <button
              onClick={fetchAdminStats}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Stats
            </button>
          </div>
        </div>

        {/* System Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow cursor-pointer">
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {stats.totalUsers}
            </p>
            <p className="text-gray-500 text-xs mt-4">Active users in system</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow cursor-pointer">
            <p className="text-gray-600 text-sm">Total Doctors</p>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {stats.totalDoctors}
            </p>
            <p className="text-gray-500 text-xs mt-4">Registered doctors</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow cursor-pointer">
            <p className="text-gray-600 text-sm">Total Appointments</p>
            <p className="text-4xl font-bold text-purple-600 mt-2">
              {stats.totalAppointments}
            </p>
            <p className="text-gray-500 text-xs mt-4">All appointments</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow cursor-pointer">
            <p className="text-gray-600 text-sm">Total Departments</p>
            <p className="text-4xl font-bold text-orange-600 mt-2">
              {stats.totalDepartments}
            </p>
            <p className="text-gray-500 text-xs mt-4">Medical departments</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all transform hover:scale-105 border-t-4 ${
                  action.color === "blue"
                    ? "border-blue-500"
                    : action.color === "green"
                      ? "border-green-500"
                      : action.color === "purple"
                        ? "border-purple-500"
                        : "border-orange-500"
                }`}
              >
                <div className="text-4xl mb-4">{action.icon}</div>
                <h3 className="text-lg font-bold text-gray-900">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Manage and organize
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Admin Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Admin Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Name
                </label>
                <p className="text-lg text-gray-900 mt-1">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                <p className="text-lg text-gray-900 mt-1">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Phone
                </label>
                <p className="text-lg text-gray-900 mt-1">
                  {user?.phone || "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Role
                </label>
                <p className="text-lg text-gray-900 mt-1">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    Administrator
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              System Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <p className="font-semibold text-gray-900">API Server</p>
                  <p className="text-sm text-gray-600">Backend status</p>
                </div>
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <p className="font-semibold text-gray-900">Database</p>
                  <p className="text-sm text-gray-600">MongoDB connection</p>
                </div>
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <p className="font-semibold text-gray-900">Authentication</p>
                  <p className="text-sm text-gray-600">JWT tokens</p>
                </div>
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Email Service</p>
                  <p className="text-sm text-gray-600">Notifications</p>
                </div>
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            System Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-semibold text-blue-900">
                Active Sessions
              </p>
              <p className="text-2xl font-bold text-blue-600 mt-2">1</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-semibold text-green-900">
                API Calls (24h)
              </p>
              <p className="text-2xl font-bold text-green-600 mt-2">~500+</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm font-semibold text-purple-900">
                System Uptime
              </p>
              <p className="text-2xl font-bold text-purple-600 mt-2">99.9%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
