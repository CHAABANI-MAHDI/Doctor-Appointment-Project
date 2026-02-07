import React from "react";

const AboutPage = () => {
  // Tunisian team members
  const teamMembers = [
    {
      name: "Dr. Sarah Ben Ali",
      role: "Medical Director",
      experience: "15 years experience",
      specialty: "Cardiologist at Tunis Medical Center",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    },
    {
      name: "Dr. Mohamed Cherif",
      role: "Head of Operations",
      experience: "12 years experience",
      specialty: "Neurologist at Sfax University Hospital",
      image:
        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop",
    },
    {
      name: "Dr. Fatma Malki",
      role: "Patient Care Coordinator",
      experience: "10 years experience",
      specialty: "Pediatrician at Sousse Children's Hospital",
      image:
        "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=400&h=400&fit=crop",
    },
    {
      name: "Ibrahim Habib",
      role: "Technology Director",
      experience: "8 years experience",
      specialty: "Healthcare IT Systems",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
  ];

  // Milestones in Tunisia
  const milestones = [
    {
      year: "2015",
      title: "Founded in Tunis",
      description: "Started with 3 clinics in Greater Tunis",
    },
    {
      year: "2017",
      title: "CNAM Integration",
      description: "Integrated with Tunisian National Health Insurance",
    },
    {
      year: "2019",
      title: "National Platform Launch",
      description: "Expanded to all 24 governorates",
    },
    {
      year: "2021",
      title: "Hospital Partnerships",
      description: "Partnered with major Tunisian hospitals",
    },
    {
      year: "2023",
      title: "1M+ Appointments",
      description: "Milestone achievement across Tunisia",
    },
  ];

  // Values focused on Tunisian healthcare
  const values = [
    {
      icon: "❤️",
      title: "Patient-Centered Care",
      description:
        "Every decision prioritizes patient wellbeing in the Tunisian healthcare context",
    },
    {
      icon: "🏛️",
      title: "Tunisian Standards",
      description:
        "Adherence to Ministry of Health regulations and CNAM requirements",
    },
    {
      icon: "🌍",
      title: "Accessibility",
      description:
        "Making quality healthcare accessible across all Tunisian regions",
    },
    {
      icon: "🤝",
      title: "Cultural Sensitivity",
      description:
        "Understanding and respecting Tunisian healthcare traditions and preferences",
    },
  ];

  // Tunisia-specific stats
  const stats = [
    { number: "500+", label: "Tunisian Licensed Doctors", icon: "👨‍⚕️" },
    { number: "24", label: "Tunisian Governorates", icon: "📍" },
    { number: "1M+", label: "Appointments Booked", icon: "📅" },
    { number: "98%", label: "Patient Satisfaction", icon: "⭐" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="absolute inset-0 bg-gradient-to-l from-blue-600/20 to-teal-600/20" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Transforming Healthcare Access in Tunisia
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              We're dedicated to improving healthcare access across Tunisia by
              connecting patients with licensed medical professionals instantly,
              without registration barriers or long wait times. CNAM insurance
              accepted at partnered facilities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#mission"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Our Mission
              </a>
              <a
                href="#team"
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Meet Our Team
              </a>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16">
        

        {/* Mission & Vision for Tunisia */}
        <section id="mission" className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3 text-blue-600">🎯</span>
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Mission in Tunisia
                </h2>
              </div>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                To democratize healthcare access in Tunisia by bridging the gap
                between patients and quality medical care. We're committed to
                making healthcare appointment booking as simple and accessible
                throughout all Tunisian governorates, with special attention to
                both urban centers and underserved regions.
              </p>
              <div className="space-y-4">
                {[
                  "Instant access to Tunisian licensed doctors",
                  "No registration required for booking",
                  "CNAM insurance integration",
                  "24/7 booking availability across timezones",
                  "Emergency care coordination in major cities",
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl p-8">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3 text-teal-600">🌍</span>
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Vision for Tunisia
                </h2>
              </div>
              <p className="text-gray-700 text-lg mb-6">
                To become Tunisia's most trusted healthcare access platform,
                where anyone across all 24 governorates can find and book
                medical appointments instantly, regardless of their location,
                insurance status, or medical history.
              </p>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <span className="text-2xl mr-3 text-green-500">📈</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Tunisia 2025 Goal
                    </h3>
                    <p className="text-gray-600">
                      Serve 2 million patients across all Tunisian governorates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

       

      
        
      </main>

      {/* Contact CTA with Tunisian info */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Contact Our Tunisian Team
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Have questions about healthcare in Tunisia or need assistance with
              booking?
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="flex items-center">
                <span className="mr-3 text-blue-400 text-xl">📞</span>
                <div>
                  <div className="font-semibold">Call Tunisia</div>
                  <div className="text-gray-300">+216 70 000 000</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-3 text-blue-400 text-xl">📧</span>
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-gray-300">
                    contact@tunisiahealthcare.com
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-3 text-blue-400 text-xl">🕐</span>
                <div>
                  <div className="font-semibold">Support Hours</div>
                  <div className="text-gray-300">8AM-8PM Tunisia Time</div>
                </div>
              </div>
            </div>
            <p className="mt-8 text-gray-400 text-sm">
              Head Office: Tunis, Tunisia • Branch Offices: Sfax, Sousse, Nabeul
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
