const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const { createPool } = require("mysql2/promise")
const { z } = require("zod")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

dotenv.config()

const app = express()
const port = process.env.PORT || 4000
const jwtSecret = process.env.JWT_SECRET || 'change_this_later'

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.replace('Bearer ', '').trim()
    : null

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, jwtSecret)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

app.get('/health', async (_req, res) => {
  try {
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()
    res.json({ ok: true })
  } catch (error) {
    console.error('Health check failed', error)
    res.status(500).json({ ok: false, error: 'Database connection failed' })
  }
})

const messageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
})

const statusSchema = z.object({
  status: z.enum(['new', 'read']),
})

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
})

app.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = signupSchema.parse(req.body)

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [
      email,
    ])

    if (Array.isArray(existing) && existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )

    res.status(201).json({ message: 'Signup successful', userId: result.insertId })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors })
    }

    if (error?.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' })
    }

    console.error('Signup error', error)
    res.status(500).json({ error: 'Database error during signup' })
  }
})

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    const [users] = await pool.query(
      'SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1',
      [email]
    )

    const user = Array.isArray(users) ? users[0] : null

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      jwtSecret,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors })
    }

    console.error('Login error', error)
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, subject, message } = messageSchema.parse(req.body)

    const [result] = await pool.query(
      'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    )

    res.status(201).json({ id: result.insertId })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors })
    }

    console.error('Error creating message', error)
    res.status(500).json({ error: 'Database error' })
  }
})

app.get('/api/messages', authenticate, async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC')
    res.json(rows)
  } catch (error) {
    console.error('Error fetching messages', error)
    res.status(500).json({ error: 'Database error' })
  }
})

app.patch('/api/messages/:id', authenticate, async (req, res) => {
  const id = Number(req.params.id)

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid message id' })
  }

  try {
    const { status } = statusSchema.parse(req.body)

    const [result] = await pool.query('UPDATE messages SET status = ? WHERE id = ?', [
      status,
      id,
    ])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found' })
    }

    res.json({ id, status })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors })
    }

    console.error('Error updating message', error)
    res.status(500).json({ error: 'Database error' })
  }
})

app.delete('/api/messages/:id', authenticate, async (req, res) => {
  const id = Number(req.params.id)

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid message id' })
  }

  try {
    const [result] = await pool.query('DELETE FROM messages WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found' })
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting message', error)
    res.status(500).json({ error: 'Database error' })
  }
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`)
})
