# TTG Daily Workload

A comprehensive daily workload management system for tracking and organizing tasks, projects, and team productivity.

## Stack

- **Backend**: Express.js + TypeScript
- **Frontend**: AngularJS 1.8.3 + Vite
- **Database**: MySQL 8.0
- **Deployment**: [To be defined]

## Local Setup

1. Clone the repository
2. Start the database:
   ```bash
   cd db
   docker compose up -d
   ```
3. Database connection details:
   - Host: 127.0.0.1
   - Port: 3306
   - User: root
   - Password: ttgpass
   - Database: ttg_dashboard
4. Start the backend API:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```
5. Start the frontend dashboard:
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```
6. Test the API:
   ```bash
   curl "http://localhost:4000/api/status-counts?date=2025-10-03"
   ```

## Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm lint` - Run linting

## Deploy

[Deployment instructions will be added here]
