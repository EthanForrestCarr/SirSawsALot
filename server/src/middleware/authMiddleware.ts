import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db'; // Ensure this points to your actual database utility file

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Extend Request to include user and isAdmin properties
export interface AuthenticatedRequest extends Request {
  user?: number; // ID of the user from the token
  isAdmin?: boolean; // Whether the user is an admin
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access token required' });
    return;
  }

  try {
    // Verify the JWT token
    const payload = jwt.verify(token, JWT_SECRET) as { id: number };
    req.user = payload.id; // Attach the user ID to the request object

    // Fetch user role (admin status) from the database
    const result = await query('SELECT is_admin FROM users WHERE id = $1', [payload.id]);
    if (result.rows.length === 0) {
      res.status(403).json({ message: 'User not found' });
      return;
    }

    req.isAdmin = result.rows[0].is_admin; // Attach admin status to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};
