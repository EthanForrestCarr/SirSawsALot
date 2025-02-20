import express, { Application, Request, Response } from 'express';
import { query } from './db';
import { hashPassword } from './utils/auth';
import { comparePassword, generateToken } from './utils/auth';
import { authenticateToken } from './middleware/authMiddleware';
import { AuthenticatedRequest } from './middleware/authMiddleware';
import cors from 'cors';
import bcrypt from 'bcrypt';

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

app.get('/user', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await query('SELECT name, email, address, phone, is_admin FROM users WHERE id = $1', [req.user]);
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

app.post('/auth/signup', async (req: Request, res: Response): Promise<void> => {
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

// 🔔 Notify Jonah when a new request is submitted
app.post('/requests', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  console.log("Received Request Payload:", req.body); // <-- Add this line to debug

  const { description, images, wood_keep, wood_arrangement, stump_grinding, branch_height, date, address, name, email, phone } = req.body;

  if (!description || !date || !address) { // <-- Ensure address is required
    res.status(400).json({ message: 'All required fields must be filled out.' });
    return;
  }

  try {
    const result = await query(
      `INSERT INTO requests (user_id, description, images, wood_keep, wood_arrangement, stump_grinding, branch_height, date, address, name, email, phone) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
      [req.user, description, images, wood_keep, wood_arrangement, stump_grinding, branch_height, date, address, name, email, phone]
    );

    await query('INSERT INTO notifications (user_id, message) VALUES ($1, $2)', [1, 'New work request submitted!']);

    res.status(201).json({ message: 'Work request submitted successfully!', requestId: result.rows[0].id });
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

app.get('/admin/requests/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.isAdmin) {
    res.status(403).json({ message: 'Forbidden: Admin access only' });
    return;
  }

  const { id } = req.params;

  try {
    const result = await query('SELECT * FROM requests WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Notify the user when their request is updated
app.patch('/admin/requests/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.isAdmin) {
    res.status(403).json({ message: 'Forbidden: Admin access only' });
    return;
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'denied'].includes(status)) {
    res.status(400).json({ message: 'Invalid status' });
    return;
  }

  try {
    const result = await query(`UPDATE requests SET status = $1 WHERE id = $2 RETURNING user_id`, [status, id]);

    if (result.rows.length > 0) {
      const user_id = result.rows[0].user_id;
      await query('INSERT INTO notifications (user_id, message) VALUES ($1, $2)', [user_id, `Your work request was ${status}.`]);
    }

    res.status(200).json({ message: 'Request updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/admin/requests/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.isAdmin) {
    res.status(403).json({ message: 'Forbidden: Admin access only' });
    return;
  }

  const { id } = req.params;
  const {
    description,
    address,
    wood_keep,
    wood_arrangement,
    stump_grinding,
    branch_height,
  } = req.body;

  try {
    const result = await query(
      `UPDATE requests
       SET description = $1, address = $2, wood_keep = $3, wood_arrangement = $4, stump_grinding = $5, branch_height = $6
       WHERE id = $7 RETURNING *`,
      [description, address, wood_keep, wood_arrangement, stump_grinding, branch_height, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/user', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user;
  try {
    const result = await query('SELECT name, email, phone, address FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/user', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user;
  const { name, email, phone, address } = req.body;
  try {
    const result = await query(
      'UPDATE users SET name = $1, email = $2, phone = $3, address = $4 WHERE id = $5 RETURNING name, email, phone, address',
      [name, email, phone, address, userId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/user/password', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

app.post('/requests/guest', async (req: Request, res: Response): Promise<void> => {
  const {
    name,
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

  if (!name || !email || !phone || !description || !address) {
    res.status(400).json({ message: 'All required fields must be filled out.' });
    return;
  }

  try {
    const result = await query(
      `INSERT INTO requests 
      (name, email, phone, description, address, images, wood_keep, wood_arrangement, stump_grinding, branch_height, date, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending') 
      RETURNING id`,
      [
        name,
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

app.patch('/admin/requests/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.isAdmin) {
    res.status(403).json({ message: 'Forbidden: Admin access only' });
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'denied'].includes(status)) {
    res.status(400).json({ message: 'Invalid status' });
    return;
  }

  try {
    // Update request status
    const result = await query(
      `UPDATE requests SET status = $1 WHERE id = $2 RETURNING user_id, email`,
      [status, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Request not found' });
    }

    const { user_id, email } = result.rows[0];

    // Create a notification
    const message = status === 'approved' 
      ? 'Your work request has been approved.' 
      : 'Your work request has been denied.';

    await query(
      `INSERT INTO notifications (user_id, guest_email, message) VALUES ($1, $2, $3)`,
      [user_id, email, message]
    );

    res.status(200).json({ message: 'Request updated', request: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Fetch notifications for the logged-in user
app.get('/notifications', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [req.user]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Mark all notifications as read for the logged-in user
app.patch('/notifications/mark-read', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
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


app.get('/calendar/unavailable-dates', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT date FROM unavailable_dates');
    res.json(result.rows.map((row) => row.date));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/calendar/block-date', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
