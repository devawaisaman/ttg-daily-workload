import { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'ttgpass',
  database: process.env.DB_NAME || 'ttg_dashboard',
};

interface StatusCountItem {
  key: string;
  name: string;
  count: number;
  atRisk: boolean;
}

interface StatusCountsResponse {
  date: string;
  items: StatusCountItem[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { date } = req.query;

    // Validate date parameter
    if (!date || typeof date !== 'string') {
      res.status(400).json({ error: 'Date parameter is required (YYYY-MM-DD format)' });
      return;
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
      return;
    }

    // Validate that the date is a valid date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      res.status(400).json({ error: 'Invalid date value' });
      return;
    }

    // Create database connection
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Query database
      const query = `
        SELECT s.key, s.name, s.at_risk, COALESCE(dc.count, 0) AS count
        FROM statuses s
        LEFT JOIN daily_counts dc
          ON dc.status_key = s.key AND dc.day = ?
        ORDER BY s.id ASC
      `;

      const [rows] = await connection.execute(query, [date]);

      // Transform the results
      const items: StatusCountItem[] = (rows as any[]).map(row => ({
        key: row.key,
        name: row.name,
        count: parseInt(row.count),
        atRisk: Boolean(row.at_risk)
      }));

      const response: StatusCountsResponse = {
        date,
        items
      };

      res.status(200).json(response);

    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Database error in status-counts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
