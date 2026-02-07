import express from "express";
import Notification from "../models/NotificationSchema.js";
import auth from "../auth/Middleware.js";

const router = express.Router();

//=============================== ###  Get Notifications ### ==============================
router.get("/getNotifications", auth(), async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id,
    })
      .populate("data.appointmentId")
      .populate("data.doctorId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      msg: "Notifications fetched successfully ✅",
      notifications: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Server error ⛔⛔",
      error: error.message,
    });
  }
});

//=============================== ###  Mark Notification as Read ### ==============================
router.patch("/markAsRead/:id", auth(), async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        read: true,
        readAt: new Date(),
      },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ msg: "Notification not found ❌" });
    }

    return res.status(200).json({
      msg: "Notification marked as read ✅",
      notification: notification,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Server error ⛔⛔",
      error: error.message,
    });
  }
});

//=============================== ###  Get Unread Count ### ==============================
router.get("/unreadCount", auth(), async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      read: false,
    });

    return res.status(200).json({
      msg: "Unread count fetched successfully ✅",
      count: count,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Server error ⛔⛔",
      error: error.message,
    });
  }
});

export default router;
