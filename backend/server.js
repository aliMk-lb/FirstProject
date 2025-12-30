'use strict'

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { z } = require('zod')

const app = express()

// === Config ===
const PORT = process.env.PORT || 4000
const FRONTEND_URL =
  (process.env.FRONTEND_URL || 'https://ali-website.vercel.app').replace(/\/$/, '')
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase()
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

// Normalize DB env vars (supports Railway defaults)
const parseMysqlUrl = (value) => {
  if (!value) return null
  try {
    const url = new URL(value)
    return {
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username || ''),
      password: decodeURIComponent(url.password || ''),
      database: (url.pathname || '').replace(/^\//, '') || undefined,
      ssl: url.searchParams.get('sslmode') === 'require' || undefined,
    }
  } catch (_err) {
    return null
  }
}

const DB_HOST_FALLBACK =
  process.env.DB_HOST ||
  process.env.MYSQLHOST ||
  process.env.MYSQL_HOST ||
  'localhost'
const DB_PORT_FALLBACK = Number(
  process.env.DB_PORT || process.env.MYSQLPORT || process.env.MYSQL_PORT || 3306
)
const DB_USER_FALLBACK =
  process.env.DB_USER || process.env.MYSQLUSER || process.env.MYSQL_USER || 'root'
const DB_PASSWORD_FALLBACK =
  process.env.DB_PASSWORD ||
  process.env.MYSQLPASSWORD ||
  process.env.MYSQL_PASSWORD ||
  process.env.MYSQL_ROOT_PASSWORD ||
  ''
const DB_NAME_FALLBACK =
  process.env.DB_NAME ||
  process.env.MYSQLDATABASE ||
  process.env.MYSQL_DATABASE ||
  'online_consultation'
const DB_SSL_FALLBACK =
  process.env.DB_SSL === 'true' ||
  process.env.MYSQL_SSL === 'true' ||
  process.env.MYSQL_USE_SSL === 'true'

const parsedUrl =
  parseMysqlUrl(process.env.MYSQL_URL) ||
  parseMysqlUrl(process.env.MYSQL_PUBLIC_URL) ||
  parseMysqlUrl(process.env.DATABASE_URL)

const DB_HOST = parsedUrl?.host || DB_HOST_FALLBACK
const DB_PORT = parsedUrl?.port || DB_PORT_FALLBACK
const DB_USER = parsedUrl?.user || DB_USER_FALLBACK
const DB_PASSWORD = parsedUrl?.password || DB_PASSWORD_FALLBACK
const DB_NAME = parsedUrl?.database || DB_NAME_FALLBACK
const DB_SSL = parsedUrl?.ssl || DB_SSL_FALLBACK

// === DB Pool ===
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: DB_SSL ? { rejectUnauthorized: false } : undefined,
})

// === Middleware ===
const additionalAllowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'https://first-project-murex-sigma.vercel.app',
  'https://firstproject-b4zd.onrender.com',
]

const additionalAllowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

const isAllowedOrigin = (origin) => {
  if (!origin) return true // server-to-server / health
  if (allowedOrigins.includes(origin)) return true
  if (additionalAllowedOrigins.includes(origin)) return true
  if (origin.endsWith('.vercel.app')) return true // allow Vercel previews/frontends
  return false
}

app.use(
  cors({
    origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    optionsSuccessStatus: 200,
  })
)
app.options('*', cors())
app.use(express.json())
app.set('trust proxy', 1)

// === Helpers ===
const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.substring(7) : null
    if (!token) return res.status(401).json({ error: 'Missing token' })
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (_err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

const adminMiddleware = (req, res, next) => {
  const email = (req.user?.email || '').toLowerCase()
  if (email !== ADMIN_EMAIL) return res.status(403).json({ error: 'Admin only' })
  next()
}

const initSchema = async () => {
  const createUsers = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('user','admin') NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `

  const createMessages = `
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL,
      subject VARCHAR(200) NULL,
      message TEXT NOT NULL,
      status ENUM('new','read','replied') NOT NULL DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `

  const conn = await pool.getConnection()
  try {
    await conn.query(createUsers)
    await conn.query(createMessages)
  } finally {
    conn.release()
  }
}

// === Validation ===
const signupSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
})

const messageSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(1).optional(),
  message: z.string().min(1, 'Message required'),
})

const statusSchema = z.object({
  status: z.enum(['new', 'read', 'replied']),
})

// === Routes ===
app.get('/health', async (_req, res) => {
  try {
    const conn = await pool.getConnection()
    try {
      await conn.query('SELECT 1')
    } finally {
      conn.release()
    }
    res.json({ status: 'ok', db: 'connected', time: new Date().toISOString() })
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Database connection failed', detail: err?.message })
  }
})

app.post('/auth/signup', async (req, res) => {
  try {
    const parsed = signupSchema.parse(req.body)
    const { name, email, password } = parsed
    const conn = await pool.getConnection()
    try {
      const [rows] = await conn.query('SELECT id FROM users WHERE email = ?', [email])
      if (Array.isArray(rows) && rows.length > 0) {
        return res.status(409).json({ error: 'Email already registered' })
      }
      const hashed = await bcrypt.hash(password, 10)
      const role = email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user'
      await conn.query('INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)', [
        name,
        email,
        hashed,
        role,
      ])
      res.status(201).json({ message: 'User created' })
    } finally {
      conn.release()
    }
  } catch (err) {
    const message = err?.errors?.[0]?.message || 'Signup failed'
    res.status(400).json({ error: message })
  }
})

app.post('/auth/login', async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body)
    const { email, password } = parsed
    const conn = await pool.getConnection()
    try {
      const [rows] = await conn.query(
        'SELECT id, name, email, password, role FROM users WHERE email = ?',
        [email]
      )
      const user = Array.isArray(rows) ? rows[0] : null
      if (!user) return res.status(401).json({ error: 'Invalid credentials' })

      const match = await bcrypt.compare(password, user.password)
      if (!match) return res.status(401).json({ error: 'Invalid credentials' })

      const role = user.email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user'
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role } })
    } finally {
      conn.release()
    }
  } catch (err) {
    const message = err?.errors?.[0]?.message || 'Login failed'
    res.status(400).json({ error: message })
  }
})

app.post('/api/messages', async (req, res) => {
  try {
    const parsed = messageSchema.parse(req.body)
    const { name, email, subject, message } = parsed
    const conn = await pool.getConnection()
    try {
      await conn.query('INSERT INTO messages (name, email, subject, message) VALUES (?,?,?,?)', [
        name,
        email,
        subject || null,
        message,
      ])
      res.status(201).json({ message: 'Message stored' })
    } finally {
      conn.release()
    }
  } catch (err) {
    const message = err?.errors?.[0]?.message || 'Failed to save message'
    res.status(400).json({ error: message })
  }
})

app.get('/api/messages', authMiddleware, adminMiddleware, async (_req, res) => {
  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query(
      'SELECT id, name, email, subject, message, status, created_at FROM messages ORDER BY created_at DESC'
    )
    res.json(rows || [])
  } catch (_err) {
    res.status(500).json({ error: 'Failed to fetch messages' })
  } finally {
    conn.release()
  }
})

app.patch('/api/messages/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = statusSchema.parse(req.body)
    const id = Number(req.params.id)
    if (!id) return res.status(400).json({ error: 'Invalid id' })

    const conn = await pool.getConnection()
    try {
      const [result] = await conn.query('UPDATE messages SET status = ? WHERE id = ?', [status, id])
      if (result?.affectedRows === 0) return res.status(404).json({ error: 'Message not found' })
      res.json({ message: 'Status updated' })
    } finally {
      conn.release()
    }
  } catch (err) {
    const message = err?.errors?.[0]?.message || 'Failed to update status'
    res.status(400).json({ error: message })
  }
})

app.delete('/api/messages/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const id = Number(req.params.id)
  if (!id) return res.status(400).json({ error: 'Invalid id' })

  const conn = await pool.getConnection()
  try {
    const [result] = await conn.query('DELETE FROM messages WHERE id = ?', [id])
    if (result?.affectedRows === 0) return res.status(404).json({ error: 'Message not found' })
    res.json({ message: 'Message deleted' })
  } catch (_err) {
    res.status(500).json({ error: 'Failed to delete message' })
  } finally {
    conn.release()
  }
})

// === Start ===
initSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err)
    process.exit(1)
  })
