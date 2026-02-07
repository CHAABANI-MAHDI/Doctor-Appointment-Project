import React from "react";

const ServicesPage = () => {
  // Medical services offered in Tunisia
  const medicalServices = [
    {
      icon: "❤️",
      title: "Cardiology",
      description:
        "Cardiac health checkups, ECG, stress tests, and heart consultations with CNAM-approved specialists",
      features: ["ECG", "Echocardiography", "Holter Monitoring", "Stress Test"],
      color: "bg-red-50 text-red-600",
    },
    {
      icon: "🧠",
      title: "Neurology",
      description:
        "Expert neurological care for brain and nerve disorders at major Tunisian hospitals",
      features: ["EEG", "EMG", "Nerve Conduction", "Sleep Studies"],
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: "🦷",
      title: "Dentistry",
      description:
        "Complete dental care covered by Tunisian health insurance at approved clinics",
      features: ["Cleaning", "Implants", "Orthodontics", "Cosmetic Dentistry"],
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: "👁️",
      title: "Ophthalmology",
      description:
        "Eye care and vision correction at accredited Tunisian eye centers",
      features: ["Vision Tests", "Cataract Surgery", "LASIK", "Glaucoma Care"],
      color: "bg-cyan-50 text-cyan-600",
    },
    {
      icon: "🦴",
      title: "Orthopedics",
      description:
        "Bone and joint care at Tunisian orthopedic centers and rehabilitation facilities",
      features: ["X-Ray", "Physiotherapy", "Joint Replacement", "Arthroscopy"],
      color: "bg-orange-50 text-orange-600",
    },
    {
      icon: "👶",
      title: "Pediatrics",
      description:
        "Child healthcare services at Tunisian pediatric hospitals and clinics",
      features: [
        "Vaccinations",
        "Growth Monitoring",
        "Child Nutrition",
        "Development",
      ],
      color: "bg-pink-50 text-pink-600",
    },
  ];

  // Booking features specific to Tunisia
  const bookingFeatures = [
    {
      icon: "📅",
      title: "CNAM & Insurance",
      description:
        "Book with doctors who accept Tunisian National Health Insurance",
    },
    {
      icon: "⚡",
      title: "Same-Day Appointments",
      description:
        "Urgent care slots available in Tunis, Sfax, Sousse and major cities",
    },
    {
      icon: "✅",
      title: "Licensed Tunisian Doctors",
      description: "All doctors licensed by Tunisian Ministry of Health",
    },
    {
      icon: "🏥",
      title: "Public & Private Hospitals",
      description:
        "Access to both public hospitals and private clinics across Tunisia",
    },
  ];

  // Health packages with Tunisian prices
  const healthPackages = [
    {
      name: "Basic Medical Checkup",
      price: "150 TND",
      duration: "60 mins",
      includes: [
        "General Practitioner Consultation",
        "Basic Blood Tests",
        "ECG",
        "BMI Assessment",
        "CNAM Coverage Eligible",
      ],
      popular: false,
    },
    {
      name: "Comprehensive Health Screen",
      price: "450 TND",
      duration: "3 hours",
      includes: [
        "Full Body Medical Examination",
        "Advanced Blood Work",
        "X-Ray",
        "Ultrasound",
        "Specialist Consultation",
        "Diet Plan in Arabic/French",
      ],
      popular: true,
    },
    {
      name: "Executive Health Package",
      price: "750 TND",
      duration: "5 hours",
      includes: [
        "Complete Health Assessment",
        "Cardiac Screening",
        "Cancer Markers",
        "MRI Scan",
        "2 Follow-up Visits",
        "Personal Health Manager",
      ],
      popular: false,
    },
  ];

  // Available cities in Tunisia
  const cities = [
    "Tunis",
    "Sfax",
    "Sousse",
    "Nabeul",
    "Bizerte",
    "Ariana",
    "Manouba",
    "Mahdia",
    "Gabès",
    "Gafsa",
    "Tozeur",
    "Jendouba",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-4 text-white">🏥</span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Healthcare Services in Tunisia
              </h1>
            </div>
            <p className="text-xl text-blue-100 mb-8">
              Comprehensive medical services with Tunisian licensed specialists.
              Book appointments instantly without registration. CNAM insurance
              accepted.
            </p>
            <a
              href="#book-now"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
            >
              Book Appointment Now
              <span className="ml-2">✅</span>
            </a>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16">
        {/* Tunisian Healthcare Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tunisian Healthcare Access
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Access Tunisia's healthcare system easily through our platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bookingFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:translate-y-1"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>


      </main>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Medical Care in Tunisia?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Book appointments with licensed Tunisian specialists instantly. No
            registration required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#emergency"
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors duration-300"
            >
              <span className="mr-2">🚨</span> Emergency Care in Tunisia
            </a>
            <a
              href="#telemedicine"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors duration-300"
            >
              <span className="mr-2">📹</span> Video Consultation
            </a>
            <a
              href="#call-back"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-colors duration-300"
            >
              <span className="mr-2">📞</span> Request Call Back
            </a>
          </div>
          <p className="mt-8 text-gray-400 text-sm">
            Available in Tunis, Sfax, Sousse and across all Tunisian
            governorates
          </p>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
