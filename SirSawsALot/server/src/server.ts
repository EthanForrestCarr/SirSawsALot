import * as express from 'express';
import { query } from './db';

const app: express.Application = express();
const port = 3000;

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
