import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

// Icons
const EditIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const fetchMedicalHistory = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!user?._id) return;
      const response = await fetch(
        `${API_URL}/medical-history/summary/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setMedicalHistory(data.summary?.history || []);
      }
    } catch (error) {
      console.error("Error fetching medical history:", error);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?.role === "user") {
      fetchMedicalHistory();
    }
  }, [user?.role, fetchMedicalHistory]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-3xl">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user?.name}
                </h1>
                <p className="text-gray-600 mt-1 capitalize">
                  {user?.role} Account
                </p>
                <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <EditIcon size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Name
              </label>
              <p className="text-lg text-gray-900 mt-2">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>
              <p className="text-lg text-gray-900 mt-2">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Phone
              </label>
              <p className="text-lg text-gray-900 mt-2">
                {user?.phone || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Role
              </label>
              <p className="text-lg text-gray-900 mt-2 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Medical History - Only for Users */}
        {user?.role === "user" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Medical History
            </h2>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading medical history...</p>
                </div>
              </div>
            ) : medicalHistory.length > 0 ? (
              <div className="space-y-4">
                {medicalHistory.map((record) => (
                  <div
                    key={record._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="text-lg font-medium text-gray-900">
                          {new Date(record.visitDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Doctor</p>
                        <p className="text-lg font-medium text-gray-900">
                          {record.doctor?.name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Diagnosis</p>
                        <p className="text-lg font-medium text-gray-900">
                          {record.diagnosis || "N/A"}
                        </p>
                      </div>
                    </div>
                    {record.symptoms && record.symptoms.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">Symptoms:</p>
                        <div className="flex flex-wrap gap-2">
                          {record.symptoms.map((symptom, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full"
                            >
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-2">
                  No medical history records found
                </p>
                <p className="text-gray-500 text-sm">
                  Medical records will appear here after your appointments with
                  doctors
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
