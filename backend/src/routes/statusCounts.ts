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

    const [rows] = await pool.execute(query, [date]);

    const items: StatusCountItem[] = (rows as any[]).map(row => ({
      key: row.status_key,
      name: row.name,
      count: parseInt(row.count),
      atRisk: Boolean(row.at_risk)
    }));

    const response: StatusCountsResponse = { date, items };
    res.json(response);

  } catch (error) {
    console.error('Database error in getStatusCounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
