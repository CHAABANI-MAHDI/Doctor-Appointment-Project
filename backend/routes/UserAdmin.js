import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/UserSchema.js";

const router = express.Router();

// =============================== ###  Get Users ### ==============================
router.get("/getUsers", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ msg: "Users fetched successfully ✅", users: users });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Server error ⛔⛔", error: error.message });
  }
});

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

// =============================== ###  Get User By ID ### ==============================
router.get("/getUser/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found ⛔⛔" });
    }
    return res
      .status(200)
      .json({ msg: "User fetched successfully ✅", user: user });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Server error ⛔⛔", error: error.message });
  }
});

// =============================== ###  Add User ### ==============================
router.post("/addUser", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "user",
      status = "active",
    } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ msg: "Please enter all required fields ⛔" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "User already exists ⛔⛔" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      status,
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      msg: "User added successfully ✅",
      user: userResponse,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Server error ⛔⛔", error: error.message });
  }
});

// =============================== ###  Update User ### ==============================
router.put("/updateUser/:id", async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found ⛔⛔" });
    }

    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ msg: "Email already in use ⛔⛔" });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (status) user.status = status;

    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return res
      .status(200)
      .json({ msg: "User updated successfully ✅", user: userResponse });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Server error ⛔⛔", error: error.message });
  }
});

// =============================== ###  Toggle Status ### ==============================
router.patch("/toggleStatus/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found ⛔⛔" });
    }

    user.status = user.status === "active" ? "blocked" : "active";
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return res
      .status(200)
      .json({ msg: "Status updated successfully ✅", user: userResponse });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Server error ⛔⛔", error: error.message });
  }
});

// =============================== ###  Toggle Role ### ==============================
router.patch("/toggleRole/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found ⛔⛔" });
    }

    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return res
      .status(200)
      .json({ msg: "Role updated successfully ✅", user: userResponse });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Server error ⛔⛔", error: error.message });
  }
});

// =============================== ###  Delete User ### ==============================
router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found ❌" });
    }

    return res.status(200).json({
      msg: "User deleted successfully ✅",
      deletedUser: deletedUser,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Server error ⛔⛔",
      error: error.message,
    });
  }
});

export default router;
