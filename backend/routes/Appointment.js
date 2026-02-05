import express from "express";
const router = express.Router();
import Appointment from "../models/AppointmentSchema.js";
import auth from "../auth/Middleware.js";

//=============================== ###  create Appointment ### ==============================
router.post("/createAppointment", auth(), async (req, res) => {
  try {
    const { doctor, date, reason } = req.body;

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

    // Create appointment (.create() already saves to DB)
    const newAppointment = await Appointment.create({
      user: req.user.id,
      doctor,
      date,
      reason,
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
console.log("USER ID:", req.user.id);
    const appointments = await Appointment.find({ user: req.user.id })


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

export default router;
