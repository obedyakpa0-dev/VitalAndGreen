import { useState } from "react"
import { Link } from "react-router-dom"
import logo from "../assets/images/logo.jpeg"

const Navbar = () => {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <img src={logo} alt="Vital & Green" className="h-10 w-auto rounded" />
          <span className="text-lg font-bold">
            <span className="text-primary">V</span>
            <span className="text-black">ital</span>
            <span className="text-black"> & </span> 
            <span className="text-black">Green</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 font-medium">
          <li>
            <Link to="/" className="hover:text-primary transition inline-flex items-center gap-2">
              <i className="fa-solid fa-house" aria-hidden="true"></i>
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" className="hover:text-primary transition inline-flex items-center gap-2">
              <i className="fa-solid fa-bottle-water" aria-hidden="true"></i>
              Products
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-primary transition inline-flex items-center gap-2">
              <i className="fa-solid fa-leaf" aria-hidden="true"></i>
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-primary transition inline-flex items-center gap-2">
              <i className="fa-solid fa-envelope" aria-hidden="true"></i>
              Contact
            </Link>
          </li>
        </ul>

        {/* Cart */}
        <div className="hidden md:block">
          <Link to="/cart" className="bg-primary text-white px-4 py-2 rounded-full hover:bg-gold transition inline-flex items-center gap-2">
            <i className="fa-solid fa-cart-shopping" aria-hidden="true"></i>
            Cart
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white px-6 py-4 space-y-4 shadow">
          <Link to="/" className="block hover:text-primary transition">
            <span className="inline-flex items-center gap-2">
              <i className="fa-solid fa-house" aria-hidden="true"></i>
              Home
            </span>
          </Link>
          <Link to="/products" className="block hover:text-primary transition">
            <span className="inline-flex items-center gap-2">
              <i className="fa-solid fa-bottle-water" aria-hidden="true"></i>
              Products
            </span>
          </Link>
          <Link to="/about" className="block hover:text-primary transition">
            <span className="inline-flex items-center gap-2">
              <i className="fa-solid fa-leaf" aria-hidden="true"></i>
              About
            </span>
          </Link>
          <Link to="/contact" className="block hover:text-primary transition">
            <span className="inline-flex items-center gap-2">
              <i className="fa-solid fa-envelope" aria-hidden="true"></i>
              Contact
            </span>
          </Link>
          <Link to="/cart" className="bg-primary text-white w-full py-2 rounded-full block text-center hover:bg-gold transition">
            <span className="inline-flex items-center gap-2 justify-center">
              <i className="fa-solid fa-cart-shopping" aria-hidden="true"></i>
              Cart
            </span>
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar
