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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST to import data.' });
    return;
  }

  try {
    console.log('Importing sample data...');
    
    const connection = await mysql.createConnection(dbConfig);
    
    try {
      // Clear existing data
      await connection.execute('DELETE FROM registration_status_history');
      await connection.execute('DELETE FROM registration');
      
      // Insert sample registrations
      const registrations = [
        [74523], [84752], [86098], [86345], [86783], [89168], [89175], [90895], [91610], [92794]
      ];
      
      for (const [registration_id] of registrations) {
        await connection.execute(
          'INSERT INTO registration (registration_id) VALUES (?)',
          [registration_id]
        );
      }
      
      // Insert sample status history
      const statusHistory = [
        [74523, 'Documents Received', '2024-04-19'],
        [74523, 'TTG sent to county', '2024-04-19'],
        [84752, 'On Hold- QA', '2024-07-24'],
        [84752, 'Send Docs to TTG', '2024-07-24'],
        [86098, 'On Hold- QA', '2024-08-06'],
        [86098, 'On Hold- QA', '2024-09-04'],
        [86345, 'Send Docs to TTG', '2024-08-09'],
        [86345, 'Documents Received', '2024-08-19'],
        [86783, 'On Hold- QA', '2024-08-14'],
        [86783, 'Send Docs to TTG', '2024-08-14'],
        [89168, 'Send Docs to TTG', '2024-09-06'],
        [89175, 'On Hold- QA', '2024-09-06'],
        [89175, 'On Hold- QA', '2024-09-06'],
        [89175, 'On Hold- QA', '2024-11-20']
      ];
      
      for (const [registration_id, status, date_created] of statusHistory) {
        await connection.execute(
          'INSERT INTO registration_status_history (registration_id, status, date_created) VALUES (?, ?, ?)',
          [registration_id, status, date_created]
        );
      }
      
      res.status(200).json({ 
        status: 'Sample data imported successfully',
        registrations: registrations.length,
        statusHistory: statusHistory.length
      });
      
    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Data import error:', error);
    res.status(500).json({ 
      error: 'Data import failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
