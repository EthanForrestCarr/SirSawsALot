import express, { Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { query } from '../db';

const router = express.Router();

router.get('/requests', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

router.get('/requests/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
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

    const requestData = result.rows[0];

    // Convert binary image data (if exists) to base64
    if (requestData.images) {
      requestData.images = Buffer.from(requestData.images).toString('base64');
    }

    res.json(requestData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Consolidated PATCH route for updating request status and date
router.patch('/requests/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.isAdmin) {
    res.status(403).json({ message: 'Forbidden: Admin access only' });
    return;
  }

  const { id } = req.params;
  const { status, date } = req.body;

  console.log(`📌 PATCH request received for request ${id} with status: ${status}, date: ${date}`);

  if (status && !['approved', 'denied'].includes(status)) {
    res.status(400).json({ message: 'Invalid status' });
    return;
  }

  try {
    let queryText = 'UPDATE requests SET';
    let queryParams: any[] = [];
    let updateFields: string[] = [];

    if (status) {
      updateFields.push(' status = $' + (queryParams.length + 1));
      queryParams.push(status);
    }
    if (date) {
      updateFields.push(' date = $' + (queryParams.length + 1));
      queryParams.push(date);
    }

    if (updateFields.length === 0) {
        res.status(400).json({ message: 'No valid fields to update' });
        return;
    }

    queryText += updateFields.join(', ') + ' WHERE id = $' + (queryParams.length + 1) + ' RETURNING id, status, date, user_id';
    queryParams.push(id);

    const result = await query(queryText, queryParams);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Request not found' });
      return; 
    }

    const updatedRequest = result.rows[0];
    console.log(`✅ Successfully updated request ${id}:`, updatedRequest);

    // ✅ Notify the user when their request status is updated
    if (status) {
      await query(
        'INSERT INTO notifications (user_id, message) VALUES ($1, $2)',
        [updatedRequest.user_id, `Your work request was ${status}.`]
      );
    }

    res.status(200).json({ message: 'Request updated', request: updatedRequest });
  } catch (error) {
    console.error('❌ Error updating request:', error);
    res.status(500).json({ message: 'Server error' });
    return;
  }
});

router.put('/requests/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.isAdmin) {
    res.status(403).json({ message: 'Forbidden: Admin access only' });
    return;
  }

  const { id } = req.params;
  const {
    firstName,
    lastName,
    address,
    phone,
    description,
    images,
    branch_height,
    wood_keep,
    wood_arrangement,
    stump_grinding,
    date,
  } = req.body;

  console.log('Received PUT request with data:', req.body); // Log the received data

  try {
    const result = await query(
      `UPDATE requests
       SET first_name = $1, last_name = $2, address = $3, phone = $4, description = $5, images = $6, branch_height = $7, wood_keep = $8, wood_arrangement = $9, stump_grinding = $10, date = $11
       WHERE id = $12 RETURNING *`,
      [firstName, lastName, address, phone, description, images, branch_height, wood_keep, wood_arrangement, stump_grinding, date, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }

    console.log('Updated request:', result.rows[0]); // Log the updated request

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to ensure only admins can access invoice routes
router.use('/invoices', authenticateToken, (req: AuthenticatedRequest, res, next) => {
    if (!req.isAdmin) {
      res.status(403).json({ message: 'Forbidden: Admin access only' });
      return;
    }
    next();
  });
  
  // 📌 CREATE a new invoice
  router.post('/invoices', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const {
      request_id,
      customer_first_name,
      customer_last_name,
      customer_email,
      customer_phone,
      address,
      work_description,
      total_amount,
      due_date,
      notes
    } = req.body;
  
    if (
      !request_id ||
      !customer_first_name ||
      !customer_last_name ||
      !address ||
      !work_description ||
      !total_amount ||
      !due_date
    ) {
      res.status(400).json({ message: 'All required fields must be filled out' });
      return;
    }
  
    try {
      const result = await query(
        `INSERT INTO invoices
          (request_id, customer_first_name, customer_last_name, customer_email, customer_phone, address, work_description, total_amount, due_date, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [request_id, customer_first_name, customer_last_name, customer_email, customer_phone, address, work_description, total_amount, due_date, notes]
      );
      res.status(201).json({ message: 'Invoice created', invoice: result.rows[0] });
    } catch (error) {
      console.error('Error creating invoice:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // 📌 GET all invoices
  router.get('/invoices', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const result = await query(`SELECT * FROM invoices ORDER BY created_at DESC`);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // 📌 GET a single invoice by ID
  router.get('/invoices/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
  
    try {
      const result = await query(`SELECT * FROM invoices WHERE id = $1`, [id]);
  
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Invoice not found' });
        return;
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // 📌 UPDATE invoice status (mark as paid/canceled)
  router.patch('/invoices/:id', authenticateToken, async (req: AuthenticatedRequest, res): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;
  
    if (!['paid', 'canceled'].includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }
  
    try {
      const result = await query(`UPDATE invoices SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
  
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Invoice not found' });
        return;
      }
  
      res.status(200).json({ message: 'Invoice status updated', invoice: result.rows[0] });
    } catch (error) {
      console.error('Error updating invoice status:', error);
      res.status(500).json({ message: 'Server error' });
      return;
    }
  });
  
  // 📌 DELETE an invoice
  router.delete('/invoices/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
  
    try {
      const result = await query(`DELETE FROM invoices WHERE id = $1 RETURNING *`, [id]);
  
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Invoice not found' });
        return;
      }
  
      res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/approved-requests', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.isAdmin) {
      res.status(403).json({ message: 'Forbidden: Admin access only' });
      return;
    }
  
    try {
      const result = await query(`SELECT id, address, date FROM requests WHERE status = 'approved'`);
      res.json(result.rows);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
      return;
    }
  });

  router.get('/all-requests', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.isAdmin) {
      res.status(403).json({ message: 'Forbidden: Admin access only' });
      return;
    }
  
    try {
      // Fetch all requests regardless of status
      const result = await query(`SELECT id, first_name, last_name, address, date, status FROM requests`);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  export default router;