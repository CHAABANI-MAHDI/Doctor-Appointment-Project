import express from "express";
import Appointment from "../models/AppointmentSchema.js";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";
import auth from "../auth/Middleware.js";

const router = express.Router();

//=============================== ###  Get Doctor's Appointments ### ==============================
router.get("/getDoctorAppointments", auth(), async (req, res) => {
  try {
    // Find user and check if they are a doctor
    const user = await User.findById(req.user.id).populate("doctorProfile");

    if (!user || user.role !== "doctor" || !user.doctorProfile) {
      return res.status(403).json({
        msg: "You are not authorized to view doctor appointments ⛔",
      });
    }

    // Fetch appointments for this doctor
    const appointments = await Appointment.find({
      doctor: user.doctorProfile._id,
    })
      .populate("user")
      .populate("doctor")
      .sort({ date: -1 });

    return res.status(200).json({
      msg: "Doctor appointments fetched successfully ✅",
      appointments: appointments,
      doctorInfo: user.doctorProfile,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Server error ⛔⛔",
      error: error.message,
    });
  }
});

//=============================== ###  Get Doctor Appointments by Doctor ID ### ==============================
router.get("/getDoctorAppointmentsByID/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;

    const appointments = await Appointment.find({ doctor: doctorId })
      .populate("user")
      .populate("doctor")
      .sort({ date: -1 });

    if (!appointments.length) {
      return res.status(200).json({
        msg: "No appointments found for this doctor ✅",
        appointments: [],
      });
    }

    return res.status(200).json({
      msg: "Doctor appointments fetched successfully ✅",
      appointments: appointments,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Server error ⛔⛔",
      error: error.message,
    });
  }
});

//=============================== ###  Doctor Confirm Appointment ### ==============================
router.patch("/confirmAppointment/:id", auth(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "doctor") {
      return res.status(403).json({
        msg: "You are not authorized to confirm appointments ⛔",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "confirmed" },
      { new: true },
    )
      .populate("user")
      .populate("doctor");

    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found ❌" });
    }

    return res.status(200).json({
      msg: "Appointment confirmed successfully ✅",
      appointment: appointment,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Server error ⛔⛔",
      error: error.message,
    });
  }
});

//=============================== ###  Doctor Complete Appointment ### ==============================
router.patch("/completeAppointment/:id", auth(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "doctor") {
      return res.status(403).json({
        msg: "You are not authorized to complete appointments ⛔",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true },
    )
      .populate("user")
      .populate("doctor");

    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found ❌" });
    }

    return res.status(200).json({
      msg: "Appointment completed successfully ✅",
      appointment: appointment,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Server error ⛔⛔",
      error: error.message,
    });
  }
});

//=============================== ###  Doctor Reject Appointment ### ==============================
router.patch("/rejectAppointment/:id", auth(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "doctor") {
      return res.status(403).json({
        msg: "You are not authorized to reject appointments ⛔",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true },
    )
      .populate("user")
      .populate("doctor");

    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found ❌" });
    }

    return res.status(200).json({
      msg: "Appointment rejected successfully ✅",
      appointment: appointment,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Server error ⛔⛔",
      error: error.message,
    });
  }
});

export default router;
