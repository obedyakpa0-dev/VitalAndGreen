import express from 'express'
import crypto from 'crypto'
import mongoose from 'mongoose'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import PaymentSession from '../models/PaymentSession.js'
import { paymentLimiter } from '../middleware/rateLimiters.js'

const router = express.Router()

const KORAPAY_BASE_URL = process.env.KORAPAY_BASE_URL || 'https://api.korapay.com'
const KORAPAY_SECRET_KEY = process.env.KORAPAY_SECRET_KEY
const KORAPAY_REDIRECT_URL = process.env.KORAPAY_REDIRECT_URL
const KORAPAY_NOTIFICATION_URL = process.env.KORAPAY_NOTIFICATION_URL

const createReference = () => {
  const suffix = Math.floor(Math.random() * 1_000_000)
  return `VG-${Date.now()}-${suffix}`
}

const normalizeItems = (items = []) => {
  return items.map((item) => ({
    productId: item.productId || item._id || item.id,
    name: item.name,
    price: Number(item.price || 0),
    quantity: Number(item.quantity || 1),
    sizeLabel: item.sizeLabel
  }))
}

const getPaymentStatus = (payload) => {
  return (
    payload?.data?.status ||
    payload?.data?.transaction_status ||
    payload?.data?.payment_status ||
    payload?.status
  )
}

const finalizeOrderForSession = async (session) => {
  if (session.orderId) {
    return Order.findById(session.orderId)
  }

  for (const item of session.items) {
    const product = await Product.findById(item.productId)
    if (!product) {
      throw new Error(`Product ${item.name || item.productId} not found`)
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${item.name}`)
    }
  }

  const orderNumber = `ORD-${Date.now()}`
  const order = new Order({
    orderNumber,
    items: session.items,
    shippingAddress: session.shippingAddress,
    subtotal: session.subtotal,
    discount: session.discount,
    discountRate: session.discountRate,
    tax: session.tax,
    shipping: session.shipping,
    total: session.total,
    status: 'confirmed',
    paymentStatus: 'completed',
    paymentReference: session.reference,
    updatedAt: Date.now()
  })

  await order.save()

  for (const item of session.items) {
    await Product.findByIdAndUpdate(
      item.productId,
      { $inc: { stock: -item.quantity } }
    )
  }

  session.status = 'paid'
  session.orderId = order._id
  session.updatedAt = Date.now()
  await session.save()

  return order
}

router.post('/initialize', paymentLimiter, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      subtotal,
      discount,
      discountRate,
      tax,
      shipping,
      total,
      customer,
      currency = 'GHS'
    } = req.body || {}

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    if (!total || Number(total) <= 0) {
      return res.status(400).json({ error: 'Total amount is required' })
    }

    if (!KORAPAY_SECRET_KEY) {
      return res.status(500).json({ error: 'Payment service is not configured.' })
    }

    if (!KORAPAY_REDIRECT_URL || !KORAPAY_NOTIFICATION_URL) {
      return res.status(500).json({ error: 'Payment redirect URLs are not configured.' })
    }

    const normalizedItems = normalizeItems(items)
    const invalidItem = normalizedItems.find((item) => {
      return !item.productId || !mongoose.Types.ObjectId.isValid(item.productId)
    })
    if (invalidItem) {
      return res.status(400).json({ error: 'Invalid cart items. Please refresh and try again.' })
    }

    const address = shippingAddress || {}
    const email = customer?.email || address.email
    if (!email) {
      return res.status(400).json({ error: 'Email is required for payment' })
    }
    const session = await PaymentSession.create({
      reference: createReference(),
      amount: Number(total),
      currency,
      customer: {
        name: customer?.name || `${address.firstName || ''} ${address.lastName || ''}`.trim(),
        email,
        phone: customer?.phone || address.phone
      },
      items: normalizedItems,
      subtotal,
      discount,
      discountRate,
      tax,
      shipping,
      total,
      shippingAddress: {
        firstName: address.firstName,
        lastName: address.lastName,
        email: address.email,
        phone: address.phone,
        street: address.street || address.address,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode
      }
    })

    const payload = {
      amount: session.amount,
      currency: session.currency,
      reference: session.reference,
      redirect_url: KORAPAY_REDIRECT_URL,
      notification_url: KORAPAY_NOTIFICATION_URL,
      customer: {
        name: session.customer.name,
        email: session.customer.email,
        phone: session.customer.phone
      },
      metadata: {
        sessionId: session._id.toString()
      }
    }

    const response = await fetch(`${KORAPAY_BASE_URL}/merchant/api/v1/charges/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KORAPAY_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data?.status !== true) {
      session.status = 'failed'
      session.providerPayload = data
      await session.save()
      return res.status(502).json({ error: data?.message || 'Payment initialization failed' })
    }

    session.checkoutUrl = data?.data?.checkout_url
    session.providerPayload = data
    session.updatedAt = Date.now()
    await session.save()

    return res.json({
      reference: session.reference,
      checkoutUrl: session.checkoutUrl
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

router.get('/verify', async (req, res) => {
  try {
    const reference = req.query.reference
    if (!reference) {
      return res.status(400).json({ error: 'Payment reference is required' })
    }

    const session = await PaymentSession.findOne({ reference })
    if (!session) {
      return res.status(404).json({ error: 'Payment session not found' })
    }

    if (!KORAPAY_SECRET_KEY) {
      return res.status(500).json({ error: 'Payment service is not configured.' })
    }

    if (session.status === 'paid' && session.orderId) {
      const existingOrder = await Order.findById(session.orderId)
      return res.json({ status: 'success', order: existingOrder })
    }

    const response = await fetch(`${KORAPAY_BASE_URL}/merchant/api/v1/charges/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${KORAPAY_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json().catch(() => ({}))
    const status = getPaymentStatus(data)

    if (!response.ok || !status) {
      return res.status(502).json({ status: 'error', error: data?.message || 'Unable to verify payment' })
    }

    if (status === 'success') {
      const order = await finalizeOrderForSession(session)
      return res.json({ status: 'success', order })
    }

    if (status === 'failed' || status === 'cancelled' || status === 'abandoned') {
      session.status = 'failed'
      session.providerPayload = data
      session.updatedAt = Date.now()
      await session.save()
      return res.json({ status: 'failed' })
    }

    return res.json({ status: 'pending' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

router.post('/webhook', async (req, res) => {
  try {
    if (!KORAPAY_SECRET_KEY) {
      return res.status(500).json({ error: 'Payment service is not configured.' })
    }

    const signature = req.headers['x-korapay-signature']
    if (!signature || !req.rawBody) {
      return res.status(400).json({ error: 'Missing webhook signature' })
    }

    const computed = crypto
      .createHmac('sha256', KORAPAY_SECRET_KEY)
      .update(req.rawBody)
      .digest('hex')

    if (computed !== signature) {
      return res.status(401).json({ error: 'Invalid webhook signature' })
    }

    const payload = JSON.parse(req.rawBody)
    const event = payload?.event
    const reference = payload?.data?.reference

    if (!reference) {
      return res.json({ received: true })
    }

    const session = await PaymentSession.findOne({ reference })
    if (!session) {
      return res.json({ received: true })
    }

    if (event === 'charge.success') {
      await finalizeOrderForSession(session)
    } else if (event === 'charge.failed') {
      session.status = 'failed'
      session.providerPayload = payload
      session.updatedAt = Date.now()
      await session.save()
    }

    return res.json({ received: true })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

export default router
