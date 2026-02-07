import { useState } from "react"
import Navbar from "../components/Navbar"
import { motion } from "framer-motion" // eslint-disable-line no-unused-vars
import { contactAPI } from "../services/api"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: null, message: "" })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: null, message: "" })
    setIsSubmitting(true)
    try {
      await contactAPI.send(formData)
      setFormData({ name: "", email: "", message: "" })
      setStatus({
        type: "success",
        message: "Thank you for your message! We'll get back to you soon.",
      })
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Sorry, we couldn't send your message.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="bg-light text-dark">
      <Navbar />
      
      <section className="pt-24 px-6 max-w-4xl mx-auto pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-600 mb-12">
            Have questions? We'd love to hear from you. Get in touch with our team.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="text-gray-700">Vitalandgreengroup@gmail.com</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Phone</h3>
                <p className="text-gray-700">
                    0558191354<br/>
                    0206091618
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Address</h3>
                <p className="text-gray-700">
                  Ablekuma,
                  Accra<br />
                </p>
              </div>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {status.type && (
              <div
                className={`rounded-lg px-4 py-3 text-sm ${
                  status.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {status.message}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-none"
                placeholder="Your message..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-gold transition disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </motion.form>
        </div>
      </section>
    </main>
  )
}

export default Contact
