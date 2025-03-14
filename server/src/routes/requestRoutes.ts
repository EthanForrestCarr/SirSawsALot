import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { query } from '../db';

const router = express.Router();

router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  console.log("Received Request Payload:", req.body);

  const { description, images, wood_keep, wood_arrangement, stump_grinding, branch_height, date, address, firstName, lastName, email, phone } = req.body;

  if (!description || !date || !address) {
    res.status(400).json({ message: 'All required fields must be filled out.' });
    return;
  }

  try {
    const result = await query(
      `INSERT INTO requests (user_id, description, images, wood_keep, wood_arrangement, stump_grinding, branch_height, date, address, first_name, last_name, email, phone) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      [req.user, description, images, wood_keep, wood_arrangement, stump_grinding, branch_height, date, address, firstName, lastName, email, phone]
    );

    await query('INSERT INTO notifications (user_id, message) VALUES ($1, $2)', [1, 'New work request submitted!']);

    res.status(201).json({ message: 'Work request submitted successfully!', requestId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user;

  try {
    const result = await query(
      `SELECT id, description, images, status, created_at 
       FROM requests 
       WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    res.status(200).json({ requests: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/guest', async (req: Request, res: Response): Promise<void> => {
  const {
    firstName,
    lastName,
    email,
    phone,
    description,
    address,
    images,
    wood_keep,
    wood_arrangement,
    stump_grinding,
    branch_height,
    date,
  } = req.body;

  if (!firstName || !lastName || !email || !phone || !description || !address) {
    res.status(400).json({ message: 'All required fields must be filled out.' });
    return;
  }

  try {
    const result = await query(
      `INSERT INTO requests 
      (first_name, last_name, email, phone, description, address, images, wood_keep, wood_arrangement, stump_grinding, branch_height, date, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending') 
      RETURNING id`,
      [
        firstName,
        lastName,
        email,
        phone,
        description,
        address,
        images,
        wood_keep,
        wood_arrangement,
        stump_grinding,
        branch_height,
        date,
      ]
    );

    res.status(201).json({ message: 'Guest work request submitted successfully.', requestId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/approved-requests', async (_req: Request, res: Response) => {
  try {
    const result = await query(`SELECT id, address, date FROM requests WHERE status = 'approved'`);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;