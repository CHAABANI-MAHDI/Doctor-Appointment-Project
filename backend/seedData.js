/**
 * Seed Data Script
 * Populates MongoDB database with Tunisian demo data
 * Run with: node seedData.js (from backend directory with server running)
 * or: DB_URI=mongodb://localhost:27017/medicare node seedData.js
 */

const axios = require("axios");

const API_URL = process.env.API_URL || "http://localhost:3000/api";

// Tunisian demo data
const seedData = {
  users: [
    // Patients
    {
      name: "Ahmed Salah Ben Ayoub",
      email: "patient@demo.com",
      password: "password123",
      phone: "+216 91234567",
      role: "user",
    },
    {
      name: "Fatma Bettaieb",
      email: "patient2@demo.com",
      password: "password123",
      phone: "+216 92345678",
      role: "user",
    },
    {
      name: "Mohammed Karim",
      email: "patient3@demo.com",
      password: "password123",
      phone: "+216 93456789",
      role: "user",
    },
    // Doctors
    {
      name: "Dr. Karim Ben Haj",
      email: "doctor@demo.com",
      password: "password123",
      phone: "+216 94567890",
      role: "doctor",
    },
    {
      name: "Dr. Leila Bennani",
      email: "doctor2@demo.com",
      password: "password123",
      phone: "+216 95678901",
      role: "doctor",
    },
    {
      name: "Dr. Rashid Al-Mansouri",
      email: "doctor3@demo.com",
      password: "password123",
      phone: "+216 96789012",
      role: "doctor",
    },
    // Admin
    {
      name: "Admin User",
      email: "admin@demo.com",
      password: "password123",
      phone: "+216 97890123",
      role: "admin",
    },
  ],

  departments: [
    {
      name: "Cardiology",
      description: "Heart and cardiovascular diseases",
      icon: "❤️",
      specialties: ["ECG", "Heart Surgery", "Cardiac Imaging"],
    },
    {
      name: "Orthopedic Surgery",
      description: "Bone and joint disorders",
      icon: "🦴",
      specialties: [
        "Fracture Treatment",
        "Joint Replacement",
        "Sports Medicine",
      ],
    },
    {
      name: "Pediatrics",
      description: "Children's healthcare",
      icon: "👶",
      specialties: ["Vaccination", "Child Development", "Pediatric Surgery"],
    },
    {
      name: "Dermatology",
      description: "Skin conditions",
      icon: "💅",
      specialties: ["Acne Treatment", "Laser Therapy", "Cosmetic Surgery"],
    },
    {
      name: "Neurology",
      description: "Nervous system diseases",
      icon: "🧠",
      specialties: ["Migraine Treatment", "Epilepsy Management", "Stroke Care"],
    },
  ],

  doctors: [
    {
      email: "doctor@demo.com",
      specialization: "Cardiology",
      departmentName: "Cardiology",
      consultationFee: 150,
      experience: 15,
      qualifications: [
        "MD in Medicine",
        "Specialization in Cardiology - Tunis",
      ],
      bio: "Experienced cardiologist with 15 years of practice in Tunisia",
      availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      address: "Tunis Medical Center, Av. Habib Bourguiba, Tunis",
      verified: true,
    },
    {
      email: "doctor2@demo.com",
      specialization: "Orthopedic Surgery",
      departmentName: "Orthopedic Surgery",
      consultationFee: 180,
      experience: 12,
      qualifications: ["MD in Surgery", "Orthopedic Surgery Specialization"],
      bio: "Specialist in joint replacement and sports injuries",
      availableDays: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      availableSlots: ["10:00", "11:00", "14:00", "15:00", "16:00"],
      address: "Sfax Hospital, Sfax",
      verified: true,
    },
    {
      email: "doctor3@demo.com",
      specialization: "Pediatrics",
      departmentName: "Pediatrics",
      consultationFee: 120,
      experience: 10,
      qualifications: ["MD in Pediatrics", "Child Health Certificate"],
      bio: "Dedicated pediatrician focused on child wellness and development",
      availableDays: ["Monday", "Wednesday", "Thursday", "Friday"],
      availableSlots: ["09:00", "10:00", "11:00", "14:00"],
      address: "Sousse Children's Hospital, Sousse",
      verified: true,
    },
  ],

  appointments: [
    {
      patientEmail: "patient@demo.com",
      doctorEmail: "doctor@demo.com",
      departmentName: "Cardiology",
      appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      time: "10:00",
      status: "confirmed",
      reason: "Routine cardiac checkup",
      notes: "Patient reports occasional chest discomfort",
      price: 150,
    },
    {
      patientEmail: "patient2@demo.com",
      doctorEmail: "doctor2@demo.com",
      departmentName: "Orthopedic Surgery",
      appointmentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      time: "14:00",
      status: "pending",
      reason: "Knee pain consultation",
      notes: "Pain after sports injury",
      price: 180,
    },
    {
      patientEmail: "patient3@demo.com",
      doctorEmail: "doctor3@demo.com",
      departmentName: "Pediatrics",
      appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      time: "11:00",
      status: "confirmed",
      reason: "Child vaccination follow-up",
      notes: "Second dose vaccination appointment",
      price: 120,
    },
  ],

  medicalHistory: [
    {
      userEmail: "patient@demo.com",
      doctorEmail: "doctor@demo.com",
      visitDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      diagnosis: "Hypertension - Controlled",
      symptoms: ["occasional headache", "slight chest discomfort"],
      medicines: ["Lisinopril 10mg", "Amlodipine 5mg"],
      vitals: {
        bloodPressure: "140/90",
        heartRate: 72,
        temperature: 36.8,
      },
      allergies: ["Penicillin"],
      followUpDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days ahead
      notes: "Continue medication. Reduce salt intake. Increase exercise.",
    },
    {
      userEmail: "patient2@demo.com",
      doctorEmail: "doctor2@demo.com",
      visitDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      diagnosis: "Acute knee sprain - Grade 2",
      symptoms: ["knee swelling", "pain during movement", "limited mobility"],
      medicines: ["Ibuprofen 400mg", "Topical anti-inflammatory cream"],
      vitals: {
        bloodPressure: "120/80",
        heartRate: 68,
        temperature: 36.5,
      },
      allergies: ["Aspirin"],
      followUpDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks
      notes: "Apply ice, rest, compression. Physiotherapy recommended.",
    },
  ],
};

/**
 * Register user function
 */
async function registerUser(userData) {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    console.log(`✅ Registered: ${userData.name} (${userData.email})`);
    return response.data;
  } catch (error) {
    if (
      error.response?.status === 400 &&
      error.response?.data?.message?.includes("already")
    ) {
      console.log(`⚠️ Already exists: ${userData.name} (${userData.email})`);
      return null;
    }
    console.error(
      `❌ Failed to register ${userData.name}:`,
      error.response?.data?.message || error.message,
    );
    return null;
  }
}

/**
 * Create department function
 */
async function createDepartment(deptData) {
  try {
    const response = await axios.post(`${API_URL}/departments`, deptData);
    console.log(`✅ Created department: ${deptData.name}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      console.log(`⚠️ Department already exists: ${deptData.name}`);
      return null;
    }
    console.error(
      `❌ Failed to create department ${deptData.name}:`,
      error.response?.data?.message || error.message,
    );
    return null;
  }
}

/**
 * Update doctor profile function
 */
async function updateDoctorProfile(doctorData) {
  try {
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: doctorData.email,
      password: "password123",
    });

    const token = loginResponse.data.token;

    const response = await axios.put(`${API_URL}/doctors/profile`, doctorData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(`✅ Updated doctor profile: Dr. ${doctorData.specialization}`);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Failed to update doctor profile:`,
      error.response?.data?.message || error.message,
    );
    return null;
  }
}

/**
 * Create appointment function
 */
async function createAppointment(appointmentData) {
  try {
    // Login as patient to get token
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: appointmentData.patientEmail,
      password: "password123",
    });

    const token = loginResponse.data.token;

    const response = await axios.post(
      `${API_URL}/appointments`,
      appointmentData,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    console.log(
      `✅ Created appointment: ${appointmentData.reason} on ${appointmentData.appointmentDate.toDateString()}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      `❌ Failed to create appointment:`,
      error.response?.data?.message || error.message,
    );
    return null;
  }
}

/**
 * Create medical history function
 */
async function createMedicalHistory(historyData) {
  try {
    // Login as patient to get token
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: historyData.userEmail,
      password: "password123",
    });

    const token = loginResponse.data.token;

    const response = await axios.post(
      `${API_URL}/medical-history`,
      historyData,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    console.log(`✅ Created medical history: ${historyData.diagnosis}`);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Failed to create medical history:`,
      error.response?.data?.message || error.message,
    );
    return null;
  }
}

/**
 * Main seeding function
 */
async function seedDatabase() {
  console.log("\n🌱 Starting database seeding...\n");

  try {
    // 1. Register all users
    console.log("📝 Registering users...");
    for (const user of seedData.users) {
      await registerUser(user);
    }

    console.log("\n📚 Creating departments...");
    for (const dept of seedData.departments) {
      await createDepartment(dept);
    }

    console.log("\n👨‍⚕️ Updating doctor profiles...");
    for (const doctor of seedData.doctors) {
      await updateDoctorProfile(doctor);
    }

    console.log("\n📅 Creating appointments...");
    for (const appointment of seedData.appointments) {
      await createAppointment(appointment);
    }

    console.log("\n📋 Creating medical history records...");
    for (const history of seedData.medicalHistory) {
      await createMedicalHistory(history);
    }

    console.log("\n✨ Database seeding completed successfully!\n");
    console.log("📝 Demo Credentials:");
    console.log("  Patient: patient@demo.com / password123");
    console.log("  Doctor: doctor@demo.com / password123");
    console.log("  Admin: admin@demo.com / password123\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
