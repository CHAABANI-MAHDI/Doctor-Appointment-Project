import mongoose from "mongoose";

const UserAdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "blocked"],
    },
    lastLogin: {
      type: Date,
    },
    appointments: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const UserAdmin = mongoose.model("UserAdmin", UserAdminSchema);
export default UserAdmin;
