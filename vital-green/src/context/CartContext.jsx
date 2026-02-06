import { useEffect, useState } from "react"
import { CartContext } from "./CartContextValue"

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(
    (JSON.parse(localStorage.getItem("cart")) || []).map((item) => ({
      ...item,
      cartKey: item.cartKey || `${item.id}-${item.sizeLabel || "default"}`
    }))
  )

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (item) => {
    setCart((prevCart) => {
      const cartKey = item.cartKey || `${item.id}-${item.sizeLabel || "default"}`
      const existingItem = prevCart.find((cartItem) => cartItem.cartKey === cartKey)
      
      if (existingItem) {
        // If item exists, increase quantity
        return prevCart.map((cartItem) =>
          cartItem.cartKey === cartKey
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem
        )
      } else {
        // If new item, add with quantity 1
        return [...prevCart, { ...item, cartKey, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (cartKey) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartKey !== cartKey))
  }

  const updateQuantity = (cartKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartKey)
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity } : item
        )
      )
    }
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
