import express, { Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { query } from '../db';

const router = express.Router();

// 🔔 Notify Jonah when a new request is submitted

// ✅ Fetch notifications for the logged-in user
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [req.user]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Mark all notifications as read for the logged-in user
router.patch('/mark-read', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await query('UPDATE notifications SET is_read = TRUE WHERE user_id = $1', [req.user]);

    // Return the updated notification count
    const updatedNotifications = await query('SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE', [req.user]);

    res.json({ message: 'All notifications marked as read', unreadCount: updatedNotifications.rows[0].count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/mark-read', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      await query(
        `UPDATE notifications SET is_read = TRUE WHERE user_id = $1`,
        [req.user]
      );
  
      const unreadResult = await query(
        `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE`,
        [req.user]
      );
  
      res.status(200).json({ unreadCount: parseInt(unreadResult.rows[0].count, 10) });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

export default router;