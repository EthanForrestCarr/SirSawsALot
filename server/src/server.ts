import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { query } from './db';

// Import route handlers
import adminRoutes from './routes/adminRoutes';
import authorizedRoutes from './routes/authorizedRoutes';
import calendarRoutes from './routes/calendarRoutes';
import notificationRoutes from './routes/notificationRoutes';
import requestRoutes from './routes/requestRoutes';
import userRoutes from './routes/userRoutes';

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
app.use(
  cors({
    origin: 'http://localhost:5173', // Update for production
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

// Middleware to parse JSON requests
app.use(express.json());

// Register route handlers
app.use('/admin', adminRoutes);
app.use('/auth', authorizedRoutes);
app.use('/calendar', calendarRoutes);
app.use('/notifications', notificationRoutes);
app.use('/requests', requestRoutes);
app.use('/user', userRoutes);

// Health Check Route
app.get('/', (_req: Request, res: Response) => {
  res.send('Server is running!');
});

// Database Connection Test
app.get('/api/test-db', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT NOW()');
    res.json({ message: 'Database connected', timestamp: result.rows[0].now });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
