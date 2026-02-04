import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AddAppointment() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    doctor: "",
    date: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDoctorsLoading, setIsDoctorsLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/doctors/getDoctors");
        if (!res.ok) throw new Error("Failed to fetch doctors");
        const data = await res.json();
        setDoctors(data.doctors || []);
      } catch (error) {
        setNotification({
          type: "error",
          message: "Failed to load doctors. Please refresh the page.",
        });
      } finally {
        setIsDoctorsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (form.doctor) {
      const doctor = doctors.find((doc) => doc._id === form.doctor);
      setSelectedDoctor(doctor);
    } else {
      setSelectedDoctor(null);
    }
  }, [form.doctor, doctors]);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const validateForm = () => {
    const newErrors = {};

    if (!form.doctor) {
      newErrors.doctor = "Please select a doctor";
    }

    if (!form.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "Cannot schedule appointments in the past";
      }
    }

    if (!form.reason) {
      newErrors.reason = "Reason is required";
    } else if (form.reason.length < 3) {
      newErrors.reason = "Reason must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      setNotification({
        type: "error",
        message: "Please fix the errors in the form before submitting.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setNotification({
          type: "error",
          message: "Please login to schedule an appointment.",
        });
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const appointmentData = {
        doctor: form.doctor,
        date: new Date(form.date).toISOString(),
        reason: form.reason,
      };

      const res = await fetch(
        "http://localhost:5000/appointments/createAppointment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(appointmentData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Failed to create appointment");
      }

      const appointmentDate = new Date(form.date).toLocaleDateString();

      setNotification({
        type: "success",
        message: `${data.msg} Appointment with Dr. ${selectedDoctor?.name || "your doctor"} on ${appointmentDate}!`,
      });

      handleReset();
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setNotification({
        type: "error",
        message:
          error.message || "Failed to create appointment. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ doctor: "", date: "", reason: "" });
    setErrors({});
    setSelectedDoctor(null);
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-blue-600"
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to login to create an appointment.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 min-w-[320px] max-w-md animate-slide-in ${
            notification.type === "success"
              ? "bg-gradient-to-br from-green-50 to-green-100"
              : "bg-gradient-to-br from-red-50 to-red-100"
          } rounded-2xl overflow-hidden`}
          style={{
            boxShadow:
              notification.type === "success"
                ? "12px 12px 24px #d1fae5, -12px -12px 24px #ffffff"
                : "12px 12px 24px #fecaca, -12px -12px 24px #ffffff",
          }}
        >
          <div className="p-5">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === "success" ? (
                  <div
                    className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center"
                    style={{
                      boxShadow: "4px 4px 8px #86efac, -4px -4px 8px #bbf7d0",
                    }}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : (
                  <div
                    className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center"
                    style={{
                      boxShadow: "4px 4px 8px #fca5a5, -4px -4px 8px #fecaca",
                    }}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <p
                  className={`text-base font-bold ${
                    notification.type === "success"
                      ? "text-green-900"
                      : "text-red-900"
                  }`}
                >
                  {notification.type === "success" ? "Success!" : "Error!"}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    notification.type === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className={`ml-3 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  notification.type === "success"
                    ? "text-green-600 hover:bg-green-200"
                    : "text-red-600 hover:bg-red-200"
                }`}
              >
                <svg
                  className="w-5 h-5"
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
              </button>
            </div>
          </div>
          <div
            className={`h-1.5 ${
              notification.type === "success" ? "bg-green-200" : "bg-red-200"
            }`}
          >
            <div
              className={`h-full ${
                notification.type === "success"
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gradient-to-r from-red-500 to-red-600"
              } animate-progress rounded-full`}
            ></div>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <h1 className="text-3xl font-bold">Schedule Appointment</h1>
          <p className="text-blue-100 text-sm mt-1">
            Book your medical consultation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Doctor Selection */}
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="doctor"
            >
              Select Doctor <span className="text-red-500">*</span>
            </label>
            {isDoctorsLoading ? (
              <div className="flex items-center text-gray-500 text-sm">
                <svg
                  className="animate-spin h-4 w-4 mr-2"
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
                Loading doctors...
              </div>
            ) : (
              <select
                className={`w-full px-4 py-3 border ${
                  errors.doctor ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                id="doctor"
                name="doctor"
                value={form.doctor}
                onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                disabled={isLoading}
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} {doc.specialty ? `- ${doc.specialty}` : ""}
                  </option>
                ))}
              </select>
            )}
            {errors.doctor && (
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.doctor}
              </p>
            )}

            {selectedDoctor && (
              <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedDoctor.name?.charAt(0) || "D"}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedDoctor.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Specialty:</strong>{" "}
                      {selectedDoctor.specialty || "General Practice"}
                    </p>
                    {selectedDoctor.email && (
                      <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {selectedDoctor.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Date */}
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="date"
            >
              Appointment Date <span className="text-red-500">*</span>
            </label>
            <input
              className={`w-full px-4 py-3 border ${
                errors.date ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
              type="date"
              id="date"
              name="date"
              min={getTodayDate()}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              disabled={isLoading}
            />
            {errors.date && (
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.date}
              </p>
            )}
          </div>

          {/* Reason */}
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="reason"
            >
              Reason for Visit <span className="text-red-500">*</span>
            </label>
            <textarea
              className={`w-full px-4 py-3 border ${
                errors.reason ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none`}
              id="reason"
              name="reason"
              rows="4"
              placeholder="Please describe the reason for your appointment (e.g., Annual checkup, Consultation, Follow-up, Symptoms)"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              disabled={isLoading}
            />
            {errors.reason && (
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.reason}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              type="submit"
              disabled={isLoading || isDoctorsLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Scheduling...
                </span>
              ) : (
                <span className="flex items-center justify-center">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Schedule Appointment
                </span>
              )}
            </button>
            <button
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset
            </button>
          </div>
        </form>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> You will receive a confirmation email once
              your appointment is confirmed by our staff.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-progress {
          animation: progress 5s linear;
        }
      `}</style>
    </div>
  );
}

export default AddAppointment;
