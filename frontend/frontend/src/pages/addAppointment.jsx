/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Star,
  Award,
  Shield,
  CheckCircle,
  ChevronRight,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronDown,
  Info,
  FileText,
  Heart,
  Brain,
  Eye,
  Bone,
  Baby,
  Thermometer,
} from "lucide-react";

function AddAppointment() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // State management
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([
    {
      id: "cardiology",
      name: "Cardiology",
      icon: <Heart className="w-5 h-5" />,
      color: "text-red-500",
    },
    {
      id: "neurology",
      name: "Neurology",
      icon: <Brain className="w-5 h-5" />,
      color: "text-purple-500",
    },
    {
      id: "orthopedics",
      name: "Orthopedics",
      icon: <Bone className="w-5 h-5" />,
      color: "text-blue-500",
    },
    {
      id: "pediatrics",
      name: "Pediatrics",
      icon: <Baby className="w-5 h-5" />,
      color: "text-pink-500",
    },
    {
      id: "general",
      name: "General Practice",
      icon: <Thermometer className="w-5 h-5" />,
      color: "text-green-500",
    },
    {
      id: "ophthalmology",
      name: "Ophthalmology",
      icon: <Eye className="w-5 h-5" />,
      color: "text-indigo-500",
    },
  ]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    doctor: "",
    date: "",
    time: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});
  const [isDoctorsLoading, setIsDoctorsLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reasonCharCount, setReasonCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const days = [];
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const startingDay = firstDay.getDay();

    // Previous month days
    const prevMonthLastDay = new Date(selectedYear, selectedMonth, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        date: new Date(selectedYear, selectedMonth - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        isAvailable: false,
      });
    }

    // Current month days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(selectedYear, selectedMonth, i);
      const isPast = date < today;
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      days.push({
        day: i,
        date,
        isCurrentMonth: true,
        isAvailable: !isPast && !isWeekend,
        isToday: date.toDateString() === today.toDateString(),
      });
    }

    // Next month days
    const totalCells = 42; // 6 weeks
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        date: new Date(selectedYear, selectedMonth + 1, i),
        isCurrentMonth: false,
        isAvailable: false,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Time slots
  const timeSlots = [
    { id: 1, time: "09:00", display: "9:00 AM", available: true },
    { id: 2, time: "09:30", display: "9:30 AM", available: true },
    { id: 3, time: "10:00", display: "10:00 AM", available: false },
    { id: 4, time: "10:30", display: "10:30 AM", available: true },
    { id: 5, time: "11:00", display: "11:00 AM", available: true },
    { id: 6, time: "11:30", display: "11:30 AM", available: true },
    { id: 7, time: "14:00", display: "2:00 PM", available: true },
    { id: 8, time: "14:30", display: "2:30 PM", available: false },
    { id: 9, time: "15:00", display: "3:00 PM", available: true },
    { id: 10, time: "15:30", display: "3:30 PM", available: true },
    { id: 11, time: "16:00", display: "4:00 PM", available: true },
    { id: 12, time: "16:30", display: "4:30 PM", available: true },
  ];

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/doctors/getDoctors");
        if (!res.ok) throw new Error("Failed to fetch doctors");
        const data = await res.json();
        const doctorsList = data.doctors || [];
        setDoctors(doctorsList);
        setFilteredDoctors(doctorsList);
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

  // Filter doctors based on search and specialty
  useEffect(() => {
    let filtered = doctors;

    if (selectedSpecialty !== "all") {
      filtered = filtered.filter(
        (doc) =>
          (doc.specialty || "General Practice").toLowerCase() ===
          selectedSpecialty,
      );
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(query) ||
          (doc.specialty && doc.specialty.toLowerCase().includes(query)) ||
          (doc.bio && doc.bio.toLowerCase().includes(query)),
      );
    }

    setFilteredDoctors(filtered);
  }, [selectedSpecialty, searchQuery, doctors]);

  // Update selected doctor
  useEffect(() => {
    if (form.doctor) {
      const doctor = doctors.find((doc) => doc._id === form.doctor);
      setSelectedDoctor(doctor);
    } else {
      setSelectedDoctor(null);
    }
  }, [form.doctor, doctors]);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle date selection
  const handleDateSelect = (day) => {
    if (!day.isAvailable) return;
    setSelectedDay(day);
    const formattedDate = day.date.toISOString().split("T")[0];
    setForm((prev) => ({ ...prev, date: formattedDate, time: "" }));
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setForm((prev) => ({ ...prev, time: time.time }));
  };

  // Navigate calendar months
  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!form.doctor) {
      newErrors.doctor = "Please select a doctor";
    }

    if (!form.date) {
      newErrors.date = "Date is required";
    }

    if (!form.time) {
      newErrors.time = "Time is required";
    }

    if (!form.reason) {
      newErrors.reason = "Reason is required";
    } else if (form.reason.length < 10) {
      newErrors.reason = "Reason must be at least 10 characters";
    } else if (form.reason.length > 500) {
      newErrors.reason = "Reason cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle reason input
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

  // Handle form submission
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

    setShowConfirmation(true);
  };

  // Confirm appointment
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

      setTimeout(() => {
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

  // Navigation between steps
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit(new Event("submit"));
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Format doctor name
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
              <User className="w-10 h-10 text-white" />
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
     
     
      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* Progress Steps */}
        <div className="max-w-6xl mx-auto mb-10">
          <div className="flex items-center justify-between">
            {[
              {
                number: 1,
                title: "Select Doctor",
                desc: "Choose your specialist",
              },
              {
                number: 2,
                title: "Pick Date & Time",
                desc: "Schedule your visit",
              },
              { number: 3, title: "Confirm Details", desc: "Review & book" },
            ].map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${currentStep >= step.number ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 bg-white text-gray-400"} transition-all duration-300`}
                  >
                    {step.number}
                  </div>
                  <div className="mt-2 text-center">
                    <div
                      className={`text-sm font-semibold ${currentStep >= step.number ? "text-blue-600" : "text-gray-400"}`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.desc}</div>
                  </div>
                </div>
                {index < 2 && (
                  <div className="flex-1 h-0.5 mx-4 bg-gray-200">
                    <div
                      className={`h-full transition-all duration-300 ${currentStep > step.number ? "bg-blue-600" : "bg-transparent"}`}
                      style={{
                        width: currentStep > step.number ? "100%" : "0%",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Step 1: Doctor Selection */}
                {currentStep === 1 && (
                  <div className="p-8">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Find Your Specialist
                      </h2>
                      <p className="text-gray-600">
                        Browse our network of certified medical professionals
                      </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                      <Search
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        placeholder="Search by doctor name, specialty, or expertise..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      />
                    </div>

                    {/* Specialty Filter */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Filter by Specialty
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        <button
                          onClick={() => setSelectedSpecialty("all")}
                          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedSpecialty === "all" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-white"}`}
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                            <Filter className="w-5 h-5 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            All
                          </span>
                        </button>
                        {specialties.map((specialty) => (
                          <button
                            key={specialty.id}
                            onClick={() => setSelectedSpecialty(specialty.id)}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedSpecialty === specialty.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-white"}`}
                          >
                            <div
                              className={`w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2 ${specialty.color}`}
                            >
                              {specialty.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {specialty.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Doctors List */}
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Available Doctors
                          <span className="ml-2 text-sm text-gray-500 font-normal">
                            ({filteredDoctors.length} found)
                          </span>
                        </h3>
                      </div>

                      {isDoctorsLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                      ) : filteredDoctors.length > 0 ? (
                        <div className="space-y-4">
                          {filteredDoctors.map((doctor) => (
                            <div
                              key={doctor._id}
                              onClick={() => {
                                setForm({ ...form, doctor: doctor._id });
                                setSelectedDoctor(doctor);
                              }}
                              className={`group p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${form.doctor === doctor._id ? "border-blue-500 bg-gradient-to-r from-blue-50 to-white shadow-md" : "border-gray-200 hover:border-blue-300 hover:shadow-sm bg-white"}`}
                            >
                              <div className="flex items-start space-x-6">
                                {/* Doctor Avatar */}
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-100">
                                  {doctor.image ? (
                                    <img
                                      src={`http://localhost:5000/pic-uploads/${doctor.image}`}
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
                                      <span className="text-2xl font-bold text-blue-600">
                                        {doctor.name?.charAt(0) || "D"}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Doctor Info */}
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="text-xl font-bold text-gray-900">
                                        Dr. {formatDoctorName(doctor.name)}
                                      </h3>
                                      <p className="text-blue-600 font-semibold mt-1">
                                        {doctor.specialty || "General Practice"}
                                      </p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                      <span className="font-semibold text-gray-900">
                                        4.8
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        (120+)
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-6 mt-3">
                                    <div className="flex items-center text-gray-600">
                                      <Award className="w-4 h-4 mr-2 text-blue-500" />
                                      <span className="text-sm">
                                        {doctor.experienceYears || 10}+ years
                                        experience
                                      </span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                      <Clock className="w-4 h-4 mr-2 text-blue-500" />
                                      <span className="text-sm">
                                        30 min consultation
                                      </span>
                                    </div>
                                  </div>

                                  <p className="text-gray-600 mt-4 leading-relaxed">
                                    {doctor.bio ||
                                      "Board-certified specialist with extensive experience in patient care and treatment planning."}
                                  </p>

                                  <div className="flex items-center justify-between mt-6">
                                    <div className="text-sm text-gray-500">
                                      Consultation Fee:{" "}
                                      <span className="font-bold text-gray-900">
                                        $125
                                      </span>
                                    </div>
                                    <div className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                                      Available Today
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl">
                          <Search
                            className="mx-auto text-gray-400 mb-4"
                            size={56}
                          />
                          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                            No doctors found
                          </h3>
                          <p className="text-gray-600 max-w-md mx-auto mb-6">
                            We couldn't find any doctors matching your criteria.
                            Try adjusting your search or filter.
                          </p>
                          <button
                            onClick={() => {
                              setSearchQuery("");
                              setSelectedSpecialty("all");
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                          >
                            Reset Filters
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Date & Time Selection */}
                {currentStep === 2 && (
                  <div className="p-8">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Schedule Your Appointment
                      </h2>
                      <p className="text-gray-600">
                        Select your preferred date and time slot
                      </p>
                    </div>

                    {/* Selected Doctor Card */}
                    {selectedDoctor && (
                      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
                              {selectedDoctor.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                Dr. {formatDoctorName(selectedDoctor.name)}
                              </h3>
                              <p className="text-blue-600 font-medium">
                                {selectedDoctor.specialty || "General Practice"}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setCurrentStep(1)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Change Doctor
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Calendar Section */}
                      <div>
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Select Date
                            </h3>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={prevMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                              </button>
                              <span className="font-semibold text-gray-900">
                                {monthNames[selectedMonth]} {selectedYear}
                              </span>
                              <button
                                onClick={nextMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                              </button>
                            </div>
                          </div>

                          {/* Calendar Grid */}
                          <div className="bg-white border border-gray-200 rounded-xl p-4">
                            {/* Weekday Headers */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                              {[
                                "Sun",
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                              ].map((day) => (
                                <div
                                  key={day}
                                  className="text-center text-sm font-medium text-gray-500 py-2"
                                >
                                  {day}
                                </div>
                              ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 gap-1">
                              {calendarDays.map((day, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleDateSelect(day)}
                                  disabled={!day.isAvailable}
                                  className={`aspect-square p-2 rounded-lg transition-all ${!day.isCurrentMonth ? "text-gray-400" : ""} ${day.isToday ? "bg-blue-50 text-blue-600 font-bold" : ""} ${selectedDay?.date?.toDateString() === day.date.toDateString() ? "bg-blue-600 text-white" : day.isAvailable ? "hover:bg-blue-50 text-gray-900" : "text-gray-400 cursor-not-allowed"}`}
                                >
                                  <div className="flex flex-col items-center justify-center h-full">
                                    <span
                                      className={`text-sm ${selectedDay?.date?.toDateString() === day.date.toDateString() ? "font-bold" : ""}`}
                                    >
                                      {day.day}
                                    </span>
                                    {day.isToday && !selectedDay && (
                                      <div className="w-1 h-1 rounded-full bg-blue-600 mt-1"></div>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Selected Date Summary */}
                        {selectedDay && (
                          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-gray-600">
                                  Selected Date
                                </div>
                                <div className="font-semibold text-gray-900">
                                  {selectedDay.date.toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday: "long",
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )}
                                </div>
                              </div>
                              <Calendar className="w-6 h-6 text-blue-500" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Time Slots Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                          Available Time Slots
                        </h3>

                        {selectedDay ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              {timeSlots.map((slot) => (
                                <button
                                  key={slot.id}
                                  onClick={() => handleTimeSelect(slot)}
                                  disabled={!slot.available}
                                  className={`p-4 rounded-xl border-2 text-center transition-all ${!slot.available ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed" : form.time === slot.time ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm" : "border-gray-200 hover:border-blue-300 hover:shadow-sm bg-white text-gray-700"}`}
                                >
                                  <div className="font-semibold">
                                    {slot.display}
                                  </div>
                                  {!slot.available && (
                                    <div className="text-xs mt-1 text-gray-500">
                                      Unavailable
                                    </div>
                                  )}
                                  {form.time === slot.time && (
                                    <div className="text-xs mt-1 text-blue-600 font-medium">
                                      Selected
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>

                            {form.time && (
                              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-sm text-gray-600">
                                      Selected Time
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                      {
                                        timeSlots.find(
                                          (s) => s.time === form.time,
                                        )?.display
                                      }
                                    </div>
                                  </div>
                                  <Clock className="w-6 h-6 text-green-500" />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-gray-50 rounded-2xl">
                            <Calendar
                              className="mx-auto text-gray-400 mb-4"
                              size={48}
                            />
                            <p className="text-gray-600">
                              Please select a date to view available time slots
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Reason and Review */}
                {currentStep === 3 && (
                  <div className="p-8">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Complete Your Booking
                      </h2>
                      <p className="text-gray-600">
                        Review details and provide visit information
                      </p>
                    </div>

                    {/* Appointment Summary Card */}
                    <div className="mb-8">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">
                          Appointment Summary
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <div className="text-sm text-gray-600 mb-1">
                                Doctor
                              </div>
                              <div className="font-semibold text-gray-900 text-lg">
                                {selectedDoctor
                                  ? `Dr. ${formatDoctorName(selectedDoctor.name)}`
                                  : "Not selected"}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600 mb-1">
                                Specialty
                              </div>
                              <div className="font-semibold text-gray-900">
                                {selectedDoctor?.specialty ||
                                  "General Practice"}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <div className="text-sm text-gray-600 mb-1">
                                Date & Time
                              </div>
                              <div className="font-semibold text-gray-900">
                                {selectedDay && form.time ? (
                                  <>
                                    {selectedDay.date.toLocaleDateString(
                                      "en-US",
                                      {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                      },
                                    )}
                                    ,{" "}
                                    {
                                      timeSlots.find(
                                        (s) => s.time === form.time,
                                      )?.display
                                    }
                                  </>
                                ) : (
                                  "Not selected"
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600 mb-1">
                                Duration
                              </div>
                              <div className="font-semibold text-gray-900">
                                30 minutes
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reason for Visit */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Reason for Visit
                      </h3>
                      <div className="mb-6">
                        <textarea
                          className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50"
                          rows="5"
                          placeholder="Please describe your symptoms, concerns, or reason for the appointment in detail..."
                          value={form.reason}
                          onChange={handleReasonChange}
                          required
                        />
                        <div className="flex justify-between items-center mt-2">
                          <p
                            className={`text-sm ${errors.reason ? "text-red-500" : "text-gray-500"}`}
                          >
                            {errors.reason ||
                              `${reasonCharCount}/500 characters`}
                          </p>
                          <div className="text-sm text-gray-500">
                            <FileText className="inline w-4 h-4 mr-1" />
                            Required
                          </div>
                        </div>
                      </div>

                      {/* Additional Notes */}
                      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                        <div className="flex items-start">
                          <Info className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-yellow-800">
                            <strong className="font-semibold">
                              Important:
                            </strong>{" "}
                            Please provide detailed information about your
                            symptoms to help your doctor prepare for your visit.
                            Include duration, severity, and any related
                            concerns.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="border-t border-gray-200 p-8 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={previousStep}
                      className={`px-8 py-3 rounded-xl font-semibold transition-all ${currentStep > 1 ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100" : "invisible"}`}
                    >
                      ← Previous Step
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={
                        isSubmitting ||
                        (currentStep === 1 && !form.doctor) ||
                        (currentStep === 2 && !form.time) ||
                        (currentStep === 3 && !form.reason)
                      }
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </span>
                      ) : currentStep === 3 ? (
                        "Book Appointment"
                      ) : (
                        "Continue to Next Step →"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Summary & Features */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Pricing & Insurance
                </h3>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm opacity-90">
                          Standard Consultation
                        </div>
                        <div className="text-4xl font-bold">$125</div>
                      </div>
                      <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                        30 min
                      </div>
                    </div>
                    <p className="text-sm opacity-90">
                      In-person appointment with your selected specialist
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">
                          Insurance Accepted
                        </div>
                        <div className="text-sm text-gray-600">
                          We work with most major providers
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">
                          No Hidden Fees
                        </div>
                        <div className="text-sm text-gray-600">
                          Transparent pricing upfront
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">
                          Easy Cancellation
                        </div>
                        <div className="text-sm text-gray-600">
                          Free cancellation up to 24 hours
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-2">
                      Estimated total
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-gray-900">
                        $125
                      </div>
                      <div className="text-sm text-gray-500">
                        (tax included)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
                    <CheckCircle size={24} />
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

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">
                Confirm Appointment
              </h3>
              <p className="text-center text-blue-100">
                Please review your appointment details
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600">Doctor</div>
                    <div className="font-semibold text-gray-900">
                      {selectedDoctor
                        ? `Dr. ${formatDoctorName(selectedDoctor.name)}`
                        : "N/A"}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg font-bold">
                    {selectedDoctor?.name?.charAt(0) || "D"}
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600">Date & Time</div>
                    <div className="font-semibold text-gray-900">
                      {selectedDay && form.time ? (
                        <>
                          {selectedDay.date.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                          ,{" "}
                          {timeSlots.find((s) => s.time === form.time)?.display}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </div>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600">
                      Consultation Fee
                    </div>
                    <div className="font-semibold text-gray-900">$125</div>
                  </div>
                  <div className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                    Insurance Accepted
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={confirmAppointment}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Confirming...
                    </span>
                  ) : (
                    "Confirm & Book"
                  )}
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
      `}</style>
    </div>
  );
}

export default AddAppointment;
