# Vital Green Backend

Node.js + Express + MongoDB backend for the Vital Green juice e-commerce platform.

## Features

- **Product Management**: CRUD operations for juice products with reviews
- **Order Management**: Order creation, status updates, and cancellations
- **Stock Management**: Automatic stock updates and validation
- **Payment Initialization**: Mock payment endpoint (no external provider)
- **Contact Form**: Email delivery via SMTP
- **Pagination**: Server-side pagination for product listings

## Installation

1. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

2. Update `.env` with your settings:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vital-green
CORS_ORIGIN=http://localhost:5173
SMTP_SERVICE=gmail
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="Vital Green <your_gmail@gmail.com>"
CONTACT_TO=vitalandgrean@gamil.com
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
- `SMTP_SERVICE` - Email provider service (e.g., gmail)
- `SMTP_USER` - SMTP username/email
- `SMTP_PASS` - SMTP password or app password
- `SMTP_FROM` - From address used for outgoing email
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
