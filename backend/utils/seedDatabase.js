import fs from 'fs'
import path from 'path'
import Product from '../models/Product.js'

const sharedPath = path.join(process.cwd(), '..', 'vital-green', 'src', 'data', 'products.json')
const sharedProducts = JSON.parse(fs.readFileSync(sharedPath, 'utf-8'))

const sampleProducts = sharedProducts.map((product) => ({
  name: product.name,
  description: product.description,
  price: product.price,
  sizes: product.sizes,
  category: product.category,
  stock: 100,
  rating: 5,
  image: product.image
}))

export const initializeProducts = async () => {
  try {
    const existingProducts = await Product.countDocuments()

    if (existingProducts === 0) {
      await Product.insertMany(sampleProducts)
      console.log('✓ Sample products initialized')
    } else {
      const upserts = sampleProducts.map((product) =>
        Product.updateOne(
          { name: product.name },
          {
            $set: {
              description: product.description,
              price: product.price,
              sizes: product.sizes,
              category: product.category,
              stock: product.stock,
              rating: product.rating,
              image: product.image,
              updatedAt: Date.now()
            },
            $setOnInsert: {
              name: product.name,
              createdAt: Date.now()
            }
          },
          { upsert: true }
        )
      )
      await Promise.all(upserts)
      console.log(`✓ Database already has ${existingProducts} products`)
    }
  } catch (error) {
    console.error('✗ Error initializing products:', error.message)
  }
}
