import mongoose from "mongoose";

const MedicalHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
    diagnosis: {
      type: String,
    },
    symptoms: {
      type: [String],
    },
    prescription: {
      type: String,
    },
    medicines: {
      type: [
        {
          name: String,
          dosage: String,
          duration: String,
          frequency: String,
        },
      ],
    },
    notes: {
      type: String,
    },
    bloodPressure: {
      type: String,
    },
    temperature: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    height: {
      type: Number,
    },
    allergies: {
      type: [String],
    },
    followUpDate: {
      type: Date,
    },
    followUpNotes: {
      type: String,
    },
  },
  { timestamps: true },
);

const MedicalHistory = mongoose.model("MedicalHistory", MedicalHistorySchema);
export default MedicalHistory;
