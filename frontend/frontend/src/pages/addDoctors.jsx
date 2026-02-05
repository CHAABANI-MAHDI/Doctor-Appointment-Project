import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AddDoctor() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    specialty: "",
    experienceYears: "",
    description: "",
    image: null,
  });

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Update character count when description changes
  useEffect(() => {
    setDescriptionCharCount(form.description.length);
  }, [form.description]);

  // Auto-hide notifications after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "description") {
      if (value.length <= 500) {
        setForm({ ...form, [name]: value });
        setDescriptionCharCount(value.length);
        if (formErrors.description) {
          setFormErrors((prev) => ({ ...prev, [name]: "" }));
        }
      }
    } else if (name === "experienceYears") {
      const numValue = parseInt(value);
      if (!value || (numValue >= 1 && numValue <= 100)) {
        setForm({ ...form, [name]: value });
        if (formErrors.experienceYears) {
          setFormErrors((prev) => ({ ...prev, [name]: "" }));
        }
      }
    } else if (files) {
      handleImageUpload(files[0]);
    } else {
      setForm({ ...form, [name]: value });
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  // Handle image upload with validation
  const handleImageUpload = (file) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, GIF)");
      toast.error("Please select a valid image file (JPG, PNG, GIF)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      toast.error("Image must be under 5MB");
      return;
    }

    // Set image and preview
    setForm({ ...form, image: file });
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    // Clear any previous image errors
    if (formErrors.image) {
      setFormErrors((prev) => ({ ...prev, image: "" }));
    }
    setError(null);
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Name validation
    if (!form.name.trim()) {
      errors.name = "Doctor name is required";
      isValid = false;
    } else if (form.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
      isValid = false;
    }

    // Specialty validation
    if (!form.specialty.trim()) {
      errors.specialty = "Specialty is required";
      isValid = false;
    } else if (form.specialty.trim().length < 2) {
      errors.specialty = "Specialty must be at least 2 characters";
      isValid = false;
    }

    // Experience years validation
    if (!form.experienceYears) {
      errors.experienceYears = "Experience years is required";
      isValid = false;
    } else {
      const years = parseInt(form.experienceYears);
      if (isNaN(years) || years < 1 || years > 100) {
        errors.experienceYears = "Enter a valid number (1-100)";
        isValid = false;
      }
    }

    // Description validation
    if (!form.description.trim()) {
      errors.description = "Description is required";
      isValid = false;
    } else if (form.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
      isValid = false;
    }

    // Image validation
    if (!form.image) {
      errors.image = "Doctor photo is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form
    if (!validateForm()) {
      setError("Please fill in all required fields correctly");
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("specialty", form.specialty.trim());
      formData.append("experienceYears", parseInt(form.experienceYears));
      formData.append("description", form.description.trim());
      formData.append("image", form.image);

      const res = await fetch("http://localhost:5000/doctors/addDoctors", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.msg || data.message || "Failed to add doctor";
        throw new Error(errorMsg);
      }

      // Success handling
      setSuccess("Doctor added successfully!");
      toast.success("Doctor added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form immediately
      setForm({
        name: "",
        specialty: "",
        experienceYears: "",
        description: "",
        image: null,
      });
      setPreview(null);
      setDescriptionCharCount(0);
      setFormErrors({});

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Navigate after toast completes
      setTimeout(() => {
        navigate("/");
      }, 3500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setForm({ ...form, image: null });
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (formErrors.image) {
      setFormErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  // Handle form reset
  const handleReset = () => {
    setForm({
      name: "",
      specialty: "",
      experienceYears: "",
      description: "",
      image: null,
    });
    setPreview(null);
    setDescriptionCharCount(0);
    setFormErrors({});
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Authorization check
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center border-t-4 border-blue-600">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg
              className="w-12 h-12 text-white"
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Access Restricted
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            You need administrator privileges to access this page. Please
            contact your system administrator if you believe this is an error.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Add New Doctor
          </h1>
          <p className="text-lg text-gray-600">
            Fill in the details below to register a new medical professional
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-red-500 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-red-800 font-semibold">Error</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-5 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-sm">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-green-800 font-semibold">Success</h3>
                <p className="text-green-700 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="p-8 lg:p-10">
              {/* Image Upload Section - Full Width at Top */}
              <div className="mb-10 pb-10 border-b-2 border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  Doctor Photo
                </h2>

                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Image Preview */}
                  <div className="flex-shrink-0">
                    {preview ? (
                      <div className="relative group">
                        <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-blue-100 shadow-lg">
                          <img
                            src={preview}
                            alt="Doctor preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2.5 hover:bg-red-600 transition-all shadow-lg hover:scale-110"
                          title="Remove image"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-dashed border-blue-300 flex items-center justify-center">
                        <svg
                          className="w-20 h-20 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Upload Instructions */}
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleChange(e)}
                      className="hidden"
                      name="image"
                      id="imageUpload"
                    />
                    <label
                      htmlFor="imageUpload"
                      className={`block cursor-pointer p-8 rounded-xl border-2 border-dashed transition-all ${
                        formErrors.image
                          ? "border-red-300 bg-red-50 hover:bg-red-100"
                          : "border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-400"
                      }`}
                    >
                      <div className="text-center">
                        <svg
                          className={`mx-auto h-16 w-16 mb-4 ${
                            formErrors.image ? "text-red-400" : "text-blue-500"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="text-lg font-semibold text-gray-900 mb-2">
                          {preview
                            ? "Click to change photo"
                            : "Upload doctor photo"}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          JPG, PNG or GIF (max 5MB)
                        </p>
                        <p className="text-xs text-gray-500">
                          Recommended: Professional headshot with clear
                          background
                        </p>
                      </div>
                    </label>
                    {formErrors.image && (
                      <p className="mt-3 text-sm text-red-600 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {formErrors.image}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </span>
                  Professional Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="name"
                      className="flex items-center text-sm font-bold text-gray-900 mb-2"
                    >
                      <svg
                        className="w-4 h-4 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Full Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        formErrors.name
                          ? "border-red-300 focus:ring-red-400 focus:border-red-500 bg-red-50"
                          : "border-gray-200 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      }`}
                      placeholder="Dr. John Smith"
                      maxLength="100"
                    />
                    {formErrors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
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
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Specialty */}
                  <div>
                    <label
                      htmlFor="specialty"
                      className="flex items-center text-sm font-bold text-gray-900 mb-2"
                    >
                      <svg
                        className="w-4 h-4 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                      Medical Specialty{" "}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      id="specialty"
                      type="text"
                      name="specialty"
                      value={form.specialty}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        formErrors.specialty
                          ? "border-red-300 focus:ring-red-400 focus:border-red-500 bg-red-50"
                          : "border-gray-200 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      }`}
                      placeholder="e.g., Cardiology"
                      maxLength="100"
                    />
                    {formErrors.specialty && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
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
                        {formErrors.specialty}
                      </p>
                    )}
                  </div>

                  {/* Experience Years */}
                  <div>
                    <label
                      htmlFor="experienceYears"
                      className="flex items-center text-sm font-bold text-gray-900 mb-2"
                    >
                      <svg
                        className="w-4 h-4 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                      Years of Experience{" "}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      id="experienceYears"
                      type="number"
                      name="experienceYears"
                      value={form.experienceYears}
                      onChange={handleChange}
                      disabled={isLoading}
                      min="1"
                      max="100"
                      className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        formErrors.experienceYears
                          ? "border-red-300 focus:ring-red-400 focus:border-red-500 bg-red-50"
                          : "border-gray-200 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      }`}
                      placeholder="e.g., 10"
                    />
                    {formErrors.experienceYears && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
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
                        {formErrors.experienceYears}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="description"
                      className="flex items-center text-sm font-bold text-gray-900 mb-2"
                    >
                      <svg
                        className="w-4 h-4 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 12h16M4 18h7"
                        />
                      </svg>
                      Professional Description{" "}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      disabled={isLoading}
                      rows="5"
                      className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                        formErrors.description
                          ? "border-red-300 focus:ring-red-400 focus:border-red-500 bg-red-50"
                          : "border-gray-200 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      }`}
                      placeholder="Provide a brief professional biography including expertise, qualifications, achievements, and areas of focus..."
                      maxLength="500"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        {formErrors.description && (
                          <p className="text-sm text-red-600 flex items-center">
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
                            {formErrors.description}
                          </p>
                        )}
                      </div>
                      <p
                        className={`text-sm font-medium ${
                          descriptionCharCount > 450
                            ? "text-orange-600"
                            : "text-gray-500"
                        }`}
                      >
                        {descriptionCharCount}/500
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t-2 border-gray-100">
              <div className="flex flex-col sm:flex-row-reverse gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 sm:flex-initial sm:min-w-[200px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                    isLoading ? "opacity-75 cursor-wait" : ""
                  }`}
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
                      Processing...
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Add Doctor
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isLoading}
                  className="flex-1 sm:flex-initial sm:min-w-[200px] bg-white border-2 border-gray-300 text-gray-700 font-bold py-4 px-8 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Clear Form
                  </span>
                </button>
              </div>

              <div className="mt-6 flex items-start p-4 bg-blue-50 rounded-xl border border-blue-200">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Important:</strong> All
                  fields marked with{" "}
                  <span className="text-red-500 font-semibold">*</span> are
                  required. Ensure all information is accurate before
                  submitting.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddDoctor;
