# Frontend-Backend Integration Guide

This document explains how the frontend is connected to the backend API.

## API Service Setup

### Location
The API service is located at: `src/services/api.js`

### Configuration
- **Base URL**: Configured via `VITE_API_URL` environment variable
- **Default**: `http://localhost:5000/api`
- **Environment File**: `.env` in the root of `vital-green` folder

### Example `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

## Available API Endpoints

### Products API (`productsAPI`)
```javascript
import { productsAPI } from '../services/api'

// Get all products with pagination
await productsAPI.getAll(page, limit)

// Get product by ID
await productsAPI.getById(id)


// Create product
await productsAPI.create(productData)

// Update product
await productsAPI.update(id, productData)

// Delete product
await productsAPI.delete(id)

// Add review to product
await productsAPI.addReview(id, reviewData)
```

### Orders API (`ordersAPI`)
```javascript
import { ordersAPI } from '../services/api'

// Create new order
await ordersAPI.create(orderData)

// Get all orders
await ordersAPI.getAll()

// Get order by ID
await ordersAPI.getById(id)

// Get order by order number
await ordersAPI.getByOrderNumber(orderNumber)

// Update order status
await ordersAPI.updateStatus(id, status)

// Cancel order
await ordersAPI.cancel(id)
```

### Payment API (`paymentAPI`)
```javascript
import { paymentAPI } from '../services/api'

// Initialize mock payment
await paymentAPI.initialize({ email, amount })
```

## Pages Using Backend Integration

### 1. **Products Page** (`src/pages/Products.jsx`)
- Fetches all products from `/api/products` endpoint
- Displays loading state while fetching
- Loads product images from backend URLs

### 2. **Admin Dashboard** (`src/pages/Admin.jsx`)
- Fetches products from `/api/products`
- Fetches orders from `/api/orders`
- Allows adding new products via API
- Allows deleting products via API
- Falls back to mock data if backend unavailable

### 3. **Home Page** (`src/pages/home.jsx`)
- Currently uses mock data
- Can be updated to fetch featured products from `/api/products`

### 4. **Checkout** (`src/pages/Checkout.jsx`)
- Stores orders locally in `localStorage`
- Opens an external payment link in a new tab
- Not yet connected to backend orders or payment endpoints

## Running the Full Stack

### Backend
```bash
cd backend
npm install
npm start
```
Backend runs on `http://localhost:5000`

### Frontend
```bash
cd vital-green
npm install
npm start
```
Frontend runs on `http://localhost:5173`

## Error Handling

The API service automatically:
- Catches and logs errors
- Throws errors for frontend to handle
- Falls back to mock data in most pages when backend is unavailable
- Displays loading states while fetching data

## Fallback Behavior

If the backend is unavailable:
- **Products Page**: Shows empty state if backend is unavailable
- **Admin Page**: Shows mock products and orders
- **Home Page**: Uses embedded mock data
- **Checkout**: Still allows placing orders (stored in localStorage)

## Future Enhancements

- [ ] Implement real product image uploads
- [ ] Add search and filter functionality
- [ ] Implement pagination UI
- [ ] Add order tracking
- [ ] Add Payments webhook verification
- [ ] Add user dashboard

## Payments Redirect

Checkout opens an external payment link in a new tab and then navigates to the order confirmation page.
