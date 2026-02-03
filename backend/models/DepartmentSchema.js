import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image:{type:String}
    })


const Departments = mongoose.model("Departments", DepartmentSchema);
export default Departments;