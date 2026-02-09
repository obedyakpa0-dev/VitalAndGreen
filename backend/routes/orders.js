import express from 'express'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { orderLimiter } from '../middleware/rateLimiters.js'

const router = express.Router()

// Create order
router.post('/', orderLimiter, async (req, res) => {
  try {
    const { items, shippingAddress, total, subtotal, tax, shipping } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    // Validate stock for each item
    for (const item of items) {
      const product = await Product.findById(item.productId)
      
      if (!product) {
        return res.status(404).json({ error: `Product ${item.name} not found` })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${item.name}` })
      }
    }

    const orderNumber = `ORD-${Date.now()}`

    const order = new Order({
      orderNumber,
      items,
      shippingAddress,
      subtotal,
      tax,
      shipping,
      total,
      status: 'pending',
      paymentStatus: 'pending'
    })

    await order.save()

    // Reduce stock for each item
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      )
    }

    res.status(201).json(order)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Get all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.productId')
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId')

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get order by order number
router.get('/number/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('items.productId')

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update order status
router.put('/:id', async (req, res) => {
  try {
    const { status, paymentStatus } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Cancel order
router.post('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ error: 'Cannot cancel delivered order' })
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      )
    }

    order.status = 'cancelled'
    order.paymentStatus = 'refunded'
    await order.save()

    res.json(order)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default router
