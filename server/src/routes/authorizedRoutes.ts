import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { hashPassword } from '../utils/auth';
import { comparePassword, generateToken } from '../utils/auth';
import { query } from '../db';

const router = express.Router();

router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  const { email, password, name, address, phone } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    // Check if the email is already in use
    const emailExists = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailExists.rows.length > 0) {
      res.status(400).json({ message: 'Email is already registered' });
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert the user into the database
    const result = await query(
      `INSERT INTO users (email, password, name, address, phone)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [email, hashedPassword, name, address, phone]
    );

    const userId = result.rows[0].id;
    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    const result = await query('SELECT id, password FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const { id, password: hashedPassword } = result.rows[0];

    // Log the hashed password and the comparison result
    console.log('Hashed password from DB:', hashedPassword);

    const isMatch = await comparePassword(password, hashedPassword);
    console.log('Password comparison result:', isMatch);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(id);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Ensure the user exists in the database
    const result = await query('SELECT id, is_admin FROM users WHERE id = $1', [req.user]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const user = result.rows[0];

    res.json({ id: user.id, is_admin: user.is_admin });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;