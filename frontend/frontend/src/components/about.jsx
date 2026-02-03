import React from "react";

function About() {
  return (
    <section className="about-section py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
            Revolutionizing Healthcare Access
          </h2>
          <div className="w-16 md:w-20 h-1 bg-blue-500 mx-auto"></div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-4 md:space-y-6 order-2 md:order-1">
            <div className="prose prose-base md:prose-lg">
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                Our platform seamlessly connects patients with qualified
                healthcare professionals, making appointment scheduling{" "}
                <span className="text-blue-600 font-semibold">
                  easy, fast, and convenient
                </span>
                . We believe healthcare should be accessible to everyone,
                anytime, anywhere.
              </p>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                With a user-friendly interface, secure data handling, and an
                extensive network of medical professionals, we're transforming
                how you manage your health journey.
              </p>
            </div>

            {/* CTA */}
            <div className="pt-2 md:pt-4">
              <button className="w-full md:w-auto group relative px-6 md:px-8 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm md:text-base">
                <span className="relative z-10">Learn More About Us</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {/* Right Column - Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 order-1 md:order-2">
            {/* Feature Card 1 */}
            <div className="bg-white p-4 md:p-5 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2 md:mb-3">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base">
                Expert Doctors
              </h3>
              <p className="text-xs text-gray-600">
                Qualified medical professionals at your service
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white p-4 md:p-5 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2 md:mb-3">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base">
                24/7 Booking
              </h3>
              <p className="text-xs text-gray-600">
                Schedule appointments anytime, anywhere
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white p-4 md:p-5 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2 md:mb-3">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base">
                Secure & Safe
              </h3>
              <p className="text-xs text-gray-600">
                Your data is protected with encryption
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white p-4 md:p-5 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2 md:mb-3">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base">
                Fast Service
              </h3>
              <p className="text-xs text-gray-600">
                Quick confirmations and reminders
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* style animation */}
      <style>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 20s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}

export default About;
