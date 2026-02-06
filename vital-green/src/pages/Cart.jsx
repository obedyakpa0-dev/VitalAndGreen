import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { CartContext } from "../context/CartContextValue"
import { motion } from "framer-motion" // eslint-disable-line no-unused-vars

const Cart = () => {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext) || {
    cart: [],
    removeFromCart: () => {},
    updateQuantity: () => {},
    clearCart: () => {}
  }

  const total = cart && cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
  const itemCount = cart && cart.reduce((sum, item) => sum + (item.quantity || 1), 0)

  return (
    <main className="bg-light text-dark min-h-screen">
      <Navbar />
      
      <section className="pt-24 px-6 max-w-4xl mx-auto pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Shopping Cart</h1>
            {itemCount > 0 && (
              <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
                {itemCount} item{itemCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </motion.div>

        {cart && cart.length > 0 ? (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {cart.map((item) => (
              <div
                key={item.cartKey || item.id}
                className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600 mt-2">
                      GHS {item.price.toFixed(2)} each
                      {item.sizeLabel ? <span className="text-xs text-gray-500"> ({item.sizeLabel})</span> : null}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary mb-4">
                      GHS {(item.price * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-2">
                    <button
                      onClick={() => updateQuantity(item.cartKey || item.id, (item.quantity || 1) - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-300 transition rounded"
                    >
                      −
                    </button>
                    <span className="font-semibold w-8 text-center">{item.quantity || 1}</span>
                    <button
                      onClick={() => updateQuantity(item.cartKey || item.id, (item.quantity || 1) + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-300 transition rounded"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartKey || item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-primary bg-opacity-10 rounded-lg p-6 border-t-4 border-primary">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold">GHS {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Shipping:</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary">GHS {total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate("/checkout")}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-gold transition mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={clearCart}
                className="w-full border border-primary text-primary py-2 rounded-lg font-semibold hover:bg-primary hover:text-white transition"
              >
                Clear Cart
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-2xl text-gray-600 mb-8">Your cart is empty</p>
            <Link
              to="/products"
              className="bg-primary text-white px-8 py-3 rounded-full hover:bg-gold transition inline-block"
            >
              Continue Shopping
            </Link>
          </motion.div>
        )}
      </section>
    </main>
  )
}

export default Cart
