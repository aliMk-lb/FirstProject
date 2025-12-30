# FirstProject (Ali Website)

## Live Demo
- Frontend (Vercel): https://YOUR-VERCEL-LINK.vercel.app
- Backend (Render): https://firstproject-b4zd.onrender.com

## Project Description
A personal portfolio site with sections for Hero, Services, Portfolio, Blog, and Contact. Users can sign up/log in (JWT), and an admin-only inbox displays contact form submissions stored in MySQL.

## Tech Stack
- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: Node.js + Express
- Auth: JWT + bcrypt
- Validation: Zod
- Database: MySQL
- Hosting: Vercel (frontend), Render (backend)

## Project Structure
- Frontend: `/` (Next.js app, Tailwind)
- Backend: `/backend` (Express API, JWT auth)
- Database schema: `database/schema.sql`

## Environment Variables

### Frontend (`.env.local`)
Based on `.env.example` in the repo:
```
NEXTAUTH_URL=http://localhost:3000        # or your deployed frontend URL
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_API_BASE=http://localhost:4000 # or your deployed backend URL
```

### Backend (`backend/.env`)
Based on `backend/.env.example`:
```
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-password-here
DB_NAME=online_consultation
JWT_SECRET=your-secret-key-change-this-in-production
ADMIN_EMAIL=admin@gmail.com
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## Database Setup
1) Create the database and tables:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS online_consultation;"
mysql -u root -p online_consultation < database/schema.sql
```
2) (Optional) Seed an admin user matching `ADMIN_EMAIL` with a bcrypt-hashed password, or register and update the role to `admin` manually.

## Run Locally

### Frontend
```bash
npm install
npm run dev
# app runs at http://localhost:3000
```

### Backend
```bash
cd backend
npm install
npm run dev           # uses nodemon on port 4000 by default
```
Ensure MySQL is running and the backend `FRONTEND_URL` matches your frontend origin.

## Deployment Notes
- Vercel: set `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, and `NEXT_PUBLIC_API_BASE` to your Render backend URL.
- Render: set all backend env vars; update `FRONTEND_URL` to your Vercel domain; use production DB credentials.
