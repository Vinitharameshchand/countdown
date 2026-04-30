# 🚀 Installation & Running Guide

Complete step-by-step instructions to get Countdown running on your machine.

## ✅ Prerequisites Check

Before starting, verify you have:

```bash
# Check Node.js version (need 16+)
node --version    # Should be v16.0.0 or higher

# Check npm version (need 8+)
npm --version     # Should be 8.0.0 or higher

# Check MongoDB (if using locally)
mongod --version  # Should show MongoDB version

# Check Git
git --version     # Should show git version
```

If any are missing, install from:
- Node.js + npm: https://nodejs.org/
- MongoDB: https://docs.mongodb.com/manual/installation/
- Git: https://git-scm.com/

## 📋 Setup Steps

### Phase 1: Backend Setup (Server)

Open Terminal and run:

```bash
# 1. Navigate to project
cd countdown

# 2. Go to server directory
cd server

# 3. Install dependencies
npm install

# Expected: ✅ added XXX packages

# 4. Create .env file (should already exist)
# File: server/.env
# Should contain:
# MONGO_URI=mongodb://127.0.0.1:27017/countdown
# JWT_SECRET=countdown_super_secret_key_change_in_production_12345
# JWT_EXPIRE=7d
# PORT=5001
# NODE_ENV=development
# CORS_ORIGIN=http://localhost:5173

# 5. Start MongoDB (new terminal window)
# Option A: Local MongoDB
mongod

# Option B: MongoDB Atlas (cloud)
# Update MONGO_URI in .env with your connection string

# 6. Back in original terminal, seed database
npm run seed

# Expected output:
# ✅ Connected to MongoDB
# 🗑️  Cleared existing data
# ✅ Created demo user: demo@countdown.com
# ✅ Created 4 sample loans
# ✅ Created 2 additional users
# ✅ Database seeding completed successfully!
# 
# 📝 Demo Credentials:
#    Email: demo@countdown.com
#    Password: demo123456

# 7. Start backend server
npm run dev:local

# Expected output:
# ╔══════════════════════════════════════════════╗
# ║   🚀 Countdown Server Starting              ║
# ║   PORT: 5001                                 ║
# ║   ENV: development                           ║
# ║   API: http://localhost:5001                ║
# ╚══════════════════════════════════════════════╝

# 8. Test backend is working
# In another terminal:
curl http://localhost:5001/health
# Should return: {"success":true,"message":"Server is running",...}
```

✅ **Backend is running on http://localhost:5001**

### Phase 2: Frontend Setup (Client)

Open NEW Terminal window and run:

```bash
# 1. Navigate to project
cd countdown

# 2. Go to client directory
cd client

# 3. Install dependencies
npm install

# Expected: ✅ added XXX packages

# 4. Start development server
npm run dev:local

# Expected output:
# VITE v4.x.x  ready in 123 ms
# 
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help

```

✅ **Frontend is running on http://localhost:5173**

## 🌐 Access Application

### Open in Browser

1. **Main App:** http://localhost:5173
2. **Backend API:** http://localhost:5001
3. **API Health:** http://localhost:5001/health

### Login with Demo Account

```
Email: demo@countdown.com
Password: demo123456
```

### First Time Experience

1. **Home Page** → Click "Get Started Now"
2. **Login Page** → Use demo credentials above
3. **Dashboard** → See lock-screen widget with sample data
4. **View Loans** → See 4 sample loans
5. **Add Loan** → Create your own loan
6. **See Insights** → Get financial recommendations

## 🧪 Test Key Features

### Test 1: Lock-Screen Widget
- Go to Dashboard
- See large countdown timer
- See EMI amount (e.g., ₹50,000)
- See debt ratio with color (Green/Yellow/Red)
- See financial insight

### Test 2: Add New Loan
- Click "Add Loan" button
- Fill form:
  - Name: "Personal Loan"
  - Type: "personal"
  - Principal: 500000
  - Annual Interest: 12
  - Tenure: 48 months
  - Remaining: 30 months
- Click "Add Loan"
- See updated dashboard

### Test 3: View Loan Details
- Go to "View Loans"
- Click loan to edit
- See EMI calculated automatically
- Change remaining months, see EMI update

### Test 4: Authentication
- Logout (click Logout button)
- Try accessing /dashboard → redirects to login
- Login again with credentials

### Test 5: Calculations
- In browser DevTools → Console
- Calculations work client-side too

## 📊 API Testing with Curl

```bash
# 1. Login and get token
TOKEN=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"demo@countdown.com",
    "password":"demo123456"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"

# 2. Get all loans
curl -X GET http://localhost:5001/api/loans \
  -H "Authorization: Bearer $TOKEN"

# 3. Get dashboard
curl -X GET http://localhost:5001/api/loans/analytics/dashboard \
  -H "Authorization: Bearer $TOKEN"

# 4. Create new loan
curl -X POST http://localhost:5001/api/loans \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Loan",
    "type": "personal",
    "principal": 100000,
    "remainingBalance": 80000,
    "annualInterestRate": 10,
    "loanTenureMonths": 24,
    "remainingMonths": 12
  }'
```

## ⚠️ Common Issues & Fixes

### Issue 1: "Cannot connect to MongoDB"

**Error:** `MongooseError: Cannot connect to mongodb://127.0.0.1:27017`

**Fix:**
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
brew services start mongodb-community    # macOS
sudo systemctl start mongod              # Linux
# Or use MongoDB Atlas (cloud)
```

### Issue 2: "Port 5001 already in use"

**Error:** `EADDRINUSE: address already in use :::5001`

**Fix:**
```bash
# Find and kill process
lsof -i :5001
kill -9 <PID>

# Or change port in server/.env
PORT=5002
```

### Issue 3: "Port 5173 already in use"

**Error:** `EADDRINUSE: address already in use :::5173`

**Fix:**
```bash
# Find and kill process
lsof -i :5173
kill -9 <PID>

# Or change port in client/vite.config.js
server: { port: 5174 }
```

### Issue 4: "CORS Error in browser"

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Fix:**
```bash
# Update server/.env
CORS_ORIGIN=http://localhost:5173

# Restart backend
npm run dev:local
```

### Issue 5: "Dependencies not installed"

**Error:** `Cannot find module 'express'`

**Fix:**
```bash
# Reinstall dependencies
cd server
rm -rf node_modules
npm install

cd ../client
rm -rf node_modules
npm install
```

## 📦 Environment Variables

### Backend (.env)

```env
# Database
MONGO_URI=mongodb://127.0.0.1:27017/countdown

# Authentication
JWT_SECRET=countdown_super_secret_key_change_in_production_12345
JWT_EXPIRE=7d

# Server
PORT=5001
NODE_ENV=development

# Frontend
CORS_ORIGIN=http://localhost:5173
```

### Frontend (implicit in API service)

```
REACT_APP_API_URL=http://localhost:5001/api
```

## 🎯 Development Workflow

### Both Servers Running

Keep two terminal windows open:

**Terminal 1: Backend**
```bash
cd countdown/server
npm run dev:local
```

**Terminal 2: Frontend**
```bash
cd countdown/client
npm run dev:local
```

### Make Changes

- **Backend:** Edit files in `server/src/`, auto-reloads via nodemon
- **Frontend:** Edit files in `client/src/`, auto-reloads via Vite

### View Changes

- **Backend:** Test via curl or API client
- **Frontend:** Refresh browser (http://localhost:5173)

## 🗑️ Reset Database

```bash
# Clear and re-seed database
cd server
npm run seed

# Or manually:
# 1. Stop server (Ctrl+C)
# 2. Run: npm run seed
# 3. Start server: npm run dev:local
```

## 🏗️ Build for Production

### Backend
```bash
npm run start
```

### Frontend
```bash
npm run build
# Creates: client/dist/ folder for deployment
```

## 📚 Useful Commands

```bash
# Backend
npm run dev:local    # Start with auto-reload
npm start            # Start production
npm run seed         # Seed database

# Frontend
npm run dev:local    # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## ✅ Verification Checklist

- [ ] Node.js installed (v16+)
- [ ] MongoDB running locally or cloud URI configured
- [ ] Backend dependencies installed (`npm install` in server/)
- [ ] Database seeded (`npm run seed`)
- [ ] Backend running (`npm run dev:local` in server/)
- [ ] Frontend dependencies installed (`npm install` in client/)
- [ ] Frontend running (`npm run dev:local` in client/)
- [ ] Can access http://localhost:5173
- [ ] Can login with demo@countdown.com / demo123456
- [ ] Can see dashboard with sample loans
- [ ] Can add new loan
- [ ] Calculations update in real-time

## 🎉 You're Ready!

Once all checks pass, you have a fully functional Countdown app running locally!

**Next Steps:**
- Explore the dashboard
- Test all features
- Review the code
- Customize as needed
- Deploy to production

---

**Questions?** Check troubleshooting section above or review code comments.

**Happy Counting Down to Debt Freedom! 🚀**
