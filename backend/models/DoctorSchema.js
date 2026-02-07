import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    experienceYears: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    consultationFee: {
      type: Number,
      default: 150,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Departments",
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
    },
    availability: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Doctor", DoctorSchema);
