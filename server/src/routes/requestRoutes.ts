import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { query } from '../db';
import upload from '../middleware/multerConfig'; // Import Multer configuration

const router = express.Router();

router.post('/', authenticateToken, upload.single('imageFile'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  console.log("Received Request Payload:", req.body);
  
  let { description, images, wood_keep, wood_arrangement, stump_grinding, branch_height, date, address, firstName, lastName, email, phone } = req.body;
  if (req.file) {
    images = req.file.buffer;
  }
  
  // Convert branch_height to integer or null
  const branchHeightValue = branch_height === '' ? null : parseInt(branch_height, 10);
  // Extract the non-empty date if provided as an array
  const properDate = Array.isArray(date) ? date.find((d: string) => d !== '') : date;
  // Convert boolean-like strings to actual booleans
  const woodKeepBool = wood_keep === 'true';
  const stumpGrindingBool = stump_grinding === 'true';

  if (!description || !properDate || !address) {
    res.status(400).json({ message: 'All required fields must be filled out.' });
    return;
  }

  try {
    const result = await query(
      `INSERT INTO requests (user_id, description, images, wood_keep, wood_arrangement, stump_grinding, branch_height, date, address, first_name, last_name, email, phone) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      [req.user, description, images, woodKeepBool, wood_arrangement, stumpGrindingBool, branchHeightValue, properDate, address, firstName, lastName, email, phone]
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

router.post('/guest', upload.single('imageFile'), async (req: Request, res: Response): Promise<void> => {
  const {
    firstName,
    lastName,
    email,
    phone,
    description,
    address,
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

  const imageBuffer = req.file ? req.file.buffer : null; // Retrieve file buffer

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
        imageBuffer, // Store binary data
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