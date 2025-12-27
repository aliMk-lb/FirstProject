# CSCI426 – Phase 2 Full-Stack Project

## Project Overview
This project is a full-stack web application developed for **CSCI426 – Web Programming (Phase 2)**.

The system includes a modern frontend built with **Next.js**, a secure backend built with **Node.js and Express**, and a **MySQL** database. The application supports user authentication and an **admin-only inbox** for managing messages submitted through a contact form.

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt (password hashing)
- Zod (request validation)

### Database
- MySQL (XAMPP / phpMyAdmin)

---

## Features
- User signup and login
- Secure password hashing
- JWT-based authentication
- Protected backend routes
- Contact form that stores messages in the database
- Admin-only inbox with full CRUD functionality
- Environment-based configuration
- Clean GitHub repository (no secrets or build files)

---

## Project Structure
/
├── backend/
│ ├── server.js
│ ├── package.json
│ └── .env.example
│
├── database/
│ └── schema.sql
│
├── src/
├── public/
├── markdown/Blog/
│
├── .env.example
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


-----




## Author
**Ali Mk**  
CSCI426 – Web Programming  
