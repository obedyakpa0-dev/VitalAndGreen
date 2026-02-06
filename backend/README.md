# Vital Green Backend

Node.js + Express + MongoDB backend for the Vital Green juice e-commerce platform.

## Features

- **Product Management**: CRUD operations for juice products with reviews
- **Order Management**: Complete order lifecycle from creation to delivery
- **Payment Processing**: Paystack integration for secure payments
- **Stock Management**: Automatic stock updates and validation
- **Search & Pagination**: Product search and paginated results

## Installation

1. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

2. Update `.env` with your settings:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vital-green
PAYSTACK_SECRET_KEY=your_paystack_key
```

3. Install dependencies:
```bash
npm install
```

4. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Products
- `GET /api/products` - Get all products (paginated)
- `GET /api/products/:id` - Get single product
- `GET /api/products/search?query=` - Search products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/:id/reviews` - Add review

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/number/:orderNumber` - Get order by number
- `PUT /api/orders/:id` - Update order status
- `POST /api/orders/:id/cancel` - Cancel order

### Payment
- `POST /api/payment/initialize` - Initialize Paystack transaction
- `GET /api/payment/verify/:reference` - Verify Paystack transaction

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `PAYSTACK_SECRET_KEY` - Paystack API secret key
- `CORS_ORIGIN` - Frontend URL for CORS

## Project Structure

```
backend/
├── models/           # Database schemas
│   ├── Product.js
│   └── Order.js
├── routes/           # API routes
│   ├── products.js
│   ├── orders.js
│   └── payment.js
├── server.js         # Main server file
├── package.json
└── .env.example
```

## Database Setup

Make sure MongoDB is running locally or provide a MongoDB Atlas connection string in `.env`.

## Testing

Test endpoints using Postman or curl:

```bash
# Get all products
curl http://localhost:5000/api/products

# Create order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [...],
    "shippingAddress": {...},
    "total": 100
  }'
```

## Notes

- Paystack integration requires valid API keys
- Stock validation happens before order creation
- All timestamps use ISO 8601 format
