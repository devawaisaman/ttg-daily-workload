# TTG Daily Workload Dashboard

A comprehensive daily workload management system for tracking and organizing tasks, projects, and team productivity.

## Prerequisites

- **Node.js**: v22.12.0 (use `nvm use` to switch versions)
- **Docker**: For local MySQL database

## Quick Start

### 1. Start Database
```bash
npm run dev:db
```

### 2. Backend Development
```bash
cd backend && cp .env.example .env && npm i && npm run dev
```

### 3. Setup Database (First Time Only)
```bash
# Create database schema
curl -X POST "http://localhost:4000/api/setup-db"

# Import CSV data (1,825 registrations + 5,790 status records)
curl -X POST "http://localhost:4000/api/import-data"
```

### 4. Frontend Development
```bash
cd frontend && cp .env.example .env && npm i && npm run dev
```

### 5. Test API
```bash
curl "http://localhost:4000/api/status-counts?date=2024-07-24"
```

**Expected Response:**
```json
{
  "date": "2024-07-24",
  "items": [
    {
      "key": "On Hold- QA",
      "name": "On Hold- QA",
      "count": 1,
      "atRisk": true
    },
    {
      "key": "Send Docs to TTG",
      "name": "Send Docs to TTG",
      "count": 1,
      "atRisk": false
    }
  ]
}
```

## Stack

- **Backend**: Express.js + TypeScript
- **Frontend**: AngularJS 1.8.3 + Vite
- **Database**: MySQL 8.0
- **Deployment**: Vercel (serverless + static)

## Database Schema

```
registration
├── registration_id (INT, PK)

registration_status_history
├── registration_status_id (INT, PK, AI)
├── registration_id (INT, FK → registration.registration_id)
├── status (VARCHAR(128))
└── date_created (DATE)
```

**Sample Query to Recompute Counts:**
```sql
SELECT 
  status,
  DATE(date_created) as day,
  COUNT(*) as count
FROM registration_status_history 
WHERE DATE(date_created) = '2025-10-03'
GROUP BY status, DATE(date_created)
ORDER BY status;
```

## Local Setup

### Quick Start (3 Terminals)

1. **Terminal 1 - Database:**
   ```bash
   npm run dev:db
   ```

2. **Terminal 2 - Backend API:**
   ```bash
   npm run dev:backend
   ```

3. **Terminal 3 - Frontend Dashboard:**
   ```bash
   npm run dev:frontend
   ```

### Manual Setup

1. Clone the repository
2. Install all dependencies:
   ```bash
   npm run install:all
   ```
3. Start the database:
   ```bash
   cd db
   docker compose up -d
   ```
4. Database connection details:
   - Host: 127.0.0.1
   - Port: 3306
   - User: root
   - Password: ttgpass
   - Database: ttg_dashboard
5. Start the backend API:
   ```bash
   cd backend
   cp .env.example .env
   npm run dev
   ```
6. Start the frontend dashboard:
   ```bash
   cd frontend
   cp .env.example .env
   npm run dev
   ```
7. Test the API:
   ```bash
   curl "http://localhost:4000/api/status-counts?date=2025-10-03"
   ```

## Scripts

### Root Level
- `npm run dev:db` - Start database with Docker
- `npm run dev:backend` - Start backend API server
- `npm run dev:frontend` - Start frontend development server
- `npm run lint` - Run ESLint on backend
- `npm run format` - Format code with Prettier
- `npm run install:all` - Install dependencies for all projects

### Backend
- `npm run dev` - Start development server with ts-node-dev
- `npm run build` - Build TypeScript to dist/
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build static files
- `npm run preview` - Preview built files
- `npm run format` - Format with Prettier
