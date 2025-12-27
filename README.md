# CSCI426 – Phase 2 Full-Stack Project

## Project Overview
This project is a full-stack web application developed for **CSCI426 – Web Programming (Phase 2)**.

The application includes:
- A **Next.js frontend**
- A **Node.js + Express backend**
- A **MySQL database**
- **JWT authentication**
- An **admin-only inbox** with full CRUD functionality

Users can sign up, log in, and submit messages through a contact form.  
Admins can securely view, update, and delete messages from a protected inbox.

---

## Tech Stack
### Frontend
- Next.js (React)
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- Zod (validation)
- bcrypt (password hashing)

### Database
- MySQL (XAMPP / phpMyAdmin)

---

## Features
- User signup & login
- Password hashing with bcrypt
- JWT-based authentication
- Protected backend routes
- Admin-only inbox (read / update / delete messages)
- Contact form that stores messages in the database
- Environment-based configuration
- Clean GitHub repository (no secrets or build files)

---

## Project Structure
/
├── backend/ # Express backend
│ ├── server.js
│ ├── package.json
│ └── .env.example
│
├── database/
│ └── schema.sql # Database schema
│
├── src/ # Next.js frontend source
├── public/
├── markdown/Blog/
│
├── .env.example # Frontend env example
├── .gitignore
├── package.json
└── README.md


---

## Environment Variables

### Frontend (`.env.example`)
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_API_BASE=http://localhost:4000


Author

Ali Mk
CSCI426 – Web Programming