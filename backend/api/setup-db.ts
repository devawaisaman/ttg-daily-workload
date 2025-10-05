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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST to setup database.' });
    return;
  }

  try {
    console.log('Setting up database schema...');
    
    const connection = await mysql.createConnection(dbConfig);
    
    try {
      // Create registration table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS registration (
          registration_id INT PRIMARY KEY
        )
      `);
      
      // Create registration_status_history table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS registration_status_history (
          registration_status_id INT AUTO_INCREMENT PRIMARY KEY,
          registration_id INT NOT NULL,
          status VARCHAR(128) NOT NULL,
          date_created DATE NOT NULL,
          INDEX(registration_id),
          INDEX(date_created),
          INDEX(status),
          FOREIGN KEY (registration_id) REFERENCES registration(registration_id)
        )
      `);
      
      res.status(200).json({ 
        status: 'Database schema created successfully',
        tables: ['registration', 'registration_status_history']
      });
      
    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({ 
      error: 'Database setup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
