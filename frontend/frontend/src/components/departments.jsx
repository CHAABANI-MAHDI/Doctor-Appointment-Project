import { useEffect, useState } from "react";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors

        const response = await fetch(
          "http://localhost:5000/departments/getDepts",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Add any authentication headers if needed
              // "Authorization": `Bearer ${token}`
            },
          },
        );

        if (!response.ok) {
          // Try to get more detailed error message
          let errorMessage = `Failed to fetch departments: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            // If response is not JSON, use status text
            errorMessage = `Failed to fetch departments: ${response.status} ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();

        // Handle different response structures
        if (data.departments && Array.isArray(data.departments)) {
          setDepartments(data.departments);
          if (data.departments.length > 0) {
            setActiveTab(data.departments[0]._id);
          }
        } else if (Array.isArray(data)) {
          // Handle case where API returns array directly
          setDepartments(data);
          if (data.length > 0) {
            setActiveTab(data[0]._id);
          }
        } else {
          console.warn("Unexpected API response structure:", data);
          setDepartments([]);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setError(error.message);
        setDepartments([]); // Ensure departments is empty on error
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleTabClick = (id) => {
    setActiveTab(id);
  };

  const currentIndex = departments.findIndex((dept) => dept._id === activeTab);

  // Loading state
  if (loading) {
    return (
      <section className="departments-section py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading departments...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="departments-section py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="w-12 h-12 mx-auto mb-2"
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
              <p className="text-red-600 font-medium mb-2">
                Failed to load departments
              </p>
              <p className="text-gray-600 text-sm">{error}</p>
            </div>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                // Refetch departments
                const fetchDepartments = async () => {
                  try {
                    const response = await fetch(
                      "http://localhost:5000/departments/getDepts",
                    );
                    if (!response.ok) throw new Error("Failed to fetch");
                    const data = await response.json();
                    if (data.departments) {
                      setDepartments(data.departments);
                      if (data.departments.length > 0) {
                        setActiveTab(data.departments[0]._id);
                      }
                    }
                    setLoading(false);
                  } catch (err) {
                    setError(err.message);
                    setLoading(false);
                  }
                };
                fetchDepartments();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (departments.length === 0 && !loading && !error) {
    return (
      <section className="departments-section py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-md mx-auto bg-white rounded-xl p-8 shadow-sm">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Departments Available
            </h3>
            <p className="text-gray-500 mb-4">
              There are currently no departments to display.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="departments-section py-8 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Our Departments
          </h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Explore our specialized medical departments, each staffed with
            expert professionals
          </p>
        </div>

        {/* Tabs */}
        <ul className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10 border-b border-gray-200 pb-4">
          {departments.map((department) => (
            <li key={department._id}>
              <button
                onClick={() => handleTabClick(department._id)}
                className={`
                  relative px-4 py-2 md:px-5 md:py-2.5 
                  rounded-full font-medium text-sm md:text-base
                  transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${
                    activeTab === department._id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
                aria-selected={activeTab === department._id}
                role="tab"
              >
                {department.name}

                {activeTab === department._id && (
                  <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-blue-600"></span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Content */}
        <div className="relative min-h-[200px]">
          {departments.map((department) => (
            <div
              key={department._id}
              className={`
                transition-all duration-500
                ${
                  activeTab === department._id
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4 absolute inset-0 pointer-events-none"
                }
              `}
              role="tabpanel"
              aria-labelledby={`tab-${department._id}`}
            >
              <div className="grid md:grid-cols-12 gap-6">
                {/* Left Card - Department Info */}
                <div className="md:col-span-5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-xl mb-4">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                    </div>

                    {/* Department Name */}
                    <h3 className="text-xl md:text-2xl font-bold mb-2">
                      {department.name}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-blue-100 text-sm mb-6">
                      Expert Care & Treatment
                    </p>

                    {/* Additional department info if available */}
                    <div className="space-y-3 pt-4 border-t border-blue-500 border-opacity-30">
                      {department.head && (
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-20 rounded-lg">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-blue-100">
                              Department Head
                            </p>
                            <p className="text-sm font-medium">
                              {department.head}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-20 rounded-lg">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0112 0c0 .459-.031.908-.086 1.333A5 5 0 0010 11z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-blue-100">Specialists</p>
                          <p className="text-sm font-medium">
                            Experienced Team
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Card - Description */}
                <div className="md:col-span-7 bg-white rounded-xl p-6 shadow-md">
                  {/* Header with border */}
                  <div className="flex items-start mb-4">
                    <div className="w-1 h-12 bg-blue-600 rounded-full mr-4 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        About This Department
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                        {department.description ||
                          "No description available for this department. Our team of experts provides comprehensive care and treatment in this specialized field."}
                      </p>
                    </div>
                  </div>

                  {/* Additional information if available */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-4">
                      {department.staffCount && (
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold">
                              {department.staffCount}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            Medical Staff
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600">
                          24/7 Emergency
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress indicators and counter */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
                    <div className="flex gap-1.5">
                      {departments.map((_, index) => (
                        <div
                          key={index}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === currentIndex
                              ? "w-8 bg-blue-600"
                              : "w-2 bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const prevIndex =
                            (currentIndex - 1 + departments.length) %
                            departments.length;
                          setActiveTab(departments[prevIndex]._id);
                        }}
                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        aria-label="Previous department"
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
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <span className="text-sm font-medium text-gray-700">
                        {currentIndex + 1} of {departments.length}
                      </span>
                      <button
                        onClick={() => {
                          const nextIndex =
                            (currentIndex + 1) % departments.length;
                          setActiveTab(departments[nextIndex]._id);
                        }}
                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        aria-label="Next department"
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
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Departments;
