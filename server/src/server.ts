import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { query } from './db';
import cron from 'node-cron';

// Import route handlers
import adminRoutes from './routes/adminRoutes';
import authorizedRoutes from './routes/authorizedRoutes';
import calendarRoutes from './routes/calendarRoutes';
import notificationRoutes from './routes/notificationRoutes';
import requestRoutes from './routes/requestRoutes';
import userRoutes from './routes/userRoutes';
import messagesRoutes from './routes/messagesRoutes';

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      // Always allow server-to-server or tools with no origin
      if (!origin) return callback(null, true);

      // If no explicit allowlist is provided in production, allow everything (Render static + custom domains)
      if (allowedOrigins.length === 0 && process.env.NODE_ENV === 'production') {
        return callback(null, true);
      }

      const isAllowedByList = allowedOrigins.includes(origin);
      const isRenderDomain = /(?:^https?:\/\/)?[^\/]*render\.com(?::\d+)?(\/|$)/i.test(origin);

      if (isAllowedByList || isRenderDomain) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
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
app.use('/messages', messagesRoutes);

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

// Schedule the job to run at the top of every hour
cron.schedule('0 * * * *', async () => {
  try {
    const result = await query(
      "DELETE FROM requests WHERE status = 'denied' AND status_updated_at <= NOW() - INTERVAL '24 hours'"
    );
    console.log(`Deleted ${result.rowCount} denied work requests older than 24 hours.`);
  } catch (error) {
    console.error('Error deleting denied work requests:', error);
  }
});

// Schedule job to delete work requests where the corresponding invoice was marked as paid over 24 hours ago
cron.schedule('0 * * * *', async () => {
  try {
    // Delete from requests table if there exists a paid invoice older than 24 hours
    const result = await query(
      `DELETE FROM requests 
       WHERE id IN (
         SELECT request_id FROM invoices 
         WHERE status = 'paid' AND created_at <= NOW() - INTERVAL '24 hours'
       )`
    );
    console.log(`Deleted ${result.rowCount} work requests linked to paid invoices older than 24 hours.`);
  } catch (error) {
    console.error('Error deleting work requests for paid invoices:', error);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
