import React from 'react'

function CallToAction() {
  return (
    <section className="bg-blue-600 py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Take the Next Step ?
        </h2>
        <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
          Schedule your appointment today and experience top-notch healthcare
          services tailored to your needs.
        </p>
        <div className="pt-4">
          <button className="group relative px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <span className="relative z-10">Make an Appointment</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white-600 to-white-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </section>
  );
}

export default CallToAction
