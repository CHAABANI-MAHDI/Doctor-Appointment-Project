import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "doctor"],
    },
    doctorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "blocked"],
    },
    notificationPreferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      appointmentReminders: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);
export default User;
