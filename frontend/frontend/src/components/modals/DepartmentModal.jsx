// components/modals/DepartmentModal.jsx - Enhanced Modal
import { useState, useEffect } from "react";

export default function DepartmentModal({
  isOpen,
  onClose,
  onSave,
  department,
  isEditing = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    head: "",
    description: "",
    staffCount: 0,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || "",
        head: department.head || "",
        description: department.description || "",
        staffCount: department.staffCount || 0,
      });
    } else {
      setFormData({
        name: "",
        head: "",
        description: "",
        staffCount: 0,
      });
    }
    setErrors({});
  }, [department, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Department name is required";
    if (!formData.head.trim()) newErrors.head = "Department head is required";
    if (formData.staffCount < 0)
      newErrors.staffCount = "Staff count cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSave(formData);
  };

  const handleNumberChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    setFormData({ ...formData, [field]: numValue });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {isEditing ? "Edit Department" : "Add New Department"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
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
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Cardiology"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department Head <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.head}
                onChange={(e) =>
                  setFormData({ ...formData, head: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.head ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Dr. Sarah Johnson"
                required
              />
              {errors.head && (
                <p className="mt-1 text-sm text-red-600">{errors.head}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Staff Count
                </label>
                <input
                  type="number"
                  value={formData.staffCount}
                  onChange={(e) =>
                    handleNumberChange("staffCount", e.target.value)
                  }
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.staffCount ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.staffCount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.staffCount}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Describe the department's focus and responsibilities..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Changes
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
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
                  Add Department
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
