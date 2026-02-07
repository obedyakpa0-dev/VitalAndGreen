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
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=vitalandgreengroup@gmail.com&su=Hello&body=Hi there!"
                    className="inline-flex items-center gap-2 hover:text-green-500"
                  >
                    <i className="fa-solid fa-envelope" aria-hidden="true"></i>
                    <span>Vitalandgreengroup@gmail.com</span>
                  </a>
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Phone</h3>
                <p className="text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <i className="fa-solid fa-phone" aria-hidden="true"></i>
                    <span>0558191354</span>
                  </span>
                  <br />
                  <span className="inline-flex items-center gap-2">
                    <i className="fa-solid fa-phone" aria-hidden="true"></i>
                    <span>0206091618</span>
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Address</h3>
                <p className="text-gray-700 inline-flex items-center gap-2">
                  <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                  <span>
                    Ablekuma,
                    Accra
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Social</h3>
                <div className="flex flex-col gap-2 text-gray-700">
                  <a
                    href="https://www.instagram.com/the_vital_and_green_juice?igsh=YmgzNHZrODU2bG0="
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-green-500"
                  >
                    <i className="fa-brands fa-instagram" aria-hidden="true"></i>
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://wa.me/233206091618?text=Hi%20Vital%20Green%2C%20I%20want%20to%20order%20a%20juice"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-green-500"
                  >
                    <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
                    <span>WhatsApp</span>
                  </a>
                </div>
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
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-bold hover:bg-gold transition"
              >
                <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
                <span>Send Us A Message</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

export default Contact
