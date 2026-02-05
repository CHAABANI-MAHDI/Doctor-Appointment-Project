/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AddAppointment() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Refs for auto-focus and scroll
  const formRef = useRef(null);
  const doctorSelectRef = useRef(null);

  // State management
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    doctor: "",
    date: "",
    time: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDoctorsLoading, setIsDoctorsLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reasonCharCount, setReasonCharCount] = useState(0);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/doctors/getDoctors");
        if (!res.ok) throw new Error("Failed to fetch doctors");
        const data = await res.json();
        setDoctors(data.doctors || []);
        setFilteredDoctors(data.doctors || []);
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

  // Filter doctors based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDoctors(doctors);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = doctors.filter(
        (doc) =>
          doc.name.toLowerCase().includes(query) ||
          (doc.specialty && doc.specialty.toLowerCase().includes(query)),
      );
      setFilteredDoctors(filtered);
    }
  }, [searchQuery, doctors]);

  // Update selected doctor when form changes
  useEffect(() => {
    if (form.doctor) {
      const doctor = doctors.find((doc) => doc._id === form.doctor);
      setSelectedDoctor(doctor);
    } else {
      setSelectedDoctor(null);
    }
  }, [form.doctor, doctors]);

  // Generate available times based on date
  useEffect(() => {
    if (form.date) {
      generateAvailableTimes();
    } else {
      setAvailableTimes([]);
      setForm((prev) => ({ ...prev, time: "" }));
    }
  }, [form.date, form.doctor]);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Auto-focus on mount if user is authenticated
  useEffect(() => {
    if (user && formRef.current) {
      setTimeout(() => {
        doctorSelectRef.current?.focus();
      }, 100);
    }
  }, [user]);

  // Generate time slots (9 AM - 5 PM, every 30 minutes)
  const generateAvailableTimes = () => {
    const times = [];
    const now = new Date();
    const selectedDate = new Date(form.date);
    const isToday = selectedDate.toDateString() === now.toDateString();

    // Business hours: 9 AM to 5 PM
    for (let hour = 9; hour < 17; hour++) {
      for (let minute of [0, 30]) {
        // Skip times that have already passed today
        if (isToday) {
          const currentTime = now.getHours() + now.getMinutes() / 60;
          const slotTime = hour + minute / 60;

          if (slotTime <= currentTime + 0.5) {
            continue; // Skip if time is in the past or too close
          }
        }

        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        times.push(timeString);
      }
    }

    setAvailableTimes(times);
  };

  // Validate form
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

    if (!form.time) {
      newErrors.time = "Time is required";
    }

    if (!form.reason) {
      newErrors.reason = "Reason is required";
    } else if (form.reason.length < 10) {
      newErrors.reason =
        "Reason must be at least 10 characters for better understanding";
    } else if (form.reason.length > 500) {
      newErrors.reason = "Reason cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle reason input with character count
  const handleReasonChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setForm({ ...form, reason: value });
      setReasonCharCount(value.length);
      if (errors.reason) {
        setErrors((prev) => ({ ...prev, reason: "" }));
      }
    }
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle form submission with confirmation
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

    // Show confirmation dialog
    setShowConfirmation(true);
  };

  // Confirm appointment creation
  const confirmAppointment = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);

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
        date: new Date(`${form.date}T${form.time}`).toISOString(),
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

      const appointmentDateTime = new Date(`${form.date}T${form.time}`);
      const formattedDate = appointmentDateTime.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedTime = appointmentDateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setNotification({
        type: "success",
        message: `Appointment scheduled successfully with Dr. ${selectedDoctor?.name || "your doctor"} on ${formattedDate} at ${formattedTime}!`,
      });

      // Reset form after success
      setTimeout(() => {
        handleReset();
        navigate("/my-appointments");
      }, 3000);
    } catch (error) {
      setNotification({
        type: "error",
        message:
          error.message || "Failed to create appointment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setForm({ doctor: "", date: "", time: "", reason: "" });
    setErrors({});
    setSelectedDoctor(null);
    setSearchQuery("");
    setReasonCharCount(0);
    setShowConfirmation(false);
  };

  // Cancel confirmation
  const cancelConfirmation = () => {
    setShowConfirmation(false);
  };

  // Get today's date for min date
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Get tomorrow's date for default
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Format doctor name for display
  const formatDoctorName = (name) => {
    return name.replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // If user not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full border border-blue-100">
          <div className="mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <svg
                className="w-10 h-10 text-white"
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
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-8">
            Please sign in to schedule an appointment with our medical
            professionals.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 min-w-[360px] max-w-md animate-slide-in ${
            notification.type === "success"
              ? "bg-white border-l-4 border-green-500"
              : "bg-white border-l-4 border-red-500"
          } rounded-xl shadow-xl overflow-hidden`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === "success" ? (
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                    <svg
                      className="w-6 h-6"
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
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {notification.type === "success" ? "Success!" : "Error!"}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600"
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
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 shadow-md mr-3">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Schedule Appointment
              </h1>
              <p className="text-gray-600 text-sm mt-0.5">
                Book your visit with our medical professionals
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
          {/* Form Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">New Appointment</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Complete the form below to schedule your visit
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="p-6">
            {/* Doctor Selection */}
            <div className="mb-6">
              <label
                className="block text-gray-900 text-sm font-semibold mb-2"
                htmlFor="doctor"
              >
                Select Doctor <span className="text-red-500">*</span>
              </label>

              {/* Search Input */}
              <div className="mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search doctors by name or specialty..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {isDoctorsLoading ? (
                <div className="flex items-center justify-center py-12 bg-blue-50 border border-blue-200 rounded-lg">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-600 mr-3"
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
                  <span className="text-gray-700 font-medium">
                    Loading doctors...
                  </span>
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="py-12 text-center bg-blue-50 border border-blue-200 rounded-lg">
                  <svg
                    className="mx-auto h-12 w-12 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-700 font-medium">
                    No doctors found matching your search
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                  {filteredDoctors.map((doc) => (
                    <div
                      key={doc._id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        form.doctor === doc._id
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                      onClick={() => setForm({ ...form, doctor: doc._id })}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        setForm({ ...form, doctor: doc._id })
                      }
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          {doc.image ? (
                            <img
                              src={`/pic-uploads/${doc.image}`}
                              alt={doc.name}
                              className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-sm"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=2563eb&color=fff`;
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                              {doc.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-gray-900">
                                Dr. {formatDoctorName(doc.name)}
                              </p>
                              <p className="text-sm text-blue-700 font-medium">
                                {doc.specialty || "General Practice"}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full flex-shrink-0 ${form.doctor === doc._id ? "bg-blue-600" : "bg-gray-300"}`}
                            >
                              {form.doctor === doc._id && (
                                <svg
                                  className="w-full h-full text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                          {doc.experienceYears && (
                            <p className="text-xs text-gray-600 mt-1">
                              {doc.experienceYears} years experience
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {errors.doctor && (
                <p className="text-sm text-red-500 mt-2 flex items-center">
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
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Date */}
              <div>
                <label
                  className="block text-gray-900 text-sm font-semibold mb-2"
                  htmlFor="date"
                >
                  Appointment Date <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.date
                      ? "border-red-300 focus:ring-red-400 focus:border-red-500"
                      : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  type="date"
                  id="date"
                  name="date"
                  min={getTodayDate()}
                  value={form.date}
                  onChange={(e) => {
                    setForm({ ...form, date: e.target.value, time: "" });
                    if (errors.date)
                      setErrors((prev) => ({ ...prev, date: "" }));
                  }}
                  disabled={isLoading}
                  required
                />
                {errors.date && (
                  <p className="text-sm text-red-500 mt-1 flex items-center">
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

              {/* Time */}
              <div>
                <label
                  className="block text-gray-900 text-sm font-semibold mb-2"
                  htmlFor="time"
                >
                  Appointment Time <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.time
                      ? "border-red-300 focus:ring-red-400 focus:border-red-500"
                      : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  id="time"
                  name="time"
                  value={form.time}
                  onChange={(e) => {
                    setForm({ ...form, time: e.target.value });
                    if (errors.time)
                      setErrors((prev) => ({ ...prev, time: "" }));
                  }}
                  disabled={!form.date || isLoading}
                  required
                >
                  <option value="">Select time</option>
                  {availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.time && (
                  <p className="text-sm text-red-500 mt-1 flex items-center">
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
                    {errors.time}
                  </p>
                )}
              </div>
            </div>

            {/* Reason */}
            <div className="mb-6">
              <label
                className="block text-gray-900 text-sm font-semibold mb-2"
                htmlFor="reason"
              >
                Reason for Visit <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.reason
                    ? "border-red-300 focus:ring-red-400 focus:border-red-500"
                    : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                }`}
                id="reason"
                name="reason"
                rows="4"
                placeholder="Describe your symptoms or reason for the appointment..."
                value={form.reason}
                onChange={handleReasonChange}
                disabled={isLoading}
                required
              />
              <div className="flex justify-between items-center mt-1">
                <p
                  className={`text-sm ${
                    errors.reason
                      ? "text-red-500 font-medium"
                      : reasonCharCount > 450
                        ? "text-orange-500"
                        : "text-gray-500"
                  }`}
                >
                  {errors.reason || `${reasonCharCount}/500 characters`}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={isLoading || isDoctorsLoading || isSubmitting}
                className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSubmitting ? "opacity-75 cursor-wait" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                  "Schedule Appointment"
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading || isSubmitting}
                className="px-6 py-3 border border-blue-200 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Footer Info */}
          <div className="bg-blue-50 px-6 py-4 border-t border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <strong className="text-gray-900">Important:</strong> Please
                  arrive 15 minutes before your scheduled appointment time.
                  You'll receive a confirmation email once your appointment is
                  confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-blue-100">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Confirm Appointment
                </h3>
                <p className="text-gray-600 text-sm">
                  Please review your appointment details
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Doctor:</span>
                  <span className="font-semibold text-gray-900">
                    Dr. {selectedDoctor?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Specialty:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedDoctor?.specialty || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Date:</span>
                  <span className="font-semibold text-gray-900">
                    {form.date
                      ? new Date(form.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Time:</span>
                  <span className="font-semibold text-gray-900">
                    {form.time || "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={confirmAppointment}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? "Confirming..." : "Confirm"}
                </button>
                <button
                  onClick={cancelConfirmation}
                  className="px-6 py-3 border border-blue-200 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS */}
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
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}

export default AddAppointment;
