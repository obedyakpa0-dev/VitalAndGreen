import { useNavigate } from "react-router-dom"
import heroImg from "../assets/images/hero.jpeg"
import Navbar from "../components/Navbar"
import { motion } from "framer-motion" // eslint-disable-line no-unused-vars

const Home = () => {
  const navigate = useNavigate()

  return (
    <main className="bg-light text-dark min-h-screen" style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}>
      <Navbar />

      {/* HERO */}
      <section className="pt-28 md:pt-36 px-6 md:px-12">
        <div className="relative max-w-6xl mx-auto rounded-[32px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-lime-100 via-white to-gold opacity-90"></div>
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/20 blur-2xl"></div>
          <div className="absolute -bottom-12 right-6 h-48 w-48 rounded-full bg-gold/30 blur-3xl"></div>

          <div className="relative grid md:grid-cols-2 gap-10 items-center p-8 md:p-14">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-primary">
                Cold-pressed - Made fresh daily
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mt-5">
                Cold Pressed,
                <span className="text-primary"> Fresh from nature’s hands</span>.
              </h1>
              <p className="mt-5 text-gray-600 max-w-md">
                Handcrafted blends with no added sugar. Choose your size, fuel your day,
                and taste the difference of real fruit.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/products")}
                  className="bg-primary text-white px-7 py-3 rounded-full hover:bg-gold transition"
                >
                  Shop Juices
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className="border border-gold text-gold px-7 py-3 rounded-full hover:bg-gold hover:text-white transition"
                >
                  Our Story
                </button>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="bg-white/80 px-3 py-1 rounded-full">350ml</span>
                <span className="bg-white/80 px-3 py-1 rounded-full">500ml</span>
                <span className="bg-white/80 px-3 py-1 rounded-full">Fast delivery</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-6 rounded-[36px] bg-white/60 blur-2xl"></div>
                <img
                  src={heroImg}
                  alt="Vital & Green Juice"
                  className="relative w-[280px] md:w-[420px] drop-shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="px-6 md:px-12 mt-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-4 text-center">
          {[
            { label: "100% Natural", icon: "fa-leaf" },
            { label: "Cold-Pressed", icon: "fa-snowflake" },
            { label: "No Sugar Added", icon: "fa-ban" },
            { label: "Energy Boost", icon: "fa-bolt" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition">
              <div className="text-primary text-2xl">
                <i className={`fa-solid ${item.icon}`} aria-hidden="true"></i>
              </div>
              <div className="mt-2 font-semibold">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
              <p className="text-gray-600 mt-2">Fresh, simple, and fast from press to doorstep.</p>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="text-primary font-semibold hover:text-gold transition"
            >
              Browse the menu →
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              { title: "Pick Your Blend", text: "Choose fruits you love and your size." },
              { title: "We Press Fresh", text: "Cold-pressed daily with zero additives." },
              { title: "Delivered Fast", text: "Chilled and sealed to your door." },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow"
              >
                <div className="text-sm text-gold font-bold">Step {index + 1}</div>
                <div className="text-xl font-semibold mt-2">{step.title}</div>
                <p className="text-gray-600 mt-2">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="px-6 md:px-12 pb-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { name: "Obed Y.", quote: "Best juice I've had in Accra. Super fresh and light." },
            { name: "Mavis Y.", quote: "Loved the pineapple and hibiscus combo. Delivery was quick." },
            { name: "Mbakinya A.", quote: "Perfect after workouts. The 500ml size is my go-to." },
          ].map((t) => (
            <div key={t.name} className="bg-muted rounded-2xl p-6 shadow">
              <p className="text-gray-700">"{t.quote}"</p>
              <div className="mt-4 font-semibold text-primary">{t.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 pb-20">
        <div className="max-w-6xl mx-auto bg-primary text-white rounded-3xl p-8 md:p-12 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">Ready for a fresh boost?</h3>
            <p className="text-white/80 mt-2">Order now and taste the difference of real fruit.</p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="bg-white text-primary px-7 py-3 rounded-full font-semibold hover:bg-gold hover:text-white transition"
          >
            Order Now
          </button>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-16 bg-gold/10 text-center px-6">
        <h2 className="text-3xl font-bold">Stay Fresh & Healthy</h2>
        <p className="mt-3 text-gray-600">Weekly health tips and exclusive offers.</p>

        <div className="mt-6 flex justify-center gap-2 flex-wrap">
          <button
            onClick={() => navigate("/contact")}
            className="bg-primary px-6 py-3 rounded-full hover:bg-gold transition text-white"
          >
            Contact Us
          </button>
        </div>
      </section>
    </main>
  )
}

export default Home
