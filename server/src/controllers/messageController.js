// server/src/controllers/messageController.js
import Message from "../models/Message.js";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.user._id;

    if (!recipientId || !content) {
      return res.status(400).json({ msg: "Recipient and content are required." });
    }

    const message = new Message({ sender: senderId, recipient: recipientId, content });
    await message.save();

    res.status(201).json({ msg: "Message sent.", message });
  } catch (err) {
    res.status(500).json({ msg: "Failed to send message", error: err.message });
  }
};

// Get all messages between logged-in user and another user (conversation)
export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch messages", error: err.message });
  }
};
