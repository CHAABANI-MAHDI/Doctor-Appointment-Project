import express from 'express';
const router = express.Router();
import Doctor from '../models/DoctorSchema.js';
import multer from 'multer';


// Multer setup for file uploads (if needed in future)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'pic-uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })


// =============================== ###  Add Doctor ### ==============================
router.post("/addDoctors", upload.single('image'), async (req, res) => {
    try{
        const { name, specialty, description, experienceYears } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!name || !specialty || !description || !experienceYears || !image)   return res.status(400).json({ msg: "Please enter all required fields ⛔" });
    

         const doctorExist = await Doctor.findOne({ name });
        if (doctorExist)      return res.status(400).json({ msg: "Doctor already exists ⛔⛔" });
            
        const newDoctor = await Doctor.create({ name, specialty, description, experienceYears, image:req.file.filename });
        const savedDoctor = await newDoctor.save();

        return res.status(201).json({ msg: "Doctor added successfully ✅", doctor: savedDoctor });

        
    } catch (error) {
        return res.status(500).json({ msg: "Server error ⛔⛔", error: error.message });
    }
})


// =============================== ###  Get Doctors ### ==============================
router.get("/getDoctors", async (req, res) => {
    try {
        const doctors = await Doctor.find();
        return res.status(200).json({ msg: "Doctors fetched successfully ✅", doctors: doctors });  
        
    } catch (error) {
        return res.status(500).json({ msg: "Server error ⛔⛔", error: error.message });
    }
})


// =============================== ###  Get Doctor By Id ### ==============================
router.get("/getDoctors/:id", async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
        return res.status(404).json({ msg: "Doctor not found ⛔⛔" });
    }
    return res.status(200).json({ msg: "Doctor fetched successfully ✅", doctor: doctor });
})

export default router;