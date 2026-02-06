# Vital Green - Complete E-commerce Platform

## Project Structure

```
vital/
├── vital-green/              # React Frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── backend/                 # Node.js Backend
    ├── models/             # Database schemas
    ├── routes/             # API endpoints
    ├── middleware/         # Custom middleware
    ├── utils/              # Utility functions
    ├── server.js
    └── package.json
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
- ✅ Product catalog with search
- ✅ Shopping cart with quantity management
- ✅ User authentication
- ✅ Checkout with payment form
- ✅ Order confirmation
- ✅ Responsive design with Tailwind CSS
- ✅ Smooth animations with Framer Motion
- ✅ Client-side routing with React Router

### Backend (Express + MongoDB)
- ✅ RESTful API
- ✅ Product CRUD operations
- ✅ Order management with stock control
- ✅ User registration and login
- ✅ JWT authentication
- ✅ Stripe payment integration
- ✅ Order history and tracking
- ✅ Product reviews and ratings

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Products
- `GET /products` - List all products
- `GET /products/:id` - Get product details
- `GET /products/search?query=juice` - Search products
- `POST /products` - Create new product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)
- `POST /products/:id/reviews` - Add review

### Orders
- `POST /orders` - Create new order
- `GET /orders` - Get all orders (admin)
- `GET /orders/:id` - Get order details
- `PUT /orders/:id` - Update order status
- `POST /orders/:id/cancel` - Cancel order

### Auth
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/profile/:id` - Get user profile
- `PUT /auth/profile/:id` - Update profile
- `POST /auth/verify` - Verify token

### Payment
- `POST /payment/create-intent` - Create payment intent
- `POST /payment/confirm` - Confirm payment
- `POST /payment/refund` - Process refund

## Environment Setup

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vital-green
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
CORS_ORIGIN=http://localhost:5173
```

## Technologies Used

### Frontend
- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Framer Motion
- Axios (for API calls)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Stripe API
- bcryptjs

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
   - Orders and users stored persistently

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

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'
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
- [ ] Configure Stripe with real keys
- [ ] Add email notifications
- [ ] Implement admin dashboard
- [ ] Add product image uploads
- [ ] Set up automated testing
- [ ] Deploy to production
