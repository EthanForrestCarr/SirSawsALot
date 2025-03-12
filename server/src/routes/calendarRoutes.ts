import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { query } from '../db';

const router = express.Router();

router.get('/unavailable-dates', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT date FROM unavailable_dates');
    res.json(result.rows.map((row) => row.date));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/block-date', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.isAdmin) {
    res.status(403).json({ message: 'Forbidden: Admin access only' });
    return;
  }

  const { date, reason } = req.body;

  if (!date) {
    res.status(400).json({ message: 'Date is required' });
    return;
  }

  try {
    await query('INSERT INTO unavailable_dates (date, reason) VALUES ($1, $2) ON CONFLICT (date) DO NOTHING', [date, reason || 'Unavailable']);
    res.status(201).json({ message: 'Date blocked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Remove a blocked date (Admin Only)
router.delete('/unblock-date/:date', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    if (!req.isAdmin) {
      res.status(403).json({ message: 'Forbidden: Admin access only' });
      return;
    }
  
    const { date } = req.params;
  
    try {
      const result = await query('DELETE FROM unavailable_dates WHERE date = $1 RETURNING date', [date]);
  
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Blocked date not found' });
        return;
      }
  
      res.status(200).json({ message: 'Date unblocked successfully', date: result.rows[0].date });
    } catch (error) {
      console.error('Error unblocking date:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

export default router;