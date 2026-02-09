# Vital Green - Complete E-commerce Platform

## Project Structure

```
vital/
|-- vital-green/              # React Frontend
|   |-- src/
|   |   |-- pages/            # Page components
|   |   |-- components/       # Reusable components
|   |   |-- context/          # React context
|   |   `-- App.jsx
|   |-- package.json
|   `-- vite.config.js
|
`-- backend/                  # Node.js Backend
    |-- models/               # Database schemas
    |-- routes/               # API endpoints
    |-- middleware/           # Custom middleware
    |-- utils/                # Utility functions
    |-- server.js
    `-- package.json
```

## Quick Start

### Frontend Setup
```bash
cd vital-green
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Backend runs on: `http://localhost:5000`

## Features

### Frontend (React + Vite)
- Product catalog
- Shopping cart with quantity management
- Checkout form
- Order confirmation
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Client-side routing with React Router
- Contact form (email via backend)

### Backend (Express + MongoDB)
- RESTful API
- Product CRUD operations
- Order management with stock control
- Product reviews and ratings
- Contact form email delivery via Resend
- Payment initialization
- Rate limiting (global + route-specific)
 - Payment verification before order creation

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Products
- `GET /products` - List all products
- `GET /products/:id` - Get product details
- `POST /products` - Create new product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)
- `POST /products/:id/reviews` - Add review

### Orders
- `POST /orders` - Create new order
- `GET /orders` - Get all orders (admin)
- `GET /orders/:id` - Get order details
- `GET /orders/number/:orderNumber` - Get order by order number
- `PUT /orders/:id` - Update order status
- `POST /orders/:id/cancel` - Cancel order

### Payment
- `POST /payment/initialize` - Initialize payment
- `GET /payment/verify?reference=...` - Verify payment by reference
- `POST /payment/webhook` - Korapay webhook endpoint

### Contact
- `POST /contact` - Send contact form email

### Health
- `GET /health` - Server health check

## Rate Limits

All limits are per IP over a 15-minute window:
- Global API: 300 requests
- Orders (`POST /orders`): 20 requests
- Payment (`POST /payment/initialize`): 30 requests
- Contact (`POST /contact`): 10 requests

## Technologies Used

### Frontend
- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Framer Motion
- Fetch API (for API calls)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- Resend API (email)
- express-rate-limit

## Development Workflow

1. **Frontend Development**: 
   - Make changes in `vital-green/src`
   - Vite hot reload will refresh automatically
   - Test against local backend API

2. **Backend Development**:
   - Make changes in `backend/`
   - Nodemon will restart server automatically
   - Test endpoints with Postman or curl

3. **Database**:
   - MongoDB should be running locally
   - Sample products will auto-initialize on first run
   - Orders stored persistently

## Testing

### Test Frontend
```bash
cd vital-green
npm run dev
# Open http://localhost:5173
```

### Test Backend
```bash
cd backend
npm run dev
# Server logs will show "Server running on http://localhost:5000"
```

### Test API Endpoints
```bash
# Get products
curl http://localhost:5000/api/products
```

## Deployment

### Frontend (Vercel/Netlify)
```bash
cd vital-green
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Push to deployment platform
# Set environment variables
# MongoDB Atlas for production
```

## Support

For issues or questions, please refer to the individual README files in:
- `vital-green/README.md`
- `backend/README.md`

## Next Steps

- [ ] Connect frontend API calls to backend
- [ ] Set up MongoDB Atlas for production
- [ ] Add email notifications
- [ ] Implement admin dashboard
- [ ] Add product image uploads
- [ ] Set up automated testing
- [ ] Deploy to production
