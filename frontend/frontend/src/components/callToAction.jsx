import React from 'react'

function CallToAction() {
  return (
    <section className="bg-blue-600 py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Take the Next Step ?
        </h2>
        <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Schedule your appointment today and experience top-notch healthcare services tailored to your needs.
        </p>
        <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-300">
          Make an Appointment
        </button>
      </div>
    </section>
  )
}

export default CallToAction
