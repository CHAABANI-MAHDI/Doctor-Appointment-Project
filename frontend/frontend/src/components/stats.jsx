/* eslint-disable no-unused-vars */
import React from "react";
import { useState, useEffect } from "react";

function Stats() {
  const [doctorCount, setDoctorCount] = useState(0);
  const [departmentsCount, setDepartmentsCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const doctorsStats = await fetch("http://localhost:3000/doctors/count");
        const departmentsStats = await fetch(
          "http://localhost:3000/departments/count",
        );
        const doctorsData = await doctorsStats.json();
        const departmentsData = await departmentsStats.json();
        setDoctorCount(doctorsData.count || 0);
        setDepartmentsCount(departmentsData.count || 0);

        console.log("Doctor Count:", doctorsData.count);
        console.log("Departments Count:", departmentsData.count);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="stats-section py-8 md:py-12 bg-white">
      {/* Stats Section */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
              {doctorCount}+
            </div>
            <div className="text-gray-600 text-xs md:text-sm uppercase tracking-wider">
              Doctors
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
              {departmentsCount}+
            </div>
            <div className="text-gray-600 text-xs md:text-sm uppercase tracking-wider">
              Departments
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
              98%
            </div>
            <div className="text-gray-600 text-xs md:text-sm uppercase tracking-wider">
              Satisfaction
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
              24/7
            </div>
            <div className="text-gray-600 text-xs md:text-sm uppercase tracking-wider">
              Support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats;
