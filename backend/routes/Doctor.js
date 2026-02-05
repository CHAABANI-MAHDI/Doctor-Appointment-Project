import express from "express";
const router = express.Router();
import Doctor from "../models/DoctorSchema.js";
import multer from "multer";
import path from "path";

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "pic-uploads/");
  },
  filename: function (req, file, cb) {
    // Get extension using path.extname (this includes the dot)
    const fileExtension = path.extname(file.originalname);

    // Create unique suffix
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // Build filename: fieldname-timestamp-random.ext
    const newFilename = file.fieldname + "-" + uniqueSuffix + fileExtension;

    console.log("=== FILE UPLOAD DEBUG ===");
    console.log("Original name:", file.originalname);
    console.log("Extension:", fileExtension);
    console.log("New filename:", newFilename);
    console.log("========================");

    cb(null, newFilename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Check file type
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Error: Images Only! (jpeg, jpg, png, gif, webp)"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// =============================== ###  Get Doctors ### ==============================
router.get("/getDoctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    return res
      .status(200)
      .json({ msg: "Doctors fetched successfully ✅", doctors: doctors });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Server error ⛔⛔", error: error.message });
  }
});

// =============================== ###  Add Doctor ### ==============================
router.post("/addDoctors", upload.single("image"), async (req, res) => {
  try {
    const { name, specialty, description, experienceYears } = req.body;

    console.log("=== REQUEST DEBUG ===");
    console.log("Body:", req.body);
    console.log("File:", req.file);
    console.log("====================");

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ msg: "Please upload an image ⛔" });
    }

    if (!name || !specialty || !description || !experienceYears) {
      return res
        .status(400)
        .json({ msg: "Please enter all required fields ⛔" });
    }

    const doctorExist = await Doctor.findOne({ name });
    if (doctorExist) {
      return res.status(400).json({ msg: "Doctor already exists ⛔⛔" });
    }

    const newDoctor = new Doctor({
      name,
      specialty,
      description,
      experienceYears: parseInt(experienceYears),
      image: req.file.filename, // Save with extension
    });

    await newDoctor.save();

    console.log("Doctor saved with image:", newDoctor.image);

    return res.status(201).json({
      msg: "Doctor added successfully ✅",
      doctor: newDoctor,
    });
  } catch (error) {
    console.error("Error adding doctor:", error);
    return res
      .status(500)
      .json({ msg: "Server error ⛔⛔", error: error.message });
  }
});

// =============================== ###  Get Doctor Count ### ==============================
router.get("/count", async (req, res) => {
  try {
    const count = await Doctor.countDocuments();
    return res
      .status(200)
      .json({ msg: "Doctor count fetched successfully ✅", count: count });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Server error ⛔⛔", error: error.message });
  }
});

// =============================== ###  Get Doctor By Id ### ==============================
router.get("/getDoctors/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found ⛔⛔" });
    }
    return res
      .status(200)
      .json({ msg: "Doctor fetched successfully ✅", doctor: doctor });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Server error ⛔⛔", error: error.message });
  }
});

export default router;
