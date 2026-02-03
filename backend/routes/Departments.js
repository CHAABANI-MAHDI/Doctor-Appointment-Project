import express from 'express';
const router = express.Router();
import Department from '../models/DepartmentSchema.js';
import auth from '../auth/Middleware.js';
import multer from 'multer';

// Multer setup for file uploads (if needed in future)
const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'pic-uploads')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
    
    const upload = multer({ storage: storage })

//================================  Add Departments =================//
router.post("/addDept", auth("admin"), upload.single('image'), async (req, res) => {
    
  /* if (req.user.role !== "Admin") return res.status(403).json({ msg: "Access denied ⛔" });
*/
    const { name, description } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!name) return res.status(400).json({ msg: "Name is required ⛔" })
    
    const Departments = await Department.create({name, description , image:req.file.filename})
    const savedDepartment = await Departments.save();
     return res.status(201).json({ msg: "Department added successfully ✅", department: savedDepartment  });

})



// =============================== ###  Get Department Count ### ==============================
router.get("/count", async (req, res) => {

   try {
    const count = await Department.countDocuments();
    return res.status(200).json({ msg: "Department count fetched successfully ✅", count: count });
   } catch (error) {
    return res.status(500).json({ msg: "Server error ⛔⛔", error: error.message });
   }
})
export default router;