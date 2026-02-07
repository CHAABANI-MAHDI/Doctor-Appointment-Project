import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
import bcrypt from "bcryptjs";

// =============================== ###  Get User Count ### ==============================
router.get("/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    return res
      .status(200)
      .json({ msg: "User count fetched successfully ✅", count: count });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Server error ⛔⛔", error: error.message });
  }
});

//=============================== ###  Register User ### ==============================
router.post("/register", async (req, res) => {
  const { name, email, password, role = "user" } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all required fields ⛔" });
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ msg: "User already exists ⛔⛔" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    status: "active",
  });

  let token = jwt.sign(
    { email, id: newUser._id, role: newUser.role },
    process.env.SECRET_KEY,
    { expiresIn: "1w" },
  );

  return res.status(201).json({
    msg: "User registered successfully ✅",
    token: token,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
    },
  });
});

// ============================== ##  Signin User ## ==============================
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "Email and password are required ⛔ " });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User Not Found ⛔⛔" });

  // Check if user is blocked
  if (user.status === "blocked") {
    return res.status(403).json({
      msg: "Your account has been blocked. Please contact support ⛔",
    });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(400).json({ msg: "Password is Not Correct ❌" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: "1w" },
  );

  return res.status(201).json({
    msg: "User logged successfully ✅",
    token: token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
});

export default router;
