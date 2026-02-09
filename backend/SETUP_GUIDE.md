## Backend Setup Guide

### Prerequisites

1. **Node.js** (v18 or higher)
   - Download from https://nodejs.org/

2. **MongoDB**
   - Local: Download from https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

3. **Resend Account** (for contact form emails)

### Installation Steps

#### 1. Clone/Navigate to backend directory
```bash
cd vital/backend
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Create .env file
```bash
cp .env.example .env
```

#### 4. Configure .env
Edit `backend/.env` with your settings:

```env
PORT=5000
NODE_ENV=development

# MongoDB - Choose one:
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/vital-green

# OR MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vital-green?retryWrites=true&w=majority

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM="Vital Green <no-reply@yourdomain.com>"
CONTACT_TO=vitalandgreengroup@gmail.com

# Comma-separated list of allowed origins
CORS_ORIGIN=http://localhost:5173,https://your-frontend-domain.com

# Korapay
KORAPAY_SECRET_KEY=your_korapay_secret_key
KORAPAY_BASE_URL=https://api.korapay.com
KORAPAY_REDIRECT_URL=http://localhost:5173/order-confirmation
KORAPAY_NOTIFICATION_URL=http://localhost:5000/api/payment/webhook
```

#### 5. Start MongoDB (if using local)
```bash
# Windows
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

#### 6. Start the backend server
```bash
npm run dev
```

You should see:
```
Connected to MongoDB
Sample products initialized
Server running on http://localhost:5000
```

### Verify Installation

Test the server is working:
```bash
# Terminal 1: Backend running
npm run dev

# Terminal 2: Test endpoint
curl http://localhost:5000/api/health
# Should return: {"status":"Server is running"}
```

### Get Sample Data

Sample products are automatically initialized on first run:
```bash
curl http://localhost:5000/api/products
```

### Common Issues

#### MongoDB Connection Error
- Make sure MongoDB is running
- Check connection string in .env
- Try MongoDB Atlas for a cloud solution

#### Port Already in Use
- Change PORT in .env
- Or kill the process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F

  # Mac/Linux
  lsof -ti:5000 | xargs kill -9
  ```

#### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Testing

Use Postman, Thunder Client, or curl:

#### Get All Products
```bash
curl http://localhost:5000/api/products
```

#### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "product_id_here",
        "name": "Orange Juice",
        "price": 4.99,
        "quantity": 2
      }
    ],
    "subtotal": 9.98,
    "tax": 0.80,
    "shipping": 0,
    "total": 10.78,
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "555-0123",
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zipCode": "12345"
    }
  }'
```

### Rate Limits

All limits are per IP over a 15-minute window:
- Global API: 300 requests
- Orders (`POST /api/orders`): 20 requests
- Payment (`POST /api/payment/initialize`): 30 requests
- Contact (`POST /api/contact`): 10 requests

### Database Management

#### View Data in MongoDB

Using MongoDB Compass (GUI):
1. Download: https://www.mongodb.com/products/compass
2. Connect to `mongodb://localhost:27017`
3. Browse collections: products, orders

Using mongosh (CLI):
```bash
# Connect to local MongoDB
mongosh mongodb://localhost:27017/vital-green

# List all products
db.products.find()

# Count orders
db.orders.countDocuments()

# Find specific user
```

### Production Deployment

#### Using MongoDB Atlas

1. Create free cluster at https://cloud.mongodb.com
2. Create database user
3. Get connection string
4. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vital-green
   ```

#### Deploy to Heroku

1. Install Heroku CLI
2. Create Procfile:
   ```
   web: node server.js
   ```
3. Deploy:
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku main
   ```

### Next Steps

1. [x] Backend running
2. [ ] Connect frontend to backend
3. [ ] Configure email delivery
4. [ ] Set up email notifications
5. [ ] Deploy to production

---

**Need help?** Check individual API documentation in `README.md`
