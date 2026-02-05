import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Added import
import { toast } from "react-toastify";

function AddDoctor() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Added navigation hook
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
      setSuccess("✅ Doctor added successfully!");
      toast.success("✅ Doctor added successfully!", {
        position: "top-right",
        autoClose: 3000, // Toast will stay visible for 3 seconds
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

      // Navigate AFTER toast completes (3s + 0.5s buffer)
      setTimeout(() => {
        navigate("/");
      }, 3500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message);
      toast.error(`❌ ${error.message}`, {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-fade-in border-2 border-blue-200">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            Only administrators can add doctors.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition shadow-md hover:shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block bg-blue-700 text-white rounded-full px-6 py-3 mb-4 shadow-lg">
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="font-semibold text-lg">Add New Doctor</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Doctor Registration
          </h1>
          <p className="text-blue-700 font-medium">
            Fill in all required information to add a new doctor to the system
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up border-2 border-blue-200">
          {/* Form Header */}
          <div className="bg-blue-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">New Doctor Form</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Please fill in all required fields
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8"
            encType="multipart/form-data"
          >
            {/* Inline Notifications */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-300 animate-fade-in">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-300 animate-fade-in">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">{success}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Image Upload */}
              <div className="space-y-6">
                <div className="text-center">
                  <label className="block text-gray-800 text-sm font-semibold mb-2">
                    Doctor Photo <span className="text-red-500">*</span>
                  </label>

                  <div
                    className={`border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all ${
                      formErrors.image
                        ? "border-red-400 bg-red-50"
                        : "border-blue-300 hover:border-blue-400 bg-blue-50"
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleChange(e)}
                      className="hidden"
                      name="image"
                    />

                    {preview ? (
                      <div className="relative inline-block">
                        <img
                          src={preview}
                          alt="Doctor preview"
                          className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage();
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition transform hover:scale-110 shadow-md"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="w-48 h-48 mx-auto mb-4">
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                          <svg
                            className="w-20 h-20 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      {preview ? (
                        <p className="text-sm text-blue-700 font-medium">
                          ✓ Image selected - Click to change
                        </p>
                      ) : (
                        <>
                          <p className="text-blue-700 font-semibold mb-1">
                            Click to upload photo
                          </p>
                          <p className="text-xs text-blue-600">
                            JPG, PNG, GIF (max 5MB)
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {formErrors.image && (
                    <p className="mt-2 text-xs text-red-600 flex items-center justify-center">
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
                      {formErrors.image}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-800 text-sm font-semibold mb-2"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.name
                        ? "border-red-400 focus:ring-red-500"
                        : "border-blue-300 focus:ring-blue-500"
                    } transition`}
                    placeholder="Dr. John Smith"
                    maxLength="100"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
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
                    className="block text-gray-800 text-sm font-semibold mb-2"
                  >
                    Medical Specialty <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="specialty"
                    type="text"
                    name="specialty"
                    value={form.specialty}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.specialty
                        ? "border-red-400 focus:ring-red-500"
                        : "border-blue-300 focus:ring-blue-500"
                    } transition`}
                    placeholder="Cardiology, Neurology, Pediatrics, etc."
                    maxLength="100"
                  />
                  {formErrors.specialty && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
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
                    className="block text-gray-800 text-sm font-semibold mb-2"
                  >
                    Years of Experience <span className="text-red-500">*</span>
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.experienceYears
                        ? "border-red-400 focus:ring-red-500"
                        : "border-blue-300 focus:ring-blue-500"
                    } transition`}
                    placeholder="e.g., 10"
                  />
                  {formErrors.experienceYears && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
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
                <div>
                  <label
                    htmlFor="description"
                    className="block text-gray-800 text-sm font-semibold mb-2"
                  >
                    Professional Description{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    disabled={isLoading}
                    rows="4"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.description
                        ? "border-red-400 focus:ring-red-500"
                        : "border-blue-300 focus:ring-blue-500"
                    } transition resize-none`}
                    placeholder="Brief professional bio, expertise, and qualifications..."
                    maxLength="500"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p
                      className={`text-xs ${
                        formErrors.description
                          ? "text-red-600"
                          : descriptionCharCount > 450
                            ? "text-orange-600"
                            : "text-blue-600"
                      }`}
                    >
                      {formErrors.description ||
                        `${descriptionCharCount}/500 characters`}
                    </p>
                    {descriptionCharCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, description: "" })}
                        className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {formErrors.description && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
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
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-blue-200 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLoading ? "opacity-75 cursor-wait" : ""
                } shadow-md hover:shadow-lg`}
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
                    Adding Doctor...
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
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
                className="px-6 py-3 border-2 border-blue-300 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
              >
                <svg
                  className="w-5 h-5 inline-block mr-2"
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

          {/* Footer Info */}
          <div className="bg-blue-50 px-8 py-4 border-t border-blue-200">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-blue-800">
                <strong className="text-blue-900">Note:</strong> All fields
                marked with <span className="text-red-500">*</span> are
                required. Doctor photo should be a professional headshot for
                best results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
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
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

export default AddDoctor;
