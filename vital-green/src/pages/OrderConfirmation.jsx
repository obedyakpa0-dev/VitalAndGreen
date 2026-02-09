import { useContext, useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { CartContext } from "../context/CartContextValue"
import { paymentAPI } from "../services/api"
import { motion } from "framer-motion" // eslint-disable-line no-unused-vars

const OrderConfirmation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { clearCart } = useContext(CartContext) || {}
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState("checking")
  const [error, setError] = useState("")

  const reference = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return (
      params.get("reference") ||
      params.get("tx_ref") ||
      params.get("transaction_reference") ||
      params.get("payment_reference") ||
      location.state?.reference
    )
  }, [location.search, location.state])

  const verifyPayment = async () => {
    if (!reference) {
      setStatus("missing")
      return
    }

    try {
      setStatus("checking")
      setError("")
      const result = await paymentAPI.verify(reference)
      if (result?.status === "success" && result?.order) {
        setOrder(result.order)
        setStatus("success")
        clearCart && clearCart()
        return
      }
      if (result?.status === "pending") {
        setStatus("pending")
        return
      }
      setStatus("failed")
    } catch (err) {
      setError(err.message || "Unable to verify payment.")
      setStatus("error")
    }
  }

  useEffect(() => {
    verifyPayment()
  }, [reference])

  const discount = Number(order?.discount || 0)
  const shipping = order?.shippingAddress || {}
  const customerName = [shipping.firstName, shipping.lastName].filter(Boolean).join(" ")
  const addressLine = shipping.street || shipping.address || ""
  const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleString() : ""

  if (status !== "success") {
    return (
      <main className="bg-light text-dark min-h-screen">
        <Navbar />
        <section className="pt-24 px-6 max-w-4xl mx-auto pb-20 text-center">
          {status === "checking" && (
            <>
              <h1 className="text-3xl font-bold mb-4">Verifying Payment...</h1>
              <p className="text-gray-600">Please wait while we confirm your payment.</p>
            </>
          )}
          {status === "pending" && (
            <>
              <h1 className="text-3xl font-bold mb-4">Payment Pending</h1>
              <p className="text-gray-600 mb-6">We have not received confirmation yet.</p>
              <button
                onClick={verifyPayment}
                className="bg-primary text-white px-8 py-3 rounded-full hover:bg-gold transition"
              >
                Check Again
              </button>
            </>
          )}
          {status === "failed" && (
            <>
              <h1 className="text-3xl font-bold mb-4">Payment Not Confirmed</h1>
              <p className="text-gray-600 mb-6">Your payment was not completed.</p>
              <button
                onClick={() => navigate("/checkout")}
                className="bg-primary text-white px-8 py-3 rounded-full hover:bg-gold transition"
              >
                Back to Checkout
              </button>
            </>
          )}
          {status === "missing" && (
            <>
              <h1 className="text-3xl font-bold mb-4">Missing Payment Reference</h1>
              <p className="text-gray-600 mb-6">Please return to checkout and complete payment.</p>
              <button
                onClick={() => navigate("/checkout")}
                className="bg-primary text-white px-8 py-3 rounded-full hover:bg-gold transition"
              >
                Back to Checkout
              </button>
            </>
          )}
          {status === "error" && (
            <>
              <h1 className="text-3xl font-bold mb-4">Unable to Verify Payment</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={verifyPayment}
                className="bg-primary text-white px-8 py-3 rounded-full hover:bg-gold transition"
              >
                Try Again
              </button>
            </>
          )}
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
          <div className="text-6xl mb-6">OK</div>
          <h1 className="text-4xl font-bold mb-4 text-green-600">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">
            Thank you for your purchase. Your order is being processed.
          </p>
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
                <p><span className="text-gray-600">Order Date:</span> {orderDate}</p>
                <p><span className="text-gray-600">Status:</span> <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Confirmed</span></p>
              </div>
            </div>

            <div>
              <h2 className="font-bold text-lg mb-4">Shipping To</h2>
              <div className="space-y-1 text-gray-700">
                <p className="font-semibold">{customerName}</p>
                <p>{addressLine}</p>
                <p>{shipping.email}</p>
                <p>{shipping.phone}</p>
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
                <span className="font-semibold">GHS {(order.subtotal || 0).toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Website discount (20%):</span>
                  <span className="font-semibold text-green-700">-GHS {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-700">Tax:</span>
                <span className="font-semibold">GHS {(order.tax || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Shipping:</span>
                <span className="font-semibold">
                  {order.shipping === 0 ? "Free" : `GHS ${(order.shipping || 0).toFixed(2)}`}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="font-bold text-lg">Total:</span>
                <span className="text-2xl font-bold text-primary">GHS {(order.total || 0).toFixed(2)}</span>
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
