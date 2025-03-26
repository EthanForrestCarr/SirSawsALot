import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { query } from '../db';

const router = express.Router();

// Regular user: Get conversation with admin
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (req.isAdmin) {
    res.status(400).json({ message: 'Admins should use /messages/user/:userId' });
    return;
  }
  try {
    const result = await query('SELECT * FROM messages WHERE user_id = $1 ORDER BY created_at ASC', [req.user]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Regular user: Post a new message to admin
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (req.isAdmin) {
    res.status(400).json({ message: 'Admins should use /messages/user/:userId endpoint' });
    return;
  }
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ message: 'Message text is required' });
    return;
  }
  try {
    const result = await query(
      'INSERT INTO messages (user_id, is_admin, message) VALUES ($1, $2, $3) RETURNING *',
      [req.user, false, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get conversation with a specific user
router.get('/user/:userId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.isAdmin) {
    res.status(403).json({ message: 'Forbidden: Admin access only' });
    return;
  }
  const { userId } = req.params;
  try {
    const result = await query(
      'SELECT * FROM messages WHERE user_id = $1 ORDER BY created_at ASC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Post a message to a specific user
router.post('/user/:userId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.isAdmin) {
    res.status(403).json({ message: 'Forbidden: Admin access only' });
    return;
  }
  const { userId } = req.params;
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ message: 'Message text is required' });
    return;
  }
  try {
    const result = await query(
      'INSERT INTO messages (user_id, is_admin, message) VALUES ($1, $2, $3) RETURNING *',
      [userId, true, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete an entire conversation with a user
router.delete('/user/:userId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.isAdmin) {
    res.status(403).json({ message: 'Forbidden: Admin access only' });
    return;
  }
  const { userId } = req.params;
  try {
    await query('DELETE FROM messages WHERE user_id = $1', [userId]);
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get list of conversations (distinct users with messages)
router.get('/conversations', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.isAdmin) {
    res.status(403).json({ message: 'Forbidden: Admin access only' });
    return;
  }
  try {
    const result = await query(`
      SELECT 
        m.user_id, 
        u.first_name, 
        u.last_name,
        (SELECT message FROM messages WHERE user_id = m.user_id ORDER BY created_at DESC LIMIT 1) AS latest_message_preview,
        (SELECT created_at FROM messages WHERE user_id = m.user_id ORDER BY created_at DESC LIMIT 1) AS latest_message_created_at
      FROM messages m
      JOIN users u ON m.user_id = u.id
      GROUP BY m.user_id, u.first_name, u.last_name
      ORDER BY latest_message_created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
