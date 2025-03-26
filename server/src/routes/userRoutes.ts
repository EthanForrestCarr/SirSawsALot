import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import bcrypt from 'bcrypt';
import { query } from '../db';

const router = express.Router();

router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await query('SELECT first_name, last_name, email, address, phone, is_admin FROM users WHERE id = $1', [req.user]);
    if (user.rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user.rows[0]); // Includes is_admin
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user;
  // Destructure snake_case keys as sent from the client
  const { first_name, last_name, email, phone, address } = req.body;
  try {
    const result = await query(
      'UPDATE users SET first_name = $1, last_name = $2, email = $3, phone = $4, address = $5 WHERE id = $6 RETURNING first_name, last_name, email, phone, address',
      [first_name, last_name, email, phone, address, userId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/password', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user;
  const { currentPassword, newPassword } = req.body;
  try {
    const result = await query('SELECT password FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, result.rows[0].password);
    if (!isMatch) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new route to get a user's name by id
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT first_name, last_name FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const { first_name, last_name } = result.rows[0];
    res.json({ name: `${first_name} ${last_name}` });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;