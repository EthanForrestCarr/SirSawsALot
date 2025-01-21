import express, { Application, Request, Response } from 'express';
import { query } from './db';
import { hashPassword } from './utils/auth';
import { comparePassword, generateToken } from './utils/auth';
import { authenticateToken } from './middleware/authMiddleware';
import { AuthenticatedRequest } from './middleware/authMiddleware';
import cors from 'cors';

const app: Application = express();
const port = 3000;

// Allow requests from the frontend
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's URL in production
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies if needed
}));

// Middleware to parse JSON requests
app.use(express.json());

// Basic route to test the server
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await query('SELECT NOW()');
    res.json({ message: 'Database connected', timestamp: result.rows[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Example protected route
app.get('/protected', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.user; // Access the user ID added by the middleware
  res.json({ message: `Hello, user with ID ${userId}! You are authorized.` });
});

app.post('/auth/signup', async (req: Request, res: Response): Promise<void> => {
  const { email, password, name, address, contact_info } = req.body;

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
      `INSERT INTO users (email, password, name, address, contact_info)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [email, hashedPassword, name, address, contact_info]
    );

    const userId = result.rows[0].id;
    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/auth/login', async (req: Request, res: Response): Promise<void> => {
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

app.post('/requests', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const {
    description,
    address,
    images,
    wood_keep,
    wood_arrangement,
    stump_grinding,
    branch_height,
  } = req.body;
  const userId = (req as any).user || null;

  try {
    const result = await query(
      `INSERT INTO requests (user_id, description, address, images, wood_keep, wood_arrangement, stump_grinding, branch_height)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [userId, description, address, images, wood_keep, wood_arrangement, stump_grinding, branch_height]
    );

    res.status(201).json({ message: 'Work request submitted successfully', requestId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.get('/requests', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user; // Extract user ID from the token

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

app.get('/admin/requests', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.isAdmin) {
    res.status(403).json({ message: 'Forbidden: Admin access only' });
    return;
  }

  try {
    const result = await query('SELECT * FROM requests ORDER BY created_at DESC');
    res.status(200).json({ requests: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/admin/requests/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.isAdmin) {
    res.status(403).json({ message: 'Forbidden: Admin access only' });
    return;
  }

  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ['approved', 'denied', 'pending'];
  
  if (!validStatuses.includes(status)) {
    res.status(400).json({ message: 'Invalid status' });
    return;
  }

  try {
    const result = await query(
      `UPDATE requests SET status = $1 WHERE id = $2 RETURNING id, status`,
      [status, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }

    res.status(200).json({ message: 'Request updated', request: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});