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
        const response = await fetch(
          "http://localhost:5000/departments/getDepts",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch departments");
        }

        const data = await response.json();
        setDepartments(data.departments || []);

        if (data.departments?.length > 0) {
          setActiveTab(data.departments[0]._id);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setError(error.message);
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
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (departments.length === 0) {
    return (
      <section className="departments-section py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">No departments available</p>
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
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    activeTab === department._id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
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
        <div className="relative min-h-[140px]">
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
            >
              <div className="grid md:grid-cols-12 gap-4">
                {/* Left Card - Department Info */}
                <div className="md:col-span-5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-lg mb-3">
                      <svg
                        className="w-5 h-5 text-white"
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
                    <h3 className="text-lg md:text-xl font-bold mb-1">
                      {department.name}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-blue-100 text-xs mb-4">
                      Expert Care & Treatment
                    </p>

                    {/* Experienced Specialists */}
                    <div className="flex items-center space-x-2 pt-3 border-t border-blue-500 border-opacity-30">
                      <div className="flex items-center justify-center w-7 h-7 bg-white bg-opacity-20 rounded-lg">
                        <svg
                          className="w-3.5 h-3.5 text-white"
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
                      <span className="text-blue-50 text-xs font-medium">
                        Experienced Specialists
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Card - Description */}
                <div className="md:col-span-7 bg-white rounded-xl p-5 shadow-md">
                  {/* Header with border */}
                  <div className="flex items-start mb-3">
                    <div className="w-1 h-10 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900 mb-1.5">
                        About This Department
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {department.description || "No description available"}
                      </p>
                    </div>
                  </div>

                  {/* Progress indicators and counter */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                    <div className="flex gap-1.5">
                      {departments.map((_, index) => (
                        <div
                          key={index}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            index === currentIndex
                              ? "w-6 bg-blue-600"
                              : "w-1 bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      {currentIndex + 1} of {departments.length}
                    </span>
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
