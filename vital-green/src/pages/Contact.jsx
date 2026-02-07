import Navbar from "../components/Navbar"
import { motion } from "framer-motion" // eslint-disable-line no-unused-vars

const Contact = () => {
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
                <p className="text-gray-700">
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=vitalandgreengroup@gmail.com&su=Hello&body=Hi there!"
                    className="hover: text-green-500"
                  >
                    Vitalandgreengroup@gmail.com
                  </a>
                  </p>
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

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-2xl font-bold mb-3">Send Us an Email</h2>
              <p className="text-gray-600 mb-6">
                Tap the button below to open your email app and write directly to us.
              </p>
              <a
                href="mailto:Vitalandgreengroup@gmail.com?subject=Hello%20Vital%20and%20Green"
                className="w-full inline-flex justify-center bg-primary text-white py-3 rounded-lg font-bold hover:bg-gold transition"
              >
                Compose Email
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

export default Contact
