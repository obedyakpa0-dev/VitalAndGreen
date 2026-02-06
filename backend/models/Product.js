import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  sizes: [
    {
      label: {
        type: String,
        trim: true
      },
      price: {
        type: Number,
        min: 0
      }
    }
  ],
  category: {
    type: String,
    enum: ['juice', 'smoothie', 'blend'],
    default: 'juice'
  },
  image: String,
  stock: {
    type: Number,
    default: 100,
    min: 0
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5
  },
  reviews: [
    {
      user: String,
      comment: String,
      rating: Number,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Product', productSchema)
