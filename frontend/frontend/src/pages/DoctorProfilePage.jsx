import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const DoctorProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user?.role === "doctor") {
      fetchDoctorData();
    }
  }, [user]);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const appointmentsRes = await fetch(
        `${API_URL}/doctor-appointments/getDoctorAppointments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (appointmentsRes.ok) {
        const data = await appointmentsRes.json();
        setDoctorProfile(data.doctorInfo);
        setAppointments(data.appointments || []);

        const statsData = {
          pending: data.appointments.filter((a) => a.status === "pending")
            .length,
          confirmed: data.appointments.filter((a) => a.status === "confirmed")
            .length,
          completed: data.appointments.filter((a) => a.status === "completed")
            .length,
        };
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      toast.error("Failed to load doctor profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-3xl">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Dr. {user?.name}
                </h1>
                <p className="text-green-700 font-semibold mt-1">
                  {doctorProfile?.specialty || "Medical Professional"}
                </p>
                <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {editing ? "Done" : "Edit Profile"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Pending Appointments</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Confirmed Appointments</p>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {stats.confirmed}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm">Completed Appointments</p>
            <p className="text-4xl font-bold text-purple-600 mt-2">
              {stats.completed}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Professional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Specialty
              </label>
              <p className="text-lg text-gray-900 mt-2">
                {doctorProfile?.specialty || "Not specified"}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Experience
              </label>
              <p className="text-lg text-gray-900 mt-2">
                {doctorProfile?.experienceYears || 0} years
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Consultation Fee
              </label>
              <p className="text-lg text-gray-900 mt-2">
                ${doctorProfile?.consultationFee || 150}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Status
              </label>
              <p className="text-lg text-gray-900 mt-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  {doctorProfile?.availability ? "Available" : "Not Available"}
                </span>
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                About
              </label>
              <p className="text-gray-900 mt-2">
                {doctorProfile?.description ||
                  "Add your professional description"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Your Appointments
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.length > 0 ? (
                  appointments.map((apt) => (
                    <tr
                      key={apt._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {apt.user?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(apt.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {apt.reason}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            apt.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : apt.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : apt.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {apt.status.charAt(0).toUpperCase() +
                            apt.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ${apt.price || 150}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-600"
                    >
                      No appointments yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
