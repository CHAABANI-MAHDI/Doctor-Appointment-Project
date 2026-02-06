import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AddDoctorModal = ({ doctor, onClose, onSuccess }) => {
  const isEditing = !!doctor;
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    description: "",
    experienceYears: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || "",
        specialty: doctor.specialty || "",
        description: doctor.description || "",
        experienceYears: doctor.experienceYears || "",
        image: null,
      });
      if (doctor.image) {
        setPreviewUrl(`http://localhost:5000/pic-uploads/${doctor.image}`);
      }
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(
        doctor?.image
          ? `http://localhost:5000/pic-uploads/${doctor.image}`
          : "",
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("specialty", formData.specialty);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("experienceYears", formData.experienceYears);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const url = isEditing
        ? `http://localhost:5000/doctors/updateDoctor/${doctor._id}`
        : "http://localhost:5000/doctors/addDoctors";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          isEditing
            ? "Doctor updated successfully"
            : "Doctor added successfully",
        );
        onSuccess();
      } else {
        setError(data.msg || "Failed to save doctor");
        toast.error(data.msg || "Failed to save doctor");
      }
    } catch (error) {
      setError("Error saving doctor");
      toast.error("Error saving doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing ? "Edit Doctor" : "Add New Doctor"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {isEditing
                  ? "Update doctor information"
                  : "Add a new medical professional to your team"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Profile Image Preview */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <svg
                          className="w-12 h-12 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"
                          />
                        </svg>
                        <span className="text-xs text-gray-500 mt-2">
                          No image
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dr. John Smith"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty *
                  </label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Cardiology, Neurology, etc."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description about the doctor's expertise and experience..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience (Years) *
                  </label>
                  <input
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    min="0"
                    max="50"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                   
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: Square image, at least 400x400 pixels
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {isEditing ? "Updating..." : "Adding..."}
                    </span>
                  ) : isEditing ? (
                    "Update Doctor"
                  ) : (
                    "Add Doctor"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorModal;
