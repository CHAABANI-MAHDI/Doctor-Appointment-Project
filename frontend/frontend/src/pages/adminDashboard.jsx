import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// SVG Icon Components
const ActivityIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
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
    strokeLinecap="round"
    strokeLinejoin="round"
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
    strokeLinecap="round"
    strokeLinejoin="round"
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
    strokeLinecap="round"
    strokeLinejoin="round"
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
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
    <circle cx="20" cy="10" r="2"></circle>
  </svg>
);

const SearchIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const FilterIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const EyeIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EditIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const Trash2Icon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const ChevronRightIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const MenuIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const XIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SunIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const LogOutIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const SettingsIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Set darkMode to false by default (light mode)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [stats, setStats] = useState({
    doctors: 0,
    users: 0,
    departments: 0,
    appointments: 0,
  });

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeView, setActiveView] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch counts
      const [doctorCountRes, userCountRes, deptCountRes] = await Promise.all([
        fetch("http://localhost:3000/api/doctors/count"),
        fetch("http://localhost:3000/api/users/count"),
        fetch("http://localhost:3000/api/departments/count"),
      ]);

      const doctorCount = await doctorCountRes.json();
      const userCount = await userCountRes.json();
      const deptCount = await deptCountRes.json();

      // Fetch actual data
      const [doctorsRes, deptsRes] = await Promise.all([
        fetch("http://localhost:3000/api/doctors/getDoctors"),
        fetch("http://localhost:3000/api/departments/getDepts"),
      ]);

      const doctorsData = await doctorsRes.json();
      const deptsData = await deptsRes.json();

      // Fetch appointments if user is authenticated
      const token = getAuthToken();
      let appointmentsData = { appointment: [] };
      if (token) {
        try {
          const appointmentsRes = await fetch(
            "http://localhost:3000/api/appointments/getAppointment",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (appointmentsRes.ok) {
            appointmentsData = await appointmentsRes.json();
          }
        } catch (error) {
          console.error("Error fetching appointments:", error);
        }
      }

      setStats({
        doctors: doctorCount.count || 0,
        users: userCount.count || 0,
        departments: deptCount.count || 0,
        appointments: appointmentsData.appointment?.length || 0,
      });

      setDoctors(doctorsData.doctors || []);
      setDepartments(deptsData.departments || []);
      setAppointments(appointmentsData.appointment || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Smaller StatCard for overview only - Blue Theme
  const SmallStatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div
      className={`relative overflow-hidden rounded-xl ${
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-blue-100"
      } p-4 shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg ${bgColor}`}>
            <Icon size={20} className={color} />
          </div>
        </div>

        <div>
          <p
            className={`text-xs font-semibold ${
              darkMode ? "text-slate-400" : "text-blue-600"
            } uppercase tracking-wider mb-1`}
          >
            {label}
          </p>
          <p
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-blue-900"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );

  // Blue Theme DoctorCard
  const DoctorCard = ({ doctor }) => (
    <div
      className={`group relative overflow-hidden rounded-xl ${
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-blue-200"
      } border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

      <div className="p-6">
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
          <img
            src={`http://localhost:3000/pic-uploads/${doctor.image}`}
            alt={doctor.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                doctor.name,
              )}&background=3B82F6&color=fff&size=200`;
            }}
          />
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 text-xs font-bold text-white bg-green-500 rounded-full shadow-lg">
              Active
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h3
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-blue-900"
            }`}
          >
            {doctor.name}
          </h3>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
              {doctor.specialty}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 text-xs font-medium ${
                darkMode
                  ? "text-slate-300 bg-slate-700"
                  : "text-blue-600 bg-blue-50"
              } rounded-full`}
            >
              {doctor.experienceYears} years exp
            </span>
          </div>

          <p
            className={`text-sm ${
              darkMode ? "text-slate-400" : "text-blue-700"
            } line-clamp-2`}
          >
            {doctor.description}
          </p>
        </div>

        <div
          className={`mt-6 pt-4 border-t ${
            darkMode ? "border-slate-700" : "border-blue-100"
          } flex gap-2`}
        >
          <button
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold ${
              darkMode
                ? "text-blue-400 bg-blue-900/30 hover:bg-blue-900/50"
                : "text-blue-700 bg-blue-50 hover:bg-blue-100"
            } rounded-lg transition-colors`}
          >
            <EyeIcon size={16} />
            View
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold ${
              darkMode
                ? "text-blue-400 bg-blue-900/30 hover:bg-blue-900/50"
                : "text-blue-700 bg-blue-50 hover:bg-blue-100"
            } rounded-lg transition-colors`}
          >
            <EditIcon size={16} />
            Edit
          </button>
          <button
            className={`flex items-center justify-center px-4 py-2 text-sm font-semibold ${
              darkMode
                ? "text-red-400 bg-red-900/30 hover:bg-red-900/50"
                : "text-red-700 bg-red-50 hover:bg-red-100"
            } rounded-lg transition-colors`}
          >
            <Trash2Icon size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  // Blue Theme DepartmentCard
  const DepartmentCard = ({ dept }) => (
    <div
      className={`group relative overflow-hidden rounded-xl ${
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-blue-200"
      } border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

      <div className="p-6">
        <div className="flex gap-4 mb-4">
          {dept.image && (
            <img
              src={`http://localhost:3000/pic-uploads/${dept.image}`}
              alt={dept.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
          <div className="flex-1">
            <h3
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-blue-900"
              } mb-2`}
            >
              {dept.name}
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-slate-400" : "text-blue-700"
              } line-clamp-2`}
            >
              {dept.description}
            </p>
          </div>
        </div>

        <div
          className={`flex gap-3 p-4 ${
            darkMode
              ? "bg-blue-900/20 border-blue-800"
              : "bg-blue-50 border-blue-100"
          } rounded-lg border`}
        >
          <div
            className={`flex items-center gap-2 text-sm font-medium ${
              darkMode ? "text-slate-300" : "text-blue-700"
            }`}
          >
            <StethoscopeIcon
              size={18}
              className={darkMode ? "text-blue-400" : "text-blue-600"}
            />
            <span>Doctors</span>
          </div>
          <div
            className={`flex items-center gap-2 text-sm font-medium ${
              darkMode ? "text-slate-300" : "text-blue-700"
            }`}
          >
            <CalendarIcon
              size={18}
              className={darkMode ? "text-blue-400" : "text-blue-600"}
            />
            <span>Appointments</span>
          </div>
        </div>

        <div
          className={`mt-4 pt-4 border-t ${
            darkMode ? "border-slate-700" : "border-blue-100"
          } flex gap-2`}
        >
          <button
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold ${
              darkMode
                ? "text-blue-400 bg-blue-900/30 hover:bg-blue-900/50"
                : "text-blue-700 bg-blue-50 hover:bg-blue-100"
            } rounded-lg transition-colors`}
          >
            <EyeIcon size={16} />
            View
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold ${
              darkMode
                ? "text-blue-400 bg-blue-900/30 hover:bg-blue-900/50"
                : "text-blue-700 bg-blue-50 hover:bg-blue-100"
            } rounded-lg transition-colors`}
          >
            <EditIcon size={16} />
            Edit
          </button>
        </div>
      </div>
    </div>
  );

  // Blue Theme AppointmentCard
  const AppointmentCard = ({ appointment }) => (
    <div
      className={`group relative overflow-hidden rounded-xl ${
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-blue-200"
      } border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3
              className={`text-lg font-bold ${
                darkMode ? "text-white" : "text-blue-900"
              } mb-1`}
            >
              Appointment
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-slate-400" : "text-blue-700"
              }`}
            >
              {new Date(appointment.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <span className="px-3 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded-full">
            Pending
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <p
              className={`text-xs font-semibold ${
                darkMode ? "text-slate-500" : "text-blue-500"
              } uppercase tracking-wider mb-1`}
            >
              Reason
            </p>
            <p
              className={`text-sm ${
                darkMode ? "text-slate-300" : "text-blue-800"
              }`}
            >
              {appointment.reason}
            </p>
          </div>
          <div>
            <p
              className={`text-xs font-semibold ${
                darkMode ? "text-slate-500" : "text-blue-500"
              } uppercase tracking-wider mb-1`}
            >
              Doctor ID
            </p>
            <p
              className={`text-sm ${
                darkMode ? "text-slate-300" : "text-blue-800"
              } font-mono`}
            >
              {appointment.doctor}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold ${
              darkMode
                ? "text-blue-400 bg-blue-900/30 hover:bg-blue-900/50"
                : "text-blue-700 bg-blue-50 hover:bg-blue-100"
            } rounded-lg transition-colors`}
          >
            <EyeIcon size={16} />
            View
          </button>
          <button
            className={`flex items-center justify-center px-4 py-2 text-sm font-semibold ${
              darkMode
                ? "text-red-400 bg-red-900/30 hover:bg-red-900/50"
                : "text-red-700 bg-red-50 hover:bg-red-100"
            } rounded-lg transition-colors`}
          >
            <Trash2Icon size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleNavClick = (view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-slate-900" : "bg-gradient-to-br from-blue-50 to-white"
      }`}
    >
      

      {/* Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 mt-20"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Sidebar with integrated navbar features - Blue Theme */}
      <aside
        className={`fixed  left-0 h-100vh w-72 ${
          darkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-blue-100"
        } border-r shadow-xl z-40 transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* User info at top of sidebar - Blue Theme */}
          <div className={`p-6 border-b ${darkMode ? "border-slate-700 bg-slate-900" : "border-blue-100 bg-blue-50"}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="font-bold text-blue-700">
                  {user?.name?.charAt(0) || "A"}
                </span>
              </div>
              <div>
                <p className={`font-semibold ${darkMode ? "text-white" : "text-blue-900"}`}>
                  {user?.name || "Administrator"}
                </p>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-blue-600"}`}>
                  Admin User
                </p>
              </div>
            </div>
          </div>

          {/* Navigation - Blue Theme */}
          <div className="flex-1 p-6">
            <nav className="space-y-1">
              <p
                className={`px-3 mb-2 text-xs font-semibold ${
                  darkMode ? "text-slate-500" : "text-blue-500"
                } uppercase tracking-wider`}
              >
                Main Menu
              </p>

              <button
                onClick={() => handleNavClick("overview")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeView === "overview"
                    ? darkMode
                      ? "bg-blue-900/30 text-blue-400 shadow-sm"
                      : "bg-blue-50 text-blue-700 shadow-sm"
                    : darkMode
                      ? "text-slate-300 hover:bg-slate-700"
                      : "text-blue-700 hover:bg-blue-50"
                }`}
              >
                <ActivityIcon size={20} />
                <span>Overview</span>
              </button>

              <button
                onClick={() => handleNavClick("doctors")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeView === "doctors"
                    ? darkMode
                      ? "bg-blue-900/30 text-blue-400 shadow-sm"
                      : "bg-blue-50 text-blue-700 shadow-sm"
                    : darkMode
                      ? "text-slate-300 hover:bg-slate-700"
                      : "text-blue-700 hover:bg-blue-50"
                }`}
              >
                <StethoscopeIcon size={20} />
                <span>Doctors</span>
              </button>

              <button
                onClick={() => handleNavClick("appointments")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeView === "appointments"
                    ? darkMode
                      ? "bg-blue-900/30 text-blue-400 shadow-sm"
                      : "bg-blue-50 text-blue-700 shadow-sm"
                    : darkMode
                      ? "text-slate-300 hover:bg-slate-700"
                      : "text-blue-700 hover:bg-blue-50"
                }`}
              >
                <CalendarIcon size={20} />
                <span>Appointments</span>
              </button>

              <button
                onClick={() => handleNavClick("departments")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeView === "departments"
                    ? darkMode
                      ? "bg-blue-900/30 text-blue-400 shadow-sm"
                      : "bg-blue-50 text-blue-700 shadow-sm"
                    : darkMode
                      ? "text-slate-300 hover:bg-slate-700"
                      : "text-blue-700 hover:bg-blue-50"
                }`}
              >
                <Building2Icon size={20} />
                <span>Departments</span>
              </button>

              <button
                onClick={() => handleNavClick("users")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeView === "users"
                    ? darkMode
                      ? "bg-blue-900/30 text-blue-400 shadow-sm"
                      : "bg-blue-50 text-blue-700 shadow-sm"
                    : darkMode
                      ? "text-slate-300 hover:bg-slate-700"
                      : "text-blue-700 hover:bg-blue-50"
                }`}
              >
                <UsersIcon size={20} />
                <span>Users</span>
              </button>

              <div
                className={`pt-4 mt-4 border-t ${
                  darkMode ? "border-slate-700" : "border-blue-100"
                }`}
              >
                <p
                  className={`px-3 mb-2 text-xs font-semibold ${
                    darkMode ? "text-slate-500" : "text-blue-500"
                  } uppercase tracking-wider`}
                >
                  Quick Actions
                </p>
                
                <Link
                  to="/add-doctor"
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
                    darkMode
                      ? "text-slate-300 hover:bg-slate-700"
                      : "text-blue-700 hover:bg-blue-50"
                  } transition-all`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className={`p-1.5 rounded-lg ${darkMode ? "bg-blue-900/30" : "bg-blue-100"}`}>
                    <svg
                      className="w-4 h-4 text-blue-600"
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
                  </div>
                  <span>Add Doctor</span>
                </Link>
                
                <Link
                  to="/add-departments"
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
                    darkMode
                      ? "text-slate-300 hover:bg-slate-700"
                      : "text-blue-700 hover:bg-blue-50"
                  } transition-all`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className={`p-1.5 rounded-lg ${darkMode ? "bg-blue-900/30" : "bg-blue-100"}`}>
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <span>Add Department</span>
                </Link>
              </div>

              {/* Dark/Light Mode Toggle moved to sidebar */}
              <div
                className={`pt-4 mt-4 border-t ${
                  darkMode ? "border-slate-700" : "border-blue-100"
                }`}
              >
                <p
                  className={`px-3 mb-2 text-xs font-semibold ${
                    darkMode ? "text-slate-500" : "text-blue-500"
                  } uppercase tracking-wider`}
                >
                  Settings
                </p>
                
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all ${
                    darkMode
                      ? "text-slate-300 hover:bg-slate-700"
                      : "text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <SettingsIcon size={20} />
                    <span>Theme</span>
                  </div>
                  <div className={`flex items-center gap-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                    {darkMode ? (
                      <>
                        <MoonIcon size={16} />
                        <span className="text-sm">Dark</span>
                      </>
                    ) : (
                      <>
                        <SunIcon size={16} />
                        <span className="text-sm">Light</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </nav>
          </div>

          {/* Logout button at bottom of sidebar - Blue Theme */}
          <div className={`p-6 border-t ${darkMode ? "border-slate-700" : "border-blue-100"}`}>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${
                darkMode
                  ? "bg-red-900/30 hover:bg-red-900/50 text-red-400"
                  : "bg-red-50 hover:bg-red-100 text-red-700"
              } font-medium rounded-lg transition-colors`}
              aria-label="Logout"
            >
              <LogOutIcon size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 p-4 md:p-6 lg:p-8">
        {/* Header - Blue Theme */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1
                className={`text-2xl md:text-3xl lg:text-4xl font-bold ${
                  darkMode ? "text-white" : "text-blue-900"
                } mb-2`}
              >
                Admin Dashboard
              </h1>
              <p className={darkMode ? "text-slate-400" : "text-blue-600"}>
                Welcome back! Here's what's happening today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:w-64 lg:w-80">
                <SearchIcon
                  size={20}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    darkMode ? "text-slate-500" : "text-blue-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search doctors, departments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 ${
                    darkMode
                      ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                      : "bg-white border-blue-200 text-blue-900 placeholder-blue-400"
                  } border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
              </div>
              <button
                className={`flex items-center justify-center gap-2 px-4 md:px-6 py-3 ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 hover:bg-slate-700"
                    : "bg-white border-blue-200 hover:bg-blue-50"
                } border rounded-xl transition-colors`}
              >
                <FilterIcon size={20} />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p
              className={`${
                darkMode ? "text-slate-400" : "text-blue-600"
              } font-medium`}
            >
              Loading dashboard data...
            </p>
          </div>
        ) : (
          <>
            {/* Stats Grid - Only shown in overview - Blue Theme */}
            {activeView === "overview" && (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <SmallStatCard
                  icon={StethoscopeIcon}
                  label="Total Doctors"
                  value={stats.doctors}
                  color="text-blue-600"
                  bgColor={darkMode ? "bg-blue-900/30" : "bg-blue-100"}
                />
                <SmallStatCard
                  icon={UsersIcon}
                  label="Total Users"
                  value={stats.users}
                  color="text-blue-600"
                  bgColor={darkMode ? "bg-blue-900/30" : "bg-blue-100"}
                />
                <SmallStatCard
                  icon={Building2Icon}
                  label="Departments"
                  value={stats.departments}
                  color="text-blue-600"
                  bgColor={darkMode ? "bg-blue-900/30" : "bg-blue-100"}
                />
                <SmallStatCard
                  icon={CalendarIcon}
                  label="Appointments"
                  value={stats.appointments}
                  color="text-blue-600"
                  bgColor={darkMode ? "bg-blue-900/30" : "bg-blue-100"}
                />
              </div>
            )}

            {/* Doctors Section - Blue Theme */}
            {(activeView === "overview" || activeView === "doctors") && (
              <div className="mb-8 md:mb-12">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2
                    className={`text-xl md:text-2xl font-bold ${
                      darkMode ? "text-white" : "text-blue-900"
                    }`}
                  >
                    Doctors
                  </h2>
                  {activeView === "overview" && (
                    <button
                      onClick={() => handleNavClick("doctors")}
                      className={`flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-semibold ${
                        darkMode
                          ? "text-blue-400 bg-blue-900/30 hover:bg-blue-900/50"
                          : "text-blue-700 bg-blue-50 hover:bg-blue-100"
                      } rounded-lg transition-colors`}
                    >
                      View All
                      <ChevronRightIcon size={18} />
                    </button>
                  )}
                </div>

                {filteredDoctors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {(activeView === "overview"
                      ? filteredDoctors.slice(0, 3)
                      : filteredDoctors
                    ).map((doctor) => (
                      <DoctorCard key={doctor._id} doctor={doctor} />
                    ))}
                  </div>
                ) : (
                  <div
                    className={`flex flex-col items-center justify-center py-8 md:py-12 ${
                      darkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-blue-200"
                    } rounded-xl border`}
                  >
                    <StethoscopeIcon
                      size={64}
                      className={darkMode ? "text-slate-600" : "text-blue-300"}
                    />
                    <h3
                      className={`text-lg font-semibold ${
                        darkMode ? "text-slate-400" : "text-blue-700"
                      } mt-4 mb-2`}
                    >
                      No doctors found
                    </h3>
                    <p
                      className={darkMode ? "text-slate-500" : "text-blue-500"}
                    >
                      Try adjusting your search or add a new doctor
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Departments Section - Blue Theme */}
            {(activeView === "overview" || activeView === "departments") && (
              <div className="mb-8 md:mb-12">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2
                    className={`text-xl md:text-2xl font-bold ${
                      darkMode ? "text-white" : "text-blue-900"
                    }`}
                  >
                    Departments
                  </h2>
                  {activeView === "overview" && (
                    <button
                      onClick={() => handleNavClick("departments")}
                      className={`flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-semibold ${
                        darkMode
                          ? "text-blue-400 bg-blue-900/30 hover:bg-blue-900/50"
                          : "text-blue-700 bg-blue-50 hover:bg-blue-100"
                      } rounded-lg transition-colors`}
                    >
                      View All
                      <ChevronRightIcon size={18} />
                    </button>
                  )}
                </div>

                {filteredDepartments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {(activeView === "overview"
                      ? filteredDepartments.slice(0, 3)
                      : filteredDepartments
                    ).map((dept) => (
                      <DepartmentCard key={dept._id} dept={dept} />
                    ))}
                  </div>
                ) : (
                  <div
                    className={`flex flex-col items-center justify-center py-8 md:py-12 ${
                      darkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-blue-200"
                    } rounded-xl border`}
                  >
                    <Building2Icon
                      size={64}
                      className={darkMode ? "text-slate-600" : "text-blue-300"}
                    />
                    <h3
                      className={`text-lg font-semibold ${
                        darkMode ? "text-slate-400" : "text-blue-700"
                      } mt-4 mb-2`}
                    >
                      No departments found
                    </h3>
                    <p
                      className={darkMode ? "text-slate-500" : "text-blue-500"}
                    >
                      Try adjusting your search or add a new department
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Appointments Section - Blue Theme */}
            {activeView === "appointments" && (
              <div className="mb-8 md:mb-12">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2
                    className={`text-xl md:text-2xl font-bold ${
                      darkMode ? "text-white" : "text-blue-900"
                    }`}
                  >
                    All Appointments
                  </h2>
                </div>

                {appointments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {appointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment._id}
                        appointment={appointment}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className={`flex flex-col items-center justify-center py-8 md:py-12 ${
                      darkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-blue-200"
                    } rounded-xl border`}
                  >
                    <CalendarIcon
                      size={64}
                      className={darkMode ? "text-slate-600" : "text-blue-300"}
                    />
                    <h3
                      className={`text-lg font-semibold ${
                        darkMode ? "text-slate-400" : "text-blue-700"
                      } mt-4 mb-2`}
                    >
                      No appointments found
                    </h3>
                    <p
                      className={darkMode ? "text-slate-500" : "text-blue-500"}
                    >
                      {getAuthToken()
                        ? "No appointments available"
                        : "Please login to view appointments"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Users Section - Blue Theme */}
            {activeView === "users" && (
              <div className="mb-8 md:mb-12">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2
                    className={`text-xl md:text-2xl font-bold ${
                      darkMode ? "text-white" : "text-blue-900"
                    }`}
                  >
                    All Users
                  </h2>
                </div>
                <div
                  className={`flex flex-col items-center justify-center py-8 md:py-12 ${
                    darkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-blue-200"
                  } rounded-xl border`}
                >
                  <UsersIcon
                    size={64}
                    className={darkMode ? "text-slate-600" : "text-blue-300"}
                  />
                  <h3
                    className={`text-lg font-semibold ${
                      darkMode ? "text-slate-400" : "text-blue-700"
                    } mt-4 mb-2`}
                  >
                    Users list will be displayed here
                  </h3>
                  <p className={darkMode ? "text-slate-500" : "text-blue-500"}>
                    Integrate with the users API endpoint to display user data
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;