const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');

const dbConfig = {
  host: '127.0.0.1',
  port: 3307,
  user: 'root',
  password: 'ttgpass',
  database: 'ttg_dashboard',
};

async function importCSV() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const registrationsCSV = fs.readFileSync(path.join(__dirname, 'TABLES(REGISTRATIONS).csv'), 'utf8');
    const statusHistoryCSV = fs.readFileSync(path.join(__dirname, 'TABLES(REGISTRATION STATUS HISTORY).csv'), 'utf8');
    
    const registrationLines = registrationsCSV.trim().split('\n');
    const statusHistoryLines = statusHistoryCSV.trim().split('\n');
    
    const registrationData = registrationLines.slice(1);
    const statusHistoryData = statusHistoryLines.slice(1);
    
    await connection.execute('DELETE FROM registration_status_history');
    await connection.execute('DELETE FROM registration');
    
    for (const line of registrationData) {
      if (line.trim()) {
        const [registration_id] = line.split(',');
        await connection.execute(
          'INSERT INTO registration (registration_id) VALUES (?)',
          [parseInt(registration_id)]
        );
      }
    }
    
    for (const line of statusHistoryData) {
      if (line.trim()) {
        const [registration_status_id, registration_id, status, date_created] = line.split(',');
        const cleanDate = date_created.replace(/\r/g, '').trim();
        const [month, day, year] = cleanDate.split('/');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        
        await connection.execute(
          'INSERT INTO registration_status_history (registration_id, status, date_created) VALUES (?, ?, ?)',
          [parseInt(registration_id), status.trim(), formattedDate]
        );
      }
    }
    
    console.log('CSV import completed successfully!');
    
  } catch (error) {
    console.error('Error importing CSV:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

importCSV().catch(console.error);
