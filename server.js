import dotenv from 'dotenv';
dotenv.config()

import express from 'express';

import cors from 'cors';
import connectDB from './config/db.js';
import userR from './routes/User.js';
import doctorR from './routes/Doctor.js';
import appointmentR from './routes/Appointment.js'
import departmentR from './routes/Departments.js'

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;



connectDB()
app.use(cors())
app.use("/user", userR);
app.use("/doctors", doctorR);
app.use("/appointments", appointmentR);
app.use("/departments", departmentR);
app.use('/files', express.static('pic-uploads'));




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});