// routes/notification.js
import express from 'express';
import { getUnreadCount } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/unread-count', protect, getUnreadCount);

export default router;
