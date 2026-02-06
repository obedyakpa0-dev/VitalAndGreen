import Navbar from "../components/Navbar"
import { motion } from "framer-motion" // eslint-disable-line no-unused-vars

const About = () => {
  return (
    <main className="bg-light text-dark">
      <Navbar />
      
      <section className="pt-24 px-6 max-w-4xl mx-auto pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4">About Vital & Green</h1>
          <p className="text-xl text-primary font-semibold mb-8">
            Bringing Nature's Energy to Your Glass
          </p>
        </motion.div>

        <motion.div
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              At Vital & Green, we're committed to providing the freshest, most nutritious
              cold-pressed juices to support your health and wellness journey. Every bottle
              is crafted with premium organic fruits, ensuring maximum nutrition and taste.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Why Choose Us</h2>
            <ul className="space-y-3">
              {[
                "100% organic and natural ingredients",
                "Cold-pressed within hours of harvest",
                "No artificial preservatives or added sugars",
                "Eco-friendly and sustainable practices",
                "Supporting local farmers and communities",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-primary font-bold mr-3">✓</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              Founded in 2023, Vital & Green started as a small juice bar with a big dream:
              to make fresh, cold-pressed juices accessible to everyone. Today, we serve
              thousands of customers daily, maintaining our commitment to quality and
              sustainability with every bottle we produce.
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  )
}

export default About
