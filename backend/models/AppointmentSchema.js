import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    date: {
      type: Date,
    },
    reason: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    price: {
      type: Number,
      default: 150,
    },
    duration: {
      type: Number,
      default: 30,
    },
  },
  { timestamps: true },
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);
export default Appointment;
