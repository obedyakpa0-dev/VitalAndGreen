import express from 'express'

const router = express.Router()

// Mock payment initialization (no external provider)
router.post('/initialize', async (req, res) => {
  try {
    const { email, amount } = req.body

    if (!email || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Email and valid amount are required' })
    }

    res.json({
      message: 'Payment initialized (mock)',
      reference: `TEST-${Date.now()}`
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
