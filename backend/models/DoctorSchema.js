// DoctorSchema.js should look like this:
import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    experienceYears: {
      type: Number,
      required: true,
    },
    image: {
      type: String, // Make sure this is just a String with no transformations
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Doctor", DoctorSchema);
