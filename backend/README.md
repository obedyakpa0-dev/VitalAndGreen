# Vital Green Backend

Node.js + Express + MongoDB backend for the Vital Green juice e-commerce platform.

## Features

- **Product Management**: CRUD operations for juice products with reviews
- **Order Management**: Order creation, status updates, and cancellations
- **Stock Management**: Automatic stock updates and validation
- **Payment Initialization**: Mock payment endpoint (no external provider)
- **Contact Form**: Email delivery via Resend
- **Pagination**: Server-side pagination for product listings

## API Endpoints

### Products
- `GET /api/products` - Get all products (paginated)
- `GET /api/products/:id` - Get single product
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
- `POST /api/payment/initialize` - Initialize mock payment

### Contact
- `POST /api/contact` - Send contact form email

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `CORS_ORIGIN` - Frontend URL for CORS
- `RESEND_API_KEY` - Resend API key
- `RESEND_FROM` - From address used for outgoing email (must be verified in Resend)
- `CONTACT_TO` - Recipient for contact form messages

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
│   └── contact.js
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

- Payment endpoint is mock-only (no external payment provider)
- Stock validation happens before order creation
- All timestamps use ISO 8601 format
