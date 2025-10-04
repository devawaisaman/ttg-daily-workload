import { Request, Response } from 'express';
import { pool } from '../db';

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

export const getStatusCounts = async (req: Request, res: Response): Promise<void> => {
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

    // Query database
    const query = `
      SELECT s.key, s.name, s.at_risk, COALESCE(dc.count, 0) AS count
      FROM statuses s
      LEFT JOIN daily_counts dc
        ON dc.status_key = s.key AND dc.day = ?
      ORDER BY s.id ASC
    `;

    const [rows] = await pool.execute(query, [date]);

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

    res.json(response);

  } catch (error) {
    console.error('Database error in getStatusCounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
