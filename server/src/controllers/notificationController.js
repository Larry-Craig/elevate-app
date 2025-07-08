import Notification from "../models/Notification.js";

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const count = await Notification.countDocuments({ user: userId, read: false });
    res.json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ msg: "Failed to get unread notifications count" });
  }
};

// Optional: fetch all notifications for user
export const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ msg: "Failed to get notifications" });
  }
};

// Optional: mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ msg: "Notification not found" });
    res.json({ msg: "Notification marked as read", notification });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update notification" });
  }
};
