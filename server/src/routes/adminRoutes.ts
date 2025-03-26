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
      // Update the timestamp when the status changes
      updateFields.push(' status_updated_at = NOW()');
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
      customer_description, // renamed field
      wood_keep,            // new field
      stump_grinding,       // new field
      total_amount,
      due_date,
      notes,
      service_type,         // new field
      job_scope,            // new field
      discount              // new field
    } = req.body;
  
    if (
      !request_id ||
      !customer_first_name ||
      !customer_last_name ||
      !address ||
      !customer_description ||
      (wood_keep === undefined) ||
      (stump_grinding === undefined) ||
      !total_amount ||
      !due_date
    ) {
      res.status(400).json({ message: 'All required fields must be filled out' });
      return;
    }
  
    try {
      const result = await query(
        `INSERT INTO invoices
          (request_id, customer_first_name, customer_last_name, customer_email, customer_phone, address, customer_description, wood_keep, stump_grinding, total_amount, due_date, notes, service_type, job_scope, discount)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING *`,
        [request_id, customer_first_name, customer_last_name, customer_email, customer_phone, address, customer_description, wood_keep, stump_grinding, total_amount, due_date, notes, service_type, job_scope, discount]
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
  
  // 📌 UPDATE invoice status (mark as paid/canceled/submitted)
  router.patch('/invoices/:id', authenticateToken, async (req: AuthenticatedRequest, res): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;
  
    // Include "submitted" as a valid status
    if (!['paid', 'canceled', 'submitted'].includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }
  
    try {
      const result = await query(`UPDATE invoices SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
  
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Invoice not found' });
        return;
      }
      
      const updatedInvoice = result.rows[0];
  
      // If submitted, lookup the associated request's user and send a notification.
      if (status === 'submitted' && updatedInvoice.request_id) {
        const requestResult = await query('SELECT user_id FROM requests WHERE id = $1', [updatedInvoice.request_id]);
        if (requestResult.rows.length > 0) {
          const userId = requestResult.rows[0].user_id;
          if (userId) {
            await query('INSERT INTO notifications (user_id, message) VALUES ($1, $2)', [
              userId,
              'You have a new invoice.'
            ]);
          }
        }
      }
  
      res.status(200).json({ message: 'Invoice status updated', invoice: updatedInvoice });
    } catch (error) {
      console.error('Error updating invoice status:', error);
      res.status(500).json({ message: 'Server error' });
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