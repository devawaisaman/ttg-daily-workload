# TTG Daily Workload

A comprehensive daily workload management system for tracking and organizing tasks, projects, and team productivity.

## Stack

- **Backend**: Express.js + TypeScript
- **Frontend**: AngularJS 1.8.3 + Vite
- **Database**: MySQL 8.0
- **Deployment**: [To be defined]

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

#### Database Setup

For production, you'll need to:
1. Set up a MySQL database (e.g., PlanetScale, Railway, or AWS RDS)
2. Run the schema and seed scripts from `/db/` folder
3. Update the backend environment variables with your production database credentials

#### Environment Variables Summary

**Backend:**
- `DB_HOST` - Database host
- `DB_PORT` - Database port (usually 3306)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name (ttg_dashboard)
- `ALLOWED_ORIGIN` - Frontend URL for CORS

**Frontend:**
- `VITE_API_BASE` - Backend API URL
