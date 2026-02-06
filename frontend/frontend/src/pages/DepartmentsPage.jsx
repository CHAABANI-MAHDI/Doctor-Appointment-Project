// pages/DepartmentsPage.js - Admin Departments Management Page
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
  Building,
  Eye,
  Download,
  RefreshCw,
  XCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Mail,
  Phone,
  Calendar,
  Clock,
  Shield,
  Heart,
  Brain,
  Bone,
  Baby,
  Thermometer,
  Filter,
  SortAsc,
  Grid,
  List,
  Image as ImageIcon,
} from "lucide-react";

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("name"); // name
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [stats, setStats] = useState({
    total: 0,
    avgLength: 0,
    newest: null,
    oldest: null,
  });

  // Fetch departments data
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Calculate statistics
  useEffect(() => {
    if (departments.length > 0) {
      const total = departments.length;
      const avgLength = Math.round(
        departments.reduce(
          (sum, dept) => sum + (dept.description?.length || 0),
          0,
        ) / total,
      );

      // Find newest and oldest departments (by creation date if available)
      const sortedByDate = [...departments].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );

      setStats({
        total,
        avgLength,
        newest: sortedByDate[0],
        oldest: sortedByDate[sortedByDate.length - 1],
      });
    }
  }, [departments]);

  // Filter and sort departments
  useEffect(() => {
    let filtered = [...departments];

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (dept) =>
          dept.name.toLowerCase().includes(query) ||
          dept.description?.toLowerCase().includes(query),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    setFilteredDepartments(filtered);
  }, [departments, searchQuery, sortBy]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/departments/getDepts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch departments: ${response.status}`);
      }

      const data = await response.json();

      // Handle different response structures
      const departmentsData = data.departments || data || [];
      setDepartments(departmentsData);
      setFilteredDepartments(departmentsData);

      toast.success(
        `${departmentsData.length} departments loaded successfully!`,
      );
    } catch (err) {
      console.error("Error fetching departments:", err);
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentIcon = (name) => {
    const icons = {
      Cardiology: <Heart className="w-5 h-5" />,
      Neurology: <Brain className="w-5 h-5" />,
      Orthopedics: <Bone className="w-5 h-5" />,
      Pediatrics: <Baby className="w-5 h-5" />,
      Radiology: <Shield className="w-5 h-5" />,
      "General Practice": <Thermometer className="w-5 h-5" />,
    };
    return icons[name] || <Building className="w-5 h-5" />;
  };

  const handleAddDepartment = async () => {
    try {
      // Validate form
      if (!formData.name) {
        toast.error("Department name is required");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/departments/createDept",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to add department");
      }

      const newDepartment = await response.json();

      // Add to local state
      setDepartments([
        ...departments,
        newDepartment.department || newDepartment,
      ]);
      setShowAddModal(false);
      resetForm();
      toast.success("Department added successfully! 🎉");
    } catch (err) {
      console.error("Error adding department:", err);
      toast.error(err.message || "Failed to add department");
    }
  };

  const handleEditDepartment = async () => {
    try {
      if (!selectedDepartment) return;

      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/departments/updateDept/${selectedDepartment._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to update department");
      }

      const updatedDepartment = await response.json();

      // Update local state
      setDepartments(
        departments.map((dept) =>
          dept._id === selectedDepartment._id
            ? updatedDepartment.department || updatedDepartment
            : dept,
        ),
      );
      setShowEditModal(false);
      resetForm();
      toast.success("Department updated successfully! ✨");
    } catch (err) {
      console.error("Error updating department:", err);
      toast.error(err.message || "Failed to update department");
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      if (!selectedDepartment) return;

      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/departments/deleteDept/${selectedDepartment._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to delete department");
      }

      // Remove from local state
      setDepartments(
        departments.filter((dept) => dept._id !== selectedDepartment._id),
      );
      setShowDeleteModal(false);
      setSelectedDepartment(null);
      toast.success("Department deleted successfully! 🗑️");
    } catch (err) {
      console.error("Error deleting department:", err);
      toast.error(err.message || "Failed to delete department");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
    });
  };

  const openEditModal = (department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name || "",
      description: department.description || "",
      image: department.image || "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (department) => {
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  };

  const openDetailsModal = (department) => {
    setSelectedDepartment(department);
    setShowDetailsModal(true);
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm font-medium text-gray-600 mt-1">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
          <div
            className={`${color.replace("bg-", "text-").replace("/20", "")}`}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Building className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Loading Departments
            </h2>
            <p className="text-gray-600">
              Please wait while we retrieve department data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Departments Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage all medical departments
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchDepartments}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center hover:shadow-sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Department
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Departments"
              value={stats.total}
              icon={<Building className="w-6 h-6" />}
              color="bg-blue-100"
              trend={5}
            />
            <StatCard
              title="Avg Description Length"
              value={stats.avgLength}
              icon={<BarChart3 className="w-6 h-6" />}
              color="bg-green-100"
              subtitle="characters"
            />
            <StatCard
              title="Newest Department"
              value={
                stats.newest
                  ? stats.newest.name.substring(0, 12) + "..."
                  : "N/A"
              }
              icon={<TrendingUp className="w-6 h-6" />}
              color="bg-purple-100"
            />
            <StatCard
              title="Oldest Department"
              value={
                stats.oldest
                  ? stats.oldest.name.substring(0, 12) + "..."
                  : "N/A"
              }
              icon={<Clock className="w-6 h-6" />}
              color="bg-yellow-100"
            />
          </div>

          {/* Search and Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative max-w-lg">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search departments by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-2 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Sort by Name</option>
                  </select>
                  <SortAsc className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Departments Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDepartments.map((department) => (
            <div
              key={department._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Department Image or Icon */}
              <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative overflow-hidden">
                {department.image ? (
                  <img
                    src={`http://localhost:5000/${department.image.replace(/^[\\/]+/, "")}`}
                    alt={department.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        department.name,
                      )}&background=2563eb&color=fff&size=400`;
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-blue-600">
                    <div className="w-20 h-20 rounded-full bg-white/50 flex items-center justify-center mb-4">
                      {getDepartmentIcon(department.name)}
                    </div>
                    <p className="text-sm font-medium">No image available</p>
                  </div>
                )}
                <div className="absolute top-3 right-3 flex space-x-1">
                  <button
                    onClick={() => openDetailsModal(department)}
                    className="p-2 bg-white/90 backdrop-blur-sm text-blue-600 hover:text-blue-800 hover:bg-white rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Department Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {department.name}
                  </h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    ID: {department._id?.slice(-6)}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {department.description || "No description available."}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={() => openDetailsModal(department)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center group-hover:underline"
                  >
                    View Details
                  </button>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(department)}
                      className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(department)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDepartments.length === 0 && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? "No departments found" : "No departments yet"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search criteria or clear the search."
                : "Get started by adding your first department to manage hospital services."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Clear Search
                </button>
              )}
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Add First Department
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Department Details Modal */}
      {showDetailsModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Department Image */}
            <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
              {selectedDepartment.image ? (
                <img
                  src={`http://localhost:5000/${selectedDepartment.image.replace(/^[\\/]+/, "")}`}
                  alt={selectedDepartment.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      selectedDepartment.name,
                    )}&background=2563eb&color=fff&size=800`;
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-blue-600">
                  <div className="w-32 h-32 rounded-full bg-white/50 flex items-center justify-center mb-6">
                    {getDepartmentIcon(selectedDepartment.name)}
                  </div>
                  <p className="text-lg font-medium">No image available</p>
                </div>
              )}
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedDepartment(null);
                }}
                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedDepartment.name}
              </h2>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedDepartment.description ||
                    "No description available."}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Department Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Department ID</div>
                    <div className="font-mono text-sm">
                      {selectedDepartment._id}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Created</div>
                    <div className="text-sm">
                      {selectedDepartment.createdAt
                        ? new Date(
                            selectedDepartment.createdAt,
                          ).toLocaleDateString()
                        : "Date not available"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    openEditModal(selectedDepartment);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Edit className="w-4 h-4 inline mr-2" />
                  Edit Department
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedDepartment(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Add New Department</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Cardiology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    placeholder="Describe the department's focus, services, and expertise..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL (Optional)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Provide a URL to an image for this department
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDepartment}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Add Department
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Edit Department</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL (Optional)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditDepartment}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">
                Delete Department
              </h3>
              <p className="text-center text-red-100">
                Are you sure you want to delete this department?
              </p>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center p-4 bg-red-50 rounded-lg mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-bold mr-4">
                    {getDepartmentIcon(selectedDepartment.name)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {selectedDepartment.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      ID: {selectedDepartment._id?.slice(-6)}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <strong className="font-semibold">Warning:</strong> This
                      action cannot be undone. All department data will be
                      permanently deleted.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteDepartment}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedDepartment(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;
