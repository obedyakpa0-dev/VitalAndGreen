import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import paymentRoutes from './routes/payment.js'
import contactRoutes from './routes/contact.js'
import { initializeProducts } from './utils/seedDatabase.js'
import { apiLimiter } from './middleware/rateLimiters.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const trustProxy = process.env.TRUST_PROXY
  ? Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY === 'true'
  : process.env.NODE_ENV === 'production'
app.set('trust proxy', trustProxy)

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (
      origin.includes("localhost") ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    console.log("Blocked:", origin);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/images', express.static(path.join(__dirname, 'public/images')))
app.use('/api', apiLimiter)

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vital-green')
  .then(async () => {
    console.log('✓ Connected to MongoDB')
    await initializeProducts()
  })
  .catch(err => console.error('✗ MongoDB connection error:', err))

// Routes
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/contact', contactRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`)
})
console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);

export default app
