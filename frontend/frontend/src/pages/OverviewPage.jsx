import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

// Icons remain the same
const ActivityIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const UsersIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const CalendarIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const Building2Icon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
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
);

const StethoscopeIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
    <circle cx="20" cy="10" r="2"></circle>
  </svg>
);

const ClockIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const PlusIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const OverviewPage = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    users: 0,
    departments: 0,
    appointments: 0,
  });

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch counts
      const [doctorCountRes, userCountRes, deptCountRes] = await Promise.all([
        fetch(`${API_URL}/doctors/count`),
        fetch(`${API_URL}/users/count`),
        fetch(`${API_URL}/departments/count`),
      ]);

      const doctorCount = await doctorCountRes.json();
      const userCount = await userCountRes.json();
      const deptCount = await deptCountRes.json();

      // Fetch actual data
      const [doctorsRes, deptsRes] = await Promise.all([
        fetch(`${API_URL}/doctors/getDoctors`),
        fetch(`${API_URL}/departments/getDepts`),
      ]);

      const doctorsData = await doctorsRes.json();
      const deptsData = await deptsRes.json();

      // Mock recent appointments data (replace with actual API call)
      const mockAppointments = [
        {
          id: 1,
          patientName: "John Doe",
          doctor: "Dr. Smith",
          time: "10:30 AM",
          status: "confirmed",
        },
        {
          id: 2,
          patientName: "Jane Smith",
          doctor: "Dr. Johnson",
          time: "2:00 PM",
          status: "pending",
        },
        {
          id: 3,
          patientName: "Robert Brown",
          doctor: "Dr. Williams",
          time: "11:15 AM",
          status: "completed",
        },
        {
          id: 4,
          patientName: "Sarah Wilson",
          doctor: "Dr. Davis",
          time: "3:45 PM",
          status: "confirmed",
        },
      ];

      setStats({
        doctors: doctorCount.count || 0,
        users: userCount.count || 0,
        departments: deptCount.count || 0,
        appointments: mockAppointments.length,
      });

      setDoctors(doctorsData.doctors || []);
      setDepartments(deptsData.departments || []);
      setRecentAppointments(mockAppointments);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    gradient = "from-blue-500 to-blue-600",
    iconBg = "bg-blue-100",
    iconColor = "text-blue-600",
  }) => (
    <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
      <div className="absolute inset-0 bg-gradient-to-br from-white dark:from-gray-800 to-gray-50 dark:to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${iconBg} ${iconColor}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {value}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                {label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DoctorCard = ({ doctor }) => (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 dark:from-gray-700 to-blue-100 dark:to-gray-600">
              {doctor.image ? (
                <img
                  src={`${API_URL}/pic-uploads/${doctor.image}`}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      doctor.name,
                    )}&background=3B82F6&color=fff&size=128`;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {doctor.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                  {doctor.name}
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                  {doctor.specialty || "General Physician"}
                </p>
              </div>
              <span className="px-2 py-1 text-xs font-semibold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 rounded-full">
                Active
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full">
                {doctor.experienceYears || "5"} yrs exp
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                Available
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DepartmentCard = ({ dept }) => (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-lg bg-gradient-to-br from-blue-50 dark:from-gray-700 to-indigo-50 dark:to-gray-600`}
          >
            <Building2Icon
              size={20}
              className="text-blue-600 dark:text-blue-400"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
              {dept.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {dept.description ||
                "Medical department providing specialized care"}
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                {Math.floor(Math.random() * 5) + 3} Doctors
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AppointmentItem = ({ appointment }) => {
    const statusColors = {
      confirmed:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
      pending:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
      completed:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
      cancelled: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    };

    return (
      <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 dark:from-gray-700 to-blue-100 dark:to-gray-600 flex items-center justify-center">
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {appointment.patientName.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {appointment.patientName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {appointment.doctor}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {appointment.time}
          </span>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[appointment.status] || "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"}`}
          >
            {appointment.status.charAt(0).toUpperCase() +
              appointment.status.slice(1)}
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-16 h-16 border-4 border-blue-100 dark:border-gray-700 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Loading Dashboard
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we fetch your data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to MediCare Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Here's what's happening with your healthcare system today.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: Today
              </span>
              <button
                onClick={fetchAllData}
                className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={StethoscopeIcon}
            label="Total Doctors"
            value={stats.doctors}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={UsersIcon}
            label="Total Users"
            value={stats.users}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatCard
            icon={Building2Icon}
            label="Departments"
            value={stats.departments}
            iconBg="bg-indigo-100"
            iconColor="text-indigo-600"
          />
          <StatCard
            icon={CalendarIcon}
            label="Appointments"
            value={stats.appointments}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions & Recent Appointments */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  Quick Actions
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your healthcare system efficiently
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    to="/admin-doctors"
                    className="group p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                        <StethoscopeIcon size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          Manage Doctors
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Add, edit, or remove medical professionals
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/admin-departments"
                    className="group p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600">
                        <Building2Icon size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          Manage Departments
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Organize medical departments
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Recent Appointments
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Latest patient appointments
                    </p>
                  </div>
                  <Link
                    to="/admin/appointments"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {recentAppointments.slice(0, 4).map((appointment) => (
                  <AppointmentItem
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Recent Doctors & Departments */}
          <div className="space-y-8">
            {/* Recent Doctors */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Recent Doctors
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Recently added medical professionals
                    </p>
                  </div>
                  <Link
                    to="/admin/doctors"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {doctors.length > 0 ? (
                  <div className="space-y-4">
                    {doctors.slice(0, 3).map((doctor) => (
                      <DoctorCard key={doctor._id} doctor={doctor} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <StethoscopeIcon size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500">No doctors found</p>
                    <Link
                      to="/admin/doctors/add"
                      className="inline-block mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Add your first doctor
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Departments */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Departments
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Medical departments overview
                    </p>
                  </div>
                  <Link
                    to="/admin/departments"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {departments.length > 0 ? (
                  <div className="space-y-4">
                    {departments.slice(0, 3).map((dept) => (
                      <DepartmentCard key={dept._id} dept={dept} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Building2Icon size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500">No departments found</p>
                    <Link
                      to="/admin/departments/add"
                      className="inline-block mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Add your first department
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                System Status
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                All systems operational
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-green-700">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
