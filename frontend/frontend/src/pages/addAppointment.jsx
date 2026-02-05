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
        message: `✅ Appointment scheduled successfully with Dr. ${selectedDoctor?.name || "your doctor"} on ${formattedDate} at ${formattedTime}! You'll receive a confirmation email shortly.`,
      });

      // Reset form after success
      // WAIT for notification to complete (5s auto-hide + 0.5s buffer)
      setTimeout(() => {
        handleReset();
        navigate("/");
      }, 5500); // Changed from 2500 to 5500ms
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full animate-fade-in border border-blue-100">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <svg
                className="w-14 h-14 text-white"
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
          <p className="text-gray-600 mb-8 text-lg">
            You need to login to create an appointment.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 shadow-lg hover:shadow-xl"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Notification Toast - elegant design */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 min-w-[360px] max-w-md animate-slide-in ${
            notification.type === "success"
              ? "bg-white border-l-4 border-green-500"
              : "bg-white border-l-4 border-red-500"
          } rounded-2xl shadow-2xl overflow-hidden`}
        >
          <div className="p-5">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                {notification.type === "success" ? (
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 shadow-sm">
                    <svg
                      className="w-7 h-7"
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
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
                    <svg
                      className="w-7 h-7"
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
              <div className="ml-4 flex-1">
                <p
                  className={`text-lg font-bold ${notification.type === "success" ? "text-gray-900" : "text-gray-900"}`}
                >
                  {notification.type === "success" ? "Success!" : "Error!"}
                </p>
                <p
                  className={`text-sm mt-1 ${notification.type === "success" ? "text-gray-700" : "text-gray-700"}`}
                >
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="ml-4 flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all text-gray-400 hover:text-gray-600 hover:bg-blue-50 hover:scale-110"
                aria-label="Close notification"
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
        {/* Header - refined design */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full px-6 py-3 mb-6 shadow-lg">
            <svg
              className="w-6 h-6 mr-2"
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
            <span className="font-semibold text-lg">Schedule Appointment</span>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3 bg-gradient-to-r from-blue-700 to-gray-900 bg-clip-text text-transparent">
            Book Your Visit
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Schedule an appointment with our experienced doctors
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-blue-100">
          {/* Form Header - gradient blue */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">New Appointment</h2>
                <p className="text-blue-100 text-sm mt-2">
                  Fill in the details below
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <svg
                  className="w-10 h-10"
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
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="p-8">
            {/* Doctor Selection */}
            <div className="mb-8">
              <label
                className="block text-gray-900 text-sm font-semibold mb-3"
                htmlFor="doctor"
              >
                Select Doctor <span className="text-red-500">*</span>
              </label>

              {/* Search Input - enhanced */}
              <div className="mb-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-500 transition-all shadow-sm hover:border-blue-300"
                    aria-label="Search doctors"
                  />
                </div>
              </div>

              {isDoctorsLoading ? (
                <div className="flex items-center justify-center py-12 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl">
                  <svg
                    className="animate-spin h-10 w-10 text-blue-600 mr-4"
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
                  <span className="text-gray-700 font-medium text-lg">
                    Loading doctors...
                  </span>
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="py-12 text-center bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl">
                  <svg
                    className="mx-auto h-16 w-16 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9.172 9.172a4 4 0 015.656 0m-7.071 7.071a4 4 0 010-5.656m7.071 0a4 4 0 010 5.656"
                    />
                  </svg>
                  <p className="mt-3 text-base text-gray-700 font-medium">
                    No doctors found matching your search
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {filteredDoctors.map((doc) => (
                    <div
                      key={doc._id}
                      className={`p-5 border rounded-2xl cursor-pointer transition-all duration-300 ${
                        form.doctor === doc._id
                          ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-400"
                          : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/70 hover:shadow-sm"
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
                              src={`/uploads/${doc.image}`}
                              alt={doc.name}
                              className="w-14 h-14 rounded-2xl object-cover border-3 border-white shadow-md"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=2563eb&color=fff`;
                              }}
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                              {doc.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-gray-900 text-lg">
                                {formatDoctorName(doc.name)}
                              </p>
                              <p className="text-sm text-blue-700 font-semibold mt-0.5">
                                {doc.specialty || "General Practice"}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full flex-shrink-0 mt-1.5 ${form.doctor === doc._id ? "bg-blue-600" : "bg-gray-300"}`}
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
                          {doc.description && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-1">
                              {doc.description}
                            </p>
                          )}
                          {doc.experienceYears && (
                            <p className="text-xs text-gray-600 mt-2">
                              <span className="font-semibold text-blue-800">
                                {doc.experienceYears}
                              </span>{" "}
                              years of experience
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {errors.doctor && (
                <p className="text-sm text-red-500 mt-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Date */}
              <div>
                <label
                  className="block text-gray-900 text-sm font-semibold mb-3"
                  htmlFor="date"
                >
                  Appointment Date <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full px-5 py-3.5 border rounded-xl focus:outline-none focus:ring-3 transition-all ${
                    errors.date
                      ? "border-red-300 focus:ring-red-400 focus:border-red-500"
                      : "border-gray-200 focus:ring-blue-400 focus:border-blue-500 hover:border-blue-300"
                  } shadow-sm`}
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
                  <p className="text-sm text-red-500 mt-2 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 flex-shrink-0"
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
                  className="block text-gray-900 text-sm font-semibold mb-3"
                  htmlFor="time"
                >
                  Appointment Time <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-5 py-3.5 border rounded-xl focus:outline-none focus:ring-3 transition-all ${
                    errors.time
                      ? "border-red-300 focus:ring-red-400 focus:border-red-500"
                      : "border-gray-200 focus:ring-blue-400 focus:border-blue-500 hover:border-blue-300"
                  } shadow-sm`}
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
                  <option value="">Select a time slot</option>
                  {availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time} -{" "}
                      {time.split(":")[0] === "16"
                        ? "17:00"
                        : `${(parseInt(time.split(":")[0]) + 1).toString().padStart(2, "0")}:00`}
                    </option>
                  ))}
                </select>
                {errors.time && (
                  <p className="text-sm text-red-500 mt-2 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 flex-shrink-0"
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
                {!form.date && (
                  <p className="text-sm text-gray-500 mt-2">
                    Select a date first to see available times
                  </p>
                )}
              </div>
            </div>

            {/* Reason */}
            <div className="mb-8">
              <label
                className="block text-gray-900 text-sm font-semibold mb-3"
                htmlFor="reason"
              >
                Reason for Visit <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`w-full px-5 py-3.5 border rounded-xl focus:outline-none focus:ring-3 transition-all resize-none ${
                  errors.reason
                    ? "border-red-300 focus:ring-red-400 focus:border-red-500"
                    : "border-gray-200 focus:ring-blue-400 focus:border-blue-500 hover:border-blue-300"
                } shadow-sm`}
                id="reason"
                name="reason"
                rows="5"
                placeholder="Please describe the reason for your appointment (e.g., Annual checkup, Consultation, Follow-up, Symptoms, etc.)"
                value={form.reason}
                onChange={handleReasonChange}
                disabled={isLoading}
                required
              />
              <div className="flex justify-between items-center mt-2">
                <p
                  className={`text-sm ${
                    errors.reason
                      ? "text-red-500 font-semibold"
                      : reasonCharCount > 450
                        ? "text-orange-500 font-medium"
                        : "text-gray-500"
                  }`}
                >
                  {errors.reason || `${reasonCharCount}/500 characters`}
                </p>
                {!errors.reason && reasonCharCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, reason: "" })}
                    className="text-sm text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              {errors.reason && (
                <p className="text-sm text-red-500 mt-2 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0"
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

            {/* Buttons - enhanced */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={isLoading || isDoctorsLoading || isSubmitting}
                className={`flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  isSubmitting ? "opacity-75 cursor-wait" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
                    Scheduling Appointment...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-6 h-6 mr-2"
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
                type="button"
                onClick={handleReset}
                disabled={isLoading || isSubmitting}
                className="px-8 py-4 border-2 border-blue-200 text-blue-700 font-bold rounded-xl hover:bg-blue-50 hover:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:ring-opacity-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <svg
                  className="w-6 h-6 inline-block mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset Form
              </button>
            </div>
          </form>

          {/* Footer Info - refined */}
          <div className="bg-blue-50 px-8 py-5 border-t border-blue-100">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <svg
                  className="w-6 h-6 text-blue-600"
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
                  <strong className="text-gray-900">Note:</strong> You will
                  receive a confirmation email once your appointment is
                  confirmed by our staff. Please arrive 15 minutes before your
                  scheduled time.
                </p>
                <p className="text-xs text-gray-600 mt-1.5">
                  Appointments are typically 30 minutes long. For emergencies,
                  please call our clinic directly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog - enhanced */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-white rounded-3xl shadow-3xl max-w-md w-full p-8 animate-scale-in border border-blue-200">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg
                    className="w-10 h-10 text-blue-600"
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
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Confirm Appointment
                </h3>
                <p className="text-gray-600">
                  Please review your appointment details before confirming.
                </p>
              </div>

              <div className="space-y-5 mb-8">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <span className="text-gray-600 font-semibold">Doctor:</span>
                  <span className="font-bold text-gray-900">
                    {selectedDoctor?.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <span className="text-gray-600 font-semibold">
                    Specialty:
                  </span>
                  <span className="font-bold text-gray-900">
                    {selectedDoctor?.specialty || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <span className="text-gray-600 font-semibold">Date:</span>
                  <span className="font-bold text-gray-900">
                    {form.date
                      ? new Date(form.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <span className="text-gray-600 font-semibold">Time:</span>
                  <span className="font-bold text-gray-900">
                    {form.time || "N/A"}
                  </span>
                </div>
                <div className="flex items-start justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <span className="text-gray-600 font-semibold">Reason:</span>
                  <span className="font-medium text-gray-900 text-right text-sm">
                    {form.reason || "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={confirmAppointment}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
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
                      Confirming...
                    </span>
                  ) : (
                    "Confirm Appointment"
                  )}
                </button>
                <button
                  onClick={cancelConfirmation}
                  className="px-8 py-4 border-2 border-blue-200 text-blue-700 font-bold rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for enhanced design */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 12px;
          margin: 4px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 12px;
          border: 2px solid #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default AddAppointment;
