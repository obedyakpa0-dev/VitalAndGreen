# Vital Green Backend

Node.js + Express + MongoDB backend for the Vital Green juice e-commerce platform.

## Features

- **Product Management**: CRUD operations for juice products with reviews
- **Order Management**: Order creation, status updates, and cancellations
- **Stock Management**: Automatic stock updates and validation
- **Payment Initialization**: Mock payment endpoint (no external provider)
- **Contact Form**: Email delivery via Resend
- **Pagination**: Server-side pagination for product listings
- **Rate Limiting**: Global and route-specific request limits

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
- `POST /api/payment/initialize` - Initialize payment
- `GET /api/payment/verify?reference=...` - Verify payment by reference
- `POST /api/payment/webhook` - Korapay webhook endpoint

### Contact
- `POST /api/contact` - Send contact form email

## Rate Limits

All limits are per IP over a 15-minute window:
- Global API: 300 requests
- Orders (`POST /api/orders`): 20 requests
- Payment (`POST /api/payment/initialize`): 30 requests
- Contact (`POST /api/contact`): 10 requests

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `CORS_ORIGIN` - Comma-separated list of allowed origins
- `RESEND_API_KEY` - Resend API key
- `RESEND_FROM` - From address used for outgoing email (must be verified in Resend)
- `CONTACT_TO` - Recipient for contact form messages
- `KORAPAY_SECRET_KEY` - Korapay secret key (server-side)
- `KORAPAY_BASE_URL` - Korapay API base URL (default: https://api.korapay.com)
- `KORAPAY_REDIRECT_URL` - Frontend URL for payment redirect
- `KORAPAY_NOTIFICATION_URL` - Backend webhook URL for payment notifications

## Project Structure

```
backend/
|-- models/           # Database schemas
|   |-- Product.js
|   `-- Order.js
|-- routes/           # API routes
|   |-- products.js
|   |-- orders.js
|   |-- payment.js
|   `-- contact.js
|-- middleware/       # Custom middleware
|   `-- rateLimiters.js
|-- server.js         # Main server file
|-- package.json
`-- .env.example
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

- Payment confirmation happens before orders are created
- Stock validation happens before order creation
- All timestamps use ISO 8601 format
