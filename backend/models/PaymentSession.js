import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    price: Number,
    quantity: Number,
    sizeLabel: String
  },
  { _id: false }
)

const paymentSessionSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'GHS'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  checkoutUrl: String,
  customer: {
    name: String,
    email: String,
    phone: String
  },
  items: [itemSchema],
  subtotal: Number,
  discount: Number,
  discountRate: Number,
  tax: Number,
  shipping: Number,
  total: Number,
  shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  providerPayload: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('PaymentSession', paymentSessionSchema)
