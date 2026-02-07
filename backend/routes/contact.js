import express from 'express'
import nodemailer from 'nodemailer'

const router = express.Router()

const sanitizeHeaderValue = (value) => {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim()
}

const isValidEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

const createTransporter = () => {
  const smtpUrl = process.env.SMTP_URL
  if (smtpUrl) {
    return nodemailer.createTransport(smtpUrl)
  }

  const service = process.env.SMTP_SERVICE
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (service && user && pass) {
    return nodemailer.createTransport({
      service,
      auth: { user, pass },
    })
  }

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true'
  const fallbackUser = process.env.SMTP_USER
  const fallbackPass = process.env.SMTP_PASS

  if (!host || !fallbackUser || !fallbackPass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user: fallbackUser, pass: fallbackPass },
  })
}

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body || {}

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' })
    }

    const transporter = createTransporter()
    if (!transporter) {
      return res.status(500).json({ error: 'Email service is not configured.' })
    }

    const to = process.env.CONTACT_TO || 'Vitalandgreengroup@gmail.com'
    const from = process.env.SMTP_FROM || process.env.SMTP_USER
    if (!from) {
      return res.status(500).json({ error: 'Email sender is not configured.' })
    }

    const safeName = sanitizeHeaderValue(name)
    const safeEmail = sanitizeHeaderValue(email)
    const subject = sanitizeHeaderValue(`New contact message from ${safeName}`)

    await transporter.sendMail({
      to,
      from,
      replyTo: safeEmail,
      subject,
      text: `Name: ${safeName}\nEmail: ${safeEmail}\n\n${message}`,
    })

    return res.json({ status: 'ok' })
  } catch (error) {
    console.error('Contact form error:', error)
    return res.status(500).json({ error: 'Failed to send message.' })
  }
})

export default router
