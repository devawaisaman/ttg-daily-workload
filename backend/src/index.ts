import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db';
import { getStatusCounts } from './routes/statusCounts';
import { importSampleData, setupDatabase } from './routes/import';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://ttg-daily-workload-jvhj-git-master-awais-projects-7b37aa21.vercel.app',
    'https://ttg-daily-workload-jvhj.vercel.app',
    'https://ttg-daily-workload-frontend.vercel.app',
    process.env.ALLOWED_ORIGIN || 'http://localhost:5173'
  ],
  credentials: true,
}));

app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api/status-counts', getStatusCounts);
app.post('/api/setup-db', setupDatabase);
app.post('/api/import-data', importSampleData);

// Start server only in local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}

export default app;
