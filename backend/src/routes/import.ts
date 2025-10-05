import { Request, Response } from 'express';
import { pool } from '../db';
import fs from 'fs';
import path from 'path';

export const importSampleData = async (req: Request, res: Response): Promise<void> => {
  try {
    // Clear existing data
    await pool.execute('DELETE FROM registration_status_history');
    await pool.execute('DELETE FROM registration');

    // Read CSV files
    const registrationsCSVPath = path.join(process.cwd(), 'TABLES(REGISTRATIONS).csv');
    const statusHistoryCSVPath = path.join(process.cwd(), 'TABLES(REGISTRATION STATUS HISTORY).csv');


    const registrationsCSV = fs.readFileSync(registrationsCSVPath, 'utf8');
    const statusHistoryCSV = fs.readFileSync(statusHistoryCSVPath, 'utf8');

    const registrationLines = registrationsCSV.trim().split('\n');
    const statusHistoryLines = statusHistoryCSV.trim().split('\n');

    // Skip header row and process data
    const registrationData = registrationLines.slice(1);
    const statusHistoryData = statusHistoryLines.slice(1);

    let importedRegistrations = 0;
    for (const line of registrationData) {
      if (line.trim()) {
        const [registration_id] = line.split(',');
        await pool.execute(
          'INSERT INTO registration (registration_id) VALUES (?)',
          [parseInt(registration_id)]
        );
        importedRegistrations++;
      }
    }

    let importedStatusHistory = 0;
    for (const line of statusHistoryData) {
      if (line.trim()) {
        const [, registration_id, status, date_created] = line.split(',');
        const cleanDate = date_created.replace(/\r/g, '').trim();
        const [month, day, year] = cleanDate.split('/');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        await pool.execute(
          'INSERT INTO registration_status_history (registration_id, status, date_created) VALUES (?, ?, ?)',
          [parseInt(registration_id), status.trim(), formattedDate]
        );
        importedStatusHistory++;
      }
    }

    res.json({
      status: 'CSV data imported successfully',
      registrations: importedRegistrations,
      statusHistory: importedStatusHistory
    });

  } catch (error) {
    console.error('Data import failed:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
};

export const setupDatabase = async (req: Request, res: Response): Promise<void> => {
  try {
    // Drop existing tables if they exist
    await pool.execute('DROP TABLE IF EXISTS registration_status_history');
    await pool.execute('DROP TABLE IF EXISTS registration');

    // Create registration table
    await pool.execute(`
      CREATE TABLE registration (
          registration_id INT PRIMARY KEY
      )
    `);

    // Create registration_status_history table
    await pool.execute(`
      CREATE TABLE registration_status_history (
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

    res.json({
      status: 'Database schema created successfully',
      tables: ['registration', 'registration_status_history']
    });

  } catch (error) {
    console.error('Database setup failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
