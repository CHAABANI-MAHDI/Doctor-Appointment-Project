import express from "express";
const router = express.Router();
import Appointment from "../models/AppointmentSchema.js";
import Notification from "../models/NotificationSchema.js";
import Doctor from "../models/DoctorSchema.js";
import auth from "../auth/Middleware.js";

//=============================== ###  create Appointment ### ==============================
router.post("/createAppointment", auth(), async (req, res) => {
  try {
    const { doctor, date, reason, price } = req.body;

    // Validation
    if (!doctor || !date || !reason) {
      return res
        .status(400)
        .json({ msg: "Please enter all required fields ⛔" });
    }

    // Check if user exists in token
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "User not authenticated ⛔" });
    }

    // Get doctor details for price
    const doctorDetails = await Doctor.findById(doctor);
    const appointmentPrice = price || doctorDetails?.consultationFee || 150;

    // Create appointment (.create() already saves to DB)
    const newAppointment = await Appointment.create({
      user: req.user.id,
      doctor,
      date,
      reason,
      price: appointmentPrice,
    }).then((apt) => apt.populate(["user", "doctor"]));

    // Create notification for doctor
    await Notification.create({
      recipient: doctor,
      type: "appointment_created",
      title: "New Appointment Scheduled",
      message: `A new appointment has been scheduled for ${new Date(date).toLocaleDateString()}`,
      data: {
        appointmentId: newAppointment._id,
        doctorId: doctor,
      },
    });

    return res.status(201).json({
      msg: "Appointment added successfully ✅",
      appointment: newAppointment,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Server error ⛔⛔",
      error: error.message,
    });
  }
});

//=============================== ###  get Appointment ### ==============================
router.get("/getAppointment", auth(), async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate("doctor")
      .populate("user")
      .sort({ date: -1 });

    return res.status(200).json({
      msg: "Appointments fetched successfully ✅",
      appointment: appointments,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Server error ⛔⛔",
      error: error.message,
    });
  }
});

//=============================== ###  delete Appointment ### ==============================
router.delete("/deleteAppoitement/:idAppoit", auth(), async (req, res) => {
  try {
    // Find and delete appointment
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.idAppoit,
    );

    if (!deletedAppointment) {
      return res
        .status(404)
        .json({ msg: "Appointment with this ID is NOT FOUND ❌" });
    }

    return res.status(200).json({
      msg: "Appointment deleted successfully ✅",
      deletedAppointment: deletedAppointment,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Server error ⛔⛔",
      error: error.message,
    });
  }
});

//=============================== ###  update Appointment Status ### ==============================
router.patch("/updateStatus/:idAppoit", auth(), async (req, res) => {
  try {
    const { status } = req.body;

    // Validation
    if (!status) {
      return res.status(400).json({ msg: "Status is required ⛔" });
    }

    // Valid status values
    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status value ⛔" });
    }

    // Find and update appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.idAppoit,
      { status },
      { new: true },
    )
      .populate("doctor")
      .populate("user");

    if (!updatedAppointment) {
      return res
        .status(404)
        .json({ msg: "Appointment with this ID is NOT FOUND ❌" });
    }

    // Create notification for user about status change
    await Notification.create({
      recipient: updatedAppointment.user._id,
      type: "status_update",
      title: `Appointment ${status}`,
      message: `Your appointment on ${new Date(
        updatedAppointment.date,
      ).toLocaleDateString()} has been ${status}`,
      data: {
        appointmentId: updatedAppointment._id,
        doctorId: updatedAppointment.doctor._id,
      },
    });

    return res.status(200).json({
      msg: "Appointment status updated successfully ✅",
      appointment: updatedAppointment,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Server error ⛔⛔",
      error: error.message,
    });
  }
});

export default router;
