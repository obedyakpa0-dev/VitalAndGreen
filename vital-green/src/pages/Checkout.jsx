import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { CartContext } from "../context/CartContextValue"
import { paymentAPI } from "../services/api"
import { motion } from "framer-motion" // eslint-disable-line no-unused-vars

const Checkout = () => {
  const navigate = useNavigate()
  const { cart } = useContext(CartContext) || { cart: [] }
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: ""
  })

  const [loading, setLoading] = useState(false)

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
  const discountRate = 0.2
  const discount = subtotal * discountRate
  const discountedSubtotal = subtotal - discount
  const tax = discountedSubtotal * 0.08
  const now = new Date()
  const promoStart = new Date(2026, 1, 10, 0, 0, 0, 0)
  const promoEnd = new Date(2026, 1, 20, 23, 59, 59, 999)
  const isPromoWindow = now >= promoStart && now <= promoEnd
  const freeDeliveryThreshold = 300
  const qualifiesForFreeDelivery = isPromoWindow && subtotal >= freeDeliveryThreshold
  const shipping = qualifiesForFreeDelivery ? 0 : 10
  const grandTotal = discountedSubtotal + tax + shipping

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert("Please fill in all personal information")
      return false
    }
    if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
      alert("Please fill in complete shipping address")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          sizeLabel: item.sizeLabel
        })),
        subtotal,
        discount,
        discountRate,
        tax,
        shipping,
        total: grandTotal,
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        }
      }

      const response = await paymentAPI.initialize(payload)
      if (response?.checkoutUrl) {
        window.location.href = response.checkoutUrl
        return
      }

      if (response?.reference) {
        navigate(`/order-confirmation?reference=${encodeURIComponent(response.reference)}`)
        return
      }

      throw new Error("Payment initialization failed. No checkout URL returned.")
    } catch (error) {
      console.error("Payment initialization failed:", error)
      alert(error.message || "Payment initialization failed. Please try again.")
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <main className="bg-light text-dark min-h-screen">
        <Navbar />
        <section className="pt-24 px-6 max-w-4xl mx-auto pb-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add items before checking out</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-primary text-white px-8 py-3 rounded-full hover:bg-gold transition"
          >
            Continue Shopping
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="bg-light text-dark min-h-screen">
      <Navbar />
      
      <section className="pt-24 px-6 max-w-6xl mx-auto pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-12">Checkout</h1>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Payment Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="md:col-span-2 space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Personal Information */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-2xl font-bold mb-6">Address</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State/Province"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP/Postal Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-lg font-bold hover:bg-gold transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? "Processing Payment..." : `Pay GHS ${grandTotal.toFixed(2)}`}
            </button>
            <p className="text-xs text-gray-500 text-center">
              Payments are processed securely.
            </p>
          </motion.form>

          {/* Order Summary */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg p-6 shadow sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.cartKey || item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-600">
                        Qty: {item.quantity || 1}
                        {item.sizeLabel ? <span className="text-xs text-gray-500"> ({item.sizeLabel})</span> : null}
                      </p>
                    </div>
                    <p className="font-semibold">
                      GHS {(item.price * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold">GHS {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Website discount (20%):</span>
                  <span className="font-semibold text-green-700">-GHS {discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Tax (8%):</span>
                  <span className="font-semibold">GHS {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Shipping:</span>
                  <span className="font-semibold">
                    {shipping === 0 ? "Free" : `GHS ${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="font-bold">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    GHS {grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded text-sm text-green-800">
                {qualifiesForFreeDelivery
                  ? "Free delivery applied for orders over GHS 300 (Feb 10-20, 2026)."
                  : "Free delivery for orders over GHS 300 from Feb 10-20, 2026."}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

export default Checkout
