import express from 'express'
import https from 'https'

const router = express.Router()

const sanitizeHeaderValue = (value) => {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim()
}

const isValidEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

const sendResendEmail = ({ apiKey, payload }) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload)
    const request = https.request(
      {
        hostname: 'api.resend.com',
        path: '/emails',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (response) => {
        let body = ''
        response.on('data', (chunk) => {
          body += chunk
        })
        response.on('end', () => {
          const status = response.statusCode || 500
          if (status >= 200 && status < 300) {
            try {
              resolve(body ? JSON.parse(body) : {})
            } catch {
              resolve({})
            }
            return
          }

          let message = `Resend API error (${status}).`
          try {
            const parsed = body ? JSON.parse(body) : null
            if (parsed?.message) {
              message = parsed.message
            }
          } catch {
            // Ignore JSON parse errors and keep fallback message.
          }
          const error = new Error(message)
          error.status = status
          error.body = body
          reject(error)
        })
      }
    )

    request.on('error', reject)
    request.write(data)
    request.end()
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

    const to = process.env.CONTACT_TO || 'Vitalandgreengroup@gmail.com'
    const fromAddress = process.env.RESEND_FROM
    if (!fromAddress) {
      return res.status(500).json({ error: 'Email sender is not configured.' })
    }

    const safeName = sanitizeHeaderValue(name)
    const safeEmail = sanitizeHeaderValue(email)
    const subject = sanitizeHeaderValue(`New contact message from ${safeName}`)

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'Email service is not configured.' })
    }

    const from = sanitizeHeaderValue(`${safeName} <${fromAddress}>`)
    if (!from) {
      return res.status(500).json({ error: 'Email sender is not configured.' })
    }

    await sendResendEmail({
      apiKey,
      payload: {
        to,
        from,
        reply_to: safeEmail,
        subject,
        text: `Name: ${safeName}\nEmail: ${safeEmail}\n\n${message}`,
      },
    })

    return res.json({ status: 'ok' })
  } catch (error) {
    console.error('Contact form error:', error)
    return res.status(500).json({ error: 'Failed to send message.' })
  }
})

export default router
