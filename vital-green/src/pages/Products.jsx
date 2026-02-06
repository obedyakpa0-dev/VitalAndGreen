import { useContext, useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import { CartContext } from "../context/CartContextValue"
import { motion } from "framer-motion" // eslint-disable-line no-unused-vars
import { productsAPI } from "../services/api"
import { productsCatalog } from "../data/products"
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://vitalandgreen.onrender.com/api"
const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "")

const resolveProductImage = (product) => {
  if (!product?.image) return null
  if (product.image.startsWith("http://") || product.image.startsWith("https://")) {
    return product.image
  }
  if (product.image.startsWith("/")) {
    return `${ASSET_BASE_URL}${product.image}`
  }
  const filename = product.image.split("/").pop().trim()
  return `${ASSET_BASE_URL}/images/products/${filename}`
}

const Products = () => {
  const { addToCart } = useContext(CartContext) || {}
  const [addedItem, setAddedItem] = useState(null)
  const [products, setProducts] = useState(productsCatalog)
  const [loading, setLoading] = useState(true)
  const [selectedSizes, setSelectedSizes] = useState({})

  const dedupeByName = (list) => {
    const seen = new Set()
    return list.filter((item) => {
      const key = (item.name || "").trim().toLowerCase()
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await productsAPI.getAll()
        console.log("API Response:", data) // Debug log
        const productsArray = data.products || data || []
        const nextProducts = Array.isArray(productsArray) ? productsArray : []
        const cleaned = dedupeByName(nextProducts)
        setProducts(cleaned.length > 0 ? cleaned : productsCatalog)
      } catch (err) {
        console.error("Failed to fetch products:", err)
        setProducts(dedupeByName(productsCatalog))
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (product) => {
    const productKey = product.id || product._id
    const sizes = product.sizes || []
    const chosenLabel = selectedSizes[productKey]
    if (sizes.length > 0 && !chosenLabel) {
      return
    }
    const fallbackLabel = sizes[0] ? sizes[0].label : "350ml"
    const finalLabel = chosenLabel || fallbackLabel
    const chosen = sizes.find((s) => s.label === finalLabel) || sizes[0]
    const price = chosen?.price ?? product.price
    addToCart && addToCart({ ...product, price, sizeLabel: finalLabel })
    setAddedItem(`${productKey}-${finalLabel}`)
    setTimeout(() => setAddedItem(null), 1500)
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
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-gray-600 mb-12">
            Explore our complete range of fresh, cold-pressed juices
          </p>
        </motion.div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-gray-600 mt-4">Loading products...</p>
          </div>
        )}

        {products.length > 0 && (
        <motion.div
          className="grid md:grid-cols-3 gap-8 pb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id || product._id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
                {resolveProductImage(product) && (
                  <img src={resolveProductImage(product)} alt={product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl">{product.name}</h3>
                <p className="text-gray-600 text-sm mt-2">{product.description}</p>
                
                <div className="flex justify-between items-center mt-6">
                  {product.sizes && product.sizes.length > 0 ? (
                    <div className="text-primary font-bold">
                      <div>GHS {product.sizes[0].price.toFixed(2)} <span className="text-xs text-gray-500">({product.sizes[0].label})</span></div>
                      <div>GHS {product.sizes[1].price.toFixed(2)} <span className="text-xs text-gray-500">({product.sizes[1].label})</span></div>
                    </div>
                  ) : (
                    <span className="font-bold text-primary text-lg">GHS {product.price.toFixed(2)}</span>
                  )}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.sizes && product.sizes.length > 0 && !selectedSizes[product.id || product._id]}
                    className={`text-white px-4 py-2 rounded-full transition ${
                      addedItem === `${(product.id || product._id)}-${selectedSizes[(product.id || product._id)] || ""}`
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-primary hover:bg-gold'
                    }`}
                  >
                    {addedItem === `${(product.id || product._id)}-${selectedSizes[(product.id || product._id)] || ""}` ? (
                      <span className="inline-flex items-center gap-2">
                        <i className="fa-solid fa-check" aria-hidden="true"></i>
                        Added
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <i className="fa-solid fa-cart-plus" aria-hidden="true"></i>
                        Add
                      </span>
                    )}
                  </button>
                </div>
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-3">
                    <label className="block text-xs text-gray-500 mb-1">Select size</label>
                    <select
                      value={selectedSizes[product.id || product._id] || ""}
                      onChange={(e) => setSelectedSizes((prev) => ({ ...prev, [product.id || product._id]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="" disabled>
                        Choose size
                      </option>
                      {product.sizes.map((size) => (
                        <option key={size.label} value={size.label}>
                          {size.label} - GHS {size.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
        )}
      </section>
    </main>
  )
}

export default Products
