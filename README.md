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

### 3. Frontend Development
```bash
cd frontend && cp .env.example .env && npm i && npm run dev
```

### 4. Test API
```bash
curl "http://localhost:4000/api/status-counts?date=2025-10-03"
```

**Expected Response:**
```json
{
  "date": "2025-10-03",
  "items": [
    {
      "key": "documents_received",
      "name": "Documents Received",
      "count": 60,
      "atRisk": false
    },
    {
      "key": "on_hold_qa",
      "name": "On Hold QA",
      "count": 25,
      "atRisk": true
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

## Troubleshooting

### MySQL Connection Issues
- **Error**: `ECONNREFUSED` - Database not running
  - **Solution**: Run `npm run dev:db` and wait for container to start
- **Error**: `Access denied for user 'root'` - Wrong credentials
  - **Solution**: Check `.env` file matches docker-compose.yml settings

### CORS Issues
- **Error**: `CORS policy` in browser console
  - **Solution**: Verify `ALLOWED_ORIGIN` in backend `.env` matches frontend URL
  - **Default**: `http://localhost:5173` for frontend, `http://localhost:4000` for backend

### Date Format Issues
- **Error**: `Invalid date format` from API
  - **Solution**: Use YYYY-MM-DD format (e.g., `2025-10-03`)
  - **Valid**: `2025-10-03`, `2024-12-25`
  - **Invalid**: `10/03/2025`, `2025-10-3`, `03-10-2025`

### Frontend Not Loading Data
- **Check**: Browser network tab for API calls
- **Check**: Backend console for errors
- **Check**: Database connection and data existence

## Deploy

### Vercel Deployment

#### Backend (Serverless API)

1. **Create Vercel Project:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your repository
   - Set **Root Directory** to `/backend`
   - Project name: `ttg-daily-workload-backend`

2. **Set Environment Variables:**
   ```
   DB_HOST=your-database-host
   DB_PORT=3306
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=ttg_dashboard
   ALLOWED_ORIGIN=https://your-frontend-url.vercel.app
   ```

3. **Deploy:**
   - Vercel will automatically deploy on push to main branch
   - API will be available at: `https://ttg-daily-workload-backend.vercel.app/api/status-counts`

#### Frontend (Static Site)

1. **Create Vercel Project:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your repository
   - Set **Root Directory** to `/frontend`
   - Project name: `ttg-daily-workload-frontend`

2. **Set Environment Variables:**
   ```
   VITE_API_BASE=https://ttg-daily-workload-backend.vercel.app
   ```

3. **Deploy:**
   - Vercel will automatically deploy on push to main branch
   - Frontend will be available at: `https://ttg-daily-workload-frontend.vercel.app`

#### Environment Variables Checklist

**Backend Vercel Project:**
- [ ] `DB_HOST` - Your production database host
- [ ] `DB_PORT` - Database port (usually 3306)
- [ ] `DB_USER` - Database username
- [ ] `DB_PASSWORD` - Database password
- [ ] `DB_NAME` - Database name (ttg_dashboard)
- [ ] `ALLOWED_ORIGIN` - Frontend Vercel URL

**Frontend Vercel Project:**
- [ ] `VITE_API_BASE` - Backend Vercel URL

#### Database Setup

For production, you'll need to:
1. Set up a MySQL database (e.g., PlanetScale, Railway, or AWS RDS)
2. Run the schema and seed scripts from `/db/` folder
3. Update the backend environment variables with your production database credentials

## Technical Approach

### Why AngularJS 1.8.3?
- **Legacy compatibility**: Many enterprise environments still use AngularJS
- **Simple data binding**: Perfect for dashboard-style applications
- **No build complexity**: Works directly in browser with CDN
- **Familiar patterns**: Easy for teams already using AngularJS

### Why Simple Express + TypeScript?
- **Type safety**: TypeScript prevents runtime errors
- **Minimal overhead**: Express is lightweight and fast
- **Easy deployment**: Works well with serverless platforms
- **Familiar patterns**: Standard REST API approach

### Why Raw SQL?
- **Performance**: Direct SQL queries are faster than ORMs
- **Transparency**: Easy to understand and debug
- **Flexibility**: Can optimize queries for specific use cases
- **Simplicity**: No additional abstraction layer

### Brand Palette
- **Primary Blue**: `#082240` - TTG brand dark blue
- **Accent Red**: `#EC1C24` - TTG brand red for at-risk items
- **Typography**: "Gotham", "Montserrat", "Helvetica Neue", Arial, sans-serif
- **Design**: Clean, professional, enterprise-focused

### Architecture Decisions
- **Monorepo structure**: Easy to manage related frontend/backend
- **Environment-based config**: Works across dev/staging/production
- **Docker for local DB**: Consistent development environment
- **Vercel deployment**: Serverless backend + static frontend
- **Pre-commit hooks**: Code quality enforcement
