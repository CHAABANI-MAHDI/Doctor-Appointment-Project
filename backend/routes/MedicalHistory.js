import express from "express";
import MedicalHistory from "../models/MedicalHistorySchema.js";
import User from "../models/UserSchema.js";
import auth from "../auth/Middleware.js";

const router = express.Router();

// Get all medical history for a user
router.get("/getHistory/:userId", auth(), async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await MedicalHistory.find({ user: userId })
      .populate("doctor", "name specialty")
      .populate("appointment")
      .sort({ visitDate: -1 });

    return res.status(200).json({
      msg: "Success ✅",
      history,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error fetching medical history ⛔",
      error: error.message,
    });
  }
});

// Get medical history by appointment
router.get("/getByAppointment/:appointmentId", auth(), async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const history = await MedicalHistory.findOne({
      appointment: appointmentId,
    })
      .populate("user", "name email phone")
      .populate("doctor", "name specialty");

    if (!history) {
      return res.status(404).json({
        msg: "Medical history not found ⛔",
      });
    }

    return res.status(200).json({
      msg: "Success ✅",
      history,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error fetching medical history ⛔",
      error: error.message,
    });
  }
});

// Add medical history (Doctor adds after appointment)
router.post("/addHistory", auth(), async (req, res) => {
  try {
    const {
      user,
      doctor,
      appointment,
      diagnosis,
      symptoms,
      prescription,
      medicines,
      notes,
      bloodPressure,
      temperature,
      weight,
      height,
      allergies,
      followUpDate,
    } = req.body;

    // Verify doctor is authorized
    const doctorUser = await User.findById(req.user.id);
    if (!doctorUser || doctorUser.role !== "doctor") {
      return res.status(403).json({
        msg: "Not authorized ⛔",
      });
    }

    const newHistory = await MedicalHistory.create({
      user,
      doctor: doctor || req.user.id,
      appointment,
      diagnosis,
      symptoms: symptoms || [],
      prescription,
      medicines: medicines || [],
      notes,
      bloodPressure,
      temperature,
      weight,
      height,
      allergies: allergies || [],
      followUpDate,
    });

    const populated = await newHistory
      .populate("user", "name email phone")
      .populate("doctor", "name specialty")
      .execPopulate();

    return res.status(201).json({
      msg: "Medical history added ✅",
      history: populated,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error adding medical history ⛔",
      error: error.message,
    });
  }
});

// Update medical history
router.put("/updateHistory/:id", auth(), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verify doctor is authorized
    const doctorUser = await User.findById(req.user.id);
    if (!doctorUser || doctorUser.role !== "doctor") {
      return res.status(403).json({
        msg: "Not authorized ⛔",
      });
    }

    const updated = await MedicalHistory.findByIdAndUpdate(id, updates, {
      new: true,
    })
      .populate("user", "name email phone")
      .populate("doctor", "name specialty");

    if (!updated) {
      return res.status(404).json({
        msg: "Medical history not found ⛔",
      });
    }

    return res.status(200).json({
      msg: "Medical history updated ✅",
      history: updated,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error updating medical history ⛔",
      error: error.message,
    });
  }
});

// Delete medical history
router.delete("/deleteHistory/:id", auth(), async (req, res) => {
  try {
    const { id } = req.params;

    // Verify doctor is authorized
    const doctorUser = await User.findById(req.user.id);
    if (
      !doctorUser ||
      (doctorUser.role !== "doctor" && doctorUser.role !== "admin")
    ) {
      return res.status(403).json({
        msg: "Not authorized ⛔",
      });
    }

    await MedicalHistory.findByIdAndDelete(id);

    return res.status(200).json({
      msg: "Medical history deleted ✅",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error deleting medical history ⛔",
      error: error.message,
    });
  }
});

// Get user medical history summary
router.get("/summary/:userId", auth(), async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await MedicalHistory.find({ user: userId })
      .select("diagnosis visitDate symptoms allergies")
      .sort({ visitDate: -1 })
      .limit(10);

    const allergies = [...new Set(history.flatMap((h) => h.allergies || []))];
    const recentDiagnoses = history.map((h) => h.diagnosis).filter(Boolean);

    return res.status(200).json({
      msg: "Success ✅",
      summary: {
        totalVisits: history.length,
        allergies,
        recentDiagnoses,
        lastVisit: history[0]?.visitDate || null,
        history,
      },
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error fetching summary ⛔",
      error: error.message,
    });
  }
});

export default router;
