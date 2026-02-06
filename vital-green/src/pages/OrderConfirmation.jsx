import { useLocation, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { motion } from "framer-motion" // eslint-disable-line no-unused-vars

const OrderConfirmation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const order = location.state?.order
  const paymentUrl = location.state?.paymentUrl

  if (!order) {
    return (
      <main className="bg-light text-dark min-h-screen">
        <Navbar />
        <section className="pt-24 px-6 max-w-4xl mx-auto pb-20 text-center">
          <h1 className="text-4xl font-bold mb-4">No Order Found</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-white px-8 py-3 rounded-full hover:bg-gold transition"
          >
            Back to Home
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="bg-light text-dark min-h-screen">
      <Navbar />
      
      <section className="pt-24 px-6 max-w-4xl mx-auto pb-20">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-6">✓</div>
          <h1 className="text-4xl font-bold mb-4 text-green-600">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">
            Thank you for your purchase. Your order is being processed.
          </p>
          {paymentUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Complete your payment in the new tab.</p>
              <button
                onClick={() => window.open(paymentUrl, "_blank", "noopener,noreferrer")}
                className="mt-3 bg-primary text-white px-6 py-2 rounded-full hover:bg-gold transition"
              >
                Open Payment Link
              </button>
            </div>
          )}
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-8 shadow mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b">
            <div>
              <h2 className="font-bold text-lg mb-4">Order Details</h2>
              <div className="space-y-2">
                <p><span className="text-gray-600">Order Number:</span> <span className="font-bold">#{order.orderNumber}</span></p>
                <p><span className="text-gray-600">Order Date:</span> {order.date}</p>
                <p><span className="text-gray-600">Status:</span> <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Confirmed</span></p>
              </div>
            </div>

            <div>
              <h2 className="font-bold text-lg mb-4">Shipping To</h2>
              <div className="space-y-1 text-gray-700">
                <p className="font-semibold">{order.customer.name}</p>
                <p>{order.customer.address}</p>
                <p>{order.customer.email}</p>
                <p>{order.customer.phone}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-bold text-lg mb-4">Items Ordered</h2>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}{item.sizeLabel ? ` (${item.sizeLabel})` : ''}</p>
                  </div>
                  <p className="font-semibold">GHS {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary bg-opacity-10 rounded-lg p-6 border-l-4 border-primary">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-semibold">GHS {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Tax:</span>
                <span className="font-semibold">GHS {order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Shipping:</span>
                <span className="font-semibold">
                  {order.shipping === 0 ? "Free" : `GHS ${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="font-bold text-lg">Total:</span>
                <span className="text-2xl font-bold text-primary">GHS {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/products")}
              className="bg-primary text-white px-8 py-3 rounded-full hover:bg-gold transition"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/")}
              className="border border-primary text-primary px-8 py-3 rounded-full hover:bg-primary hover:text-white transition"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  )
}

export default OrderConfirmation
