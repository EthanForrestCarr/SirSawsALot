import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Render's managed Postgres requires SSL. Enable it automatically in production.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database.');
});

pool.on('error', (err) => {
  console.error('Error with the database connection:', err);
});
