import express from 'express';
const router = express.Router();
import Appointment from '../models/AppointmentSchema.js';
import  auth from '../auth/Middleware.js';

//=============================== ###  create Appointment ### ==============================
router.post("/createApt", auth, async (req, res) => {
    
    const { doctor, date, reason } = req.body
    if (!doctor || !date || !reason) return res.status(400).json({ msg: "Please enter all required fields ⛔" })
    
    const newAppointment = await Appointment.create({ user: req.user.id, doctor, date, reason })
    const savedAppointment = await newAppointment.save();
    return res.status(201).json({ msg: "Appointment added successfully ✅", appointment: savedAppointment });
    

})

//=============================== ###  get Appointment ### ==============================
router.get("/getAppointment", auth, async (req, res) => {
    try {
        const appointment = await Appointment.find({user:req.user.id}).populate('user').populate('doctor');
        return res.status(200).json({ msg: "Appointment fetched successfully ✅", appointment: appointment })
        
    } catch (error) {
         return res.status(500).json({ msg: "Server error ⛔⛔", error: error.message });
    }

})

//=============================== ###  delete Appointment ### ==============================
router.delete("/deleteAppoitement/:idAppoit", async (req, res) => {
    try {
        const deletedAppointment = await Appointement.findByIdAndDelete(req.params.idAppoit)
        if (!deletedAppointment) return res.status(404).json({ msg: "Appointement By this id is NOT FOUND ❌" })
        return res.status(200).json({msg : "Appointement Deleted successfully ✅ " , deletedAppointment: deletedAppointment})
    } catch (error) {
         return res.status(500).json({ msg: "Server error ⛔⛔", error: error.message });
    }
    
    
})

export default router;