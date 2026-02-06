/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from "react";
import HeroSlider from "../components/heroSlider";
import Signature from "../components/Signature";

const HomePage = () => {
  // Featured doctors for non-registered users
  const featuredDoctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 4.9,
      experience: "12 years",
      availability: "Today",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
      verified: true,
      price: "Consultation: 120 DT",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Dermatologist",
      rating: 4.8,
      experience: "8 years",
      availability: "Tomorrow",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
      verified: true,
      price: "Consultation: 100 DT",
    },
    {
      id: 3,
      name: "Dr. Priya Sharma",
      specialty: "Pediatrician",
      rating: 4.9,
      experience: "15 years",
      availability: "Today",
      image:
        "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=400&h=400&fit=crop",
      verified: true,
      price: "Consultation: 90 DT",
    },
    {
      id: 4,
      name: "Dr. Ahmed Ben Ali",
      specialty: "Orthopedic Surgeon",
      rating: 4.7,
      experience: "10 years",
      availability: "Tomorrow",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
      verified: true,
      price: "Consultation: 150 DT",
    },
  ];

  // Popular specialties
  const specialties = [
    {
      name: "General Physician",
      icon: "👨‍⚕️",
      doctors: 45,
      color: "bg-blue-50 text-blue-600",
    },
    {
      name: "Dentist",
      icon: "🦷",
      doctors: 28,
      color: "bg-green-50 text-green-600",
    },
    {
      name: "Gynecologist",
      icon: "👩‍⚕️",
      doctors: 32,
      color: "bg-pink-50 text-pink-600",
    },
    {
      name: "Orthopedic",
      icon: "🦴",
      doctors: 18,
      color: "bg-purple-50 text-purple-600",
    },
    {
      name: "Psychiatrist",
      icon: "🧠",
      doctors: 22,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      name: "Dermatologist",
      icon: "🌟",
      doctors: 25,
      color: "bg-amber-50 text-amber-600",
    },
    {
      name: "Pediatrician",
      icon: "👶",
      doctors: 35,
      color: "bg-cyan-50 text-cyan-600",
    },
    {
      name: "Cardiologist",
      icon: "❤️",
      doctors: 15,
      color: "bg-red-50 text-red-600",
    },
  ];

  // How it works steps
  const steps = [
    {
      number: "01",
      title: "Find a Doctor",
      description: "Search by specialty, location, or doctor name",
      icon: "🔍",
    },
    {
      number: "02",
      title: "Choose Time Slot",
      description: "Select available appointment time that suits you",
      icon: "📅",
    },
    {
      number: "03",
      title: "Book Instantly",
      description: "Confirm booking with basic contact details",
      icon: "✅",
    },
    {
      number: "04",
      title: "Visit Clinic",
      description: "Receive reminders and visit doctor at scheduled time",
      icon: "🏥",
    },
  ];

  // Stats
  const stats = [
    {
      value: "500+",
      label: "Verified Doctors",
      icon: "🛡️",
      color: "bg-blue-100 text-blue-600",
    },
    {
      value: "50K+",
      label: "Happy Patients",
      icon: "👥",
      color: "bg-green-100 text-green-600",
    },
    {
      value: "24/7",
      label: "Available Support",
      icon: "📞",
      color: "bg-purple-100 text-purple-600",
    },
    {
      value: "98%",
      label: "Satisfaction Rate",
      icon: "❤️",
      color: "bg-pink-100 text-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Slider */}
      <section className="relative bg-gradient-to-b from-white to-blue-50">
        <HeroSlider />

        {/* Quick Stats Banner */}
        <div className="container mx-auto px-4 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.color} mb-3 text-2xl`}
                  >
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* How it Works Section */}
          <section id="how-it-works" className="mb-20">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                HOW IT WORKS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Book Your Appointment in{" "}
                <span className="text-blue-600">4 Simple Steps</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                No registration required. Quick, easy, and secure booking
                process.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-bold">
                    {step.number}
                  </div>
                  <div className="text-4xl mb-6">{step.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                  <div className="mt-6 pt-6 border-t border-gray-100 text-blue-600">
                    →
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Doctors Section */}
          <section id="doctors" className="mb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-3">
                  TOP DOCTORS
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Our Featured{" "}
                  <span className="text-blue-600">Specialists</span>
                </h2>
                <p className="text-gray-600 mt-2">
                  Highly qualified doctors with excellent patient reviews
                </p>
              </div>
              <a
                href="#all-doctors"
                className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                View all doctors
                <span className="ml-2">→</span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      {doctor.verified && (
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center text-sm">
                          <span className="mr-1">✓</span>
                          Verified
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="font-bold">{doctor.rating}</span>
                        <span className="text-gray-500 ml-1">/5.0</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {doctor.name}
                        </h3>
                        <p className="text-blue-600 font-semibold">
                          {doctor.specialty}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">⏰</span>
                        <span className="text-sm">
                          {doctor.experience} experience
                        </span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <span className="mr-2">📅</span>
                        <span className="text-sm font-medium">
                          Available {doctor.availability}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {doctor.price}
                      </div>
                    </div>
                    <a
                      href={`#book-doctor-${doctor.id}`}
                      className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Book Appointment
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Specialties Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                SPECIALTIES
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Browse by <span className="text-blue-600">Medical Field</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Find the perfect specialist for your healthcare needs
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {specialties.map((specialty, index) => (
                <a
                  key={index}
                  href={`#specialty-${specialty.name}`}
                  className={`${specialty.color} p-4 rounded-xl hover:shadow-lg transition-all duration-300 text-center group hover:transform hover:-translate-y-1`}
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {specialty.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">
                    {specialty.name}
                  </h3>
                  <p className="text-xs opacity-75">
                    {specialty.doctors} doctors
                  </p>
                </a>
              ))}
            </div>
          </section>

          

          {/* CTA Section */}
          <section id="book-now" className="text-center">
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z%22 fill=%22%23007BFF%22 fill-opacity=%220.1%22 fill-rule=%22evenodd%22/%3E%3C/svg%3E')] opacity-10"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to See a Doctor?
                </h2>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                  Book your appointment instantly. No registration, no waiting.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="#quick-booking"
                    className="px-10 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
                  >
                    Book Appointment Now
                    <span className="ml-2">→</span>
                  </a>
                  <a
                    href="#contact"
                    className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center"
                  >
                    <span className="mr-2">📞</span>
                    Need Help? Call Us
                  </a>
                </div>
                <p className="mt-8 text-blue-200 flex items-center justify-center">
                  <span className="mr-2">✓</span>
                  Over 50,000+ appointments booked this month
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Signature/>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-8 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <span className="mr-2 text-blue-400">❤️</span>
                HealthCare Tunis
              </h3>
              <p className="text-gray-400 mb-4">
                Connecting patients with top medical professionals across
                Tunisia.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <span className="text-sm">FB</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <span className="text-sm">TW</span>
                </a>
     
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <span className="text-sm">IN</span>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#doctors"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Find Doctors
                  </a>
                </li>
                <li>
                  <a
                    href="#specialties"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Specialties
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#emergency"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Emergency Care
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="mr-3 text-blue-400 mt-0.5">📞</span>
                  <div>
                    <div className="text-gray-400">Emergency</div>
                    <div className="font-semibold">71 234 567</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-3 text-blue-400 mt-0.5">📍</span>
                  <div>
                    <div className="text-gray-400">Address</div>
                    <div className="font-semibold">Tunis Medical Center</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Quick Booking</h3>
              <p className="text-gray-400 mb-4">
                Book appointments without registration. Fast, secure, and
                convenient.
              </p>
              <a
                href="#book-now"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Book Now
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">
                © {new Date().getFullYear()} HealthCare Tunis. All rights
                reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#cookies"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              Made with ❤️ by HealthCare Tunis
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
