import express from 'express'
import path from 'path'
import multer from 'multer'
import Product from '../models/Product.js'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public/images/products'))
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now()
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    cb(null, `${timestamp}-${safeName}`)
  }
})

const upload = multer({ storage })

const router = express.Router()

// Get all products
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Product.countDocuments()

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Search products
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query

    if (!query) {
      return res.status(400).json({ error: 'Search query required' })
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    })

    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create product (admin only)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, stock, sizes } = req.body
    const imagePath = req.file ? `/images/products/${req.file.filename}` : req.body.image

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      image: imagePath,
      sizes: sizes ? JSON.parse(sizes) : undefined
    })

    await product.save()
    res.status(201).json(product)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Update product (admin only)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body, updatedAt: Date.now() }
    if (req.file) {
      updates.image = `/images/products/${req.file.filename}`
    }
    if (updates.sizes && typeof updates.sizes === 'string') {
      updates.sizes = JSON.parse(updates.sizes)
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json(product)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete product (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add review to product
router.post('/:id/reviews', async (req, res) => {
  try {
    const { user, comment, rating } = req.body

    const product = await Product.findById(req.params.id)
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    product.reviews.push({
      user,
      comment,
      rating,
      date: Date.now()
    })

    await product.save()
    res.json(product)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default router
