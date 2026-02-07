import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "appointment_created",
        "appointment_confirmed",
        "appointment_cancelled",
        "appointment_completed",
        "status_update",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
      doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
