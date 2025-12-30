# FirstProject

Full-stack portfolio and contact management web application.

## Live Demo Links
- Frontend (Vercel): https://first-project-murex-sigma.vercel.app
- Backend API (Render): https://firstproject-b4zd.onrender.com

## Project Overview
A portfolio website with authenticated access, contact form submissions stored in MySQL, and an admin-only inbox. Users authenticate via JWT, messages are persisted in the database, and admins can review and manage incoming messages.

## Technologies Used
- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS, Fetch API
- Backend: Node.js, Express, JWT, MySQL, CORS
- Deployment: Vercel (frontend), Render (backend), Railway (database)
- Tools: GitHub, VS Code

## Folder Structure
```
/
+- backend/          # Express API (auth, inbox)
+- src/              # Next.js frontend (App Router)
+- public/           # Static assets
+- database/         # SQL schema
+- README.md         # Project documentation
+- .env.example/.env.local.example
```

## Setup Instructions

1) Clone the repository
```bash
git clone <repo-url>
cd Ali-website
```

2) Frontend setup
```bash
npm install
cp .env.example .env.local   # fill values
npm run dev                  # http://localhost:3000
```

3) Backend setup
```bash
cd backend
npm install
cp .env.example .env         # fill values
npm run dev                  # nodemon on http://localhost:4000
```

4) Database
- Ensure MySQL is running.
- Create the database and tables:
```bash
mysql -u <user> -p -e "CREATE DATABASE IF NOT EXISTS online_consultation;"
mysql -u <user> -p online_consultation < database/schema.sql
```

### Example Environment Files
Frontend (`.env.local`)
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-me
NEXT_PUBLIC_API_BASE=http://localhost:4000
```

Backend (`backend/.env`)
```
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=replace-me
DB_NAME=online_consultation
JWT_SECRET=replace-me
ADMIN_EMAIL=admin@gmail.com
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## Environment Variables
| Variable | Scope | Purpose |
| --- | --- | --- |
| NEXT_PUBLIC_API_BASE | Frontend | Base URL for backend API requests |
| NEXTAUTH_URL | Frontend | Frontend origin for NextAuth callbacks |
| NEXTAUTH_SECRET | Frontend | NextAuth signing secret |
| JWT_SECRET | Backend | Token signing/verification secret |
| FRONTEND_URL | Backend | Allowed origin for CORS |
| DB_HOST | Backend | MySQL host |
| DB_PORT | Backend | MySQL port |
| DB_USER | Backend | MySQL username |
| DB_PASSWORD | Backend | MySQL password |
| DB_NAME | Backend | MySQL database name |
| PORT | Backend | API server port |
| NODE_ENV | Backend | Environment mode (development/production) |

## API Endpoints
- `POST /auth/signup` — register a new user
- `POST /auth/login` — authenticate and receive JWT
- `POST /api/messages` — submit contact form
- `GET /api/messages` — fetch messages (admin)
- `PATCH /api/messages/:id` — update message status (admin)
- `DELETE /api/messages/:id` — delete message (admin)

## Admin Access
- Default admin email: `admin@gmail.com` (set in backend `.env`). Assign this user the admin role in the database.

## Challenges & Learnings
- Managing CORS between frontend (Vercel) and backend (Render)
- Coordinating deployments across Vercel, Render, and Railway
- Implementing secure JWT authentication and protecting admin routes
- Handling environment variables for local and cloud environments

## Future Scope
- Password reset and email flows
- Role-based management for multiple admin levels
- UI/UX improvements and richer admin inbox features

## License
© All rights reserved. Made by GetNextJs Templates • Distributed by ThemeWagon edited by Ali Al Rida Al Mokdad
