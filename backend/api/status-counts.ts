import { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

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
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { date } = req.query;

    if (!date || typeof date !== 'string') {
      res.status(400).json({ error: 'Date parameter is required (YYYY-MM-DD format)' });
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
      return;
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      res.status(400).json({ error: 'Invalid date value' });
      return;
    }

    const connection = await mysql.createConnection(dbConfig);

    try {
      const query = `
        SELECT 
          status as status_key,
          status as name,
          CASE 
            WHEN status = 'On Hold- QA' THEN 1 
            ELSE 0 
          END as at_risk,
          COUNT(*) as count
        FROM registration_status_history 
        WHERE DATE(date_created) = ?
        GROUP BY status
        ORDER BY status
      `;

      const [rows] = await connection.execute(query, [date]);

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