# 🚀 Countdown: Quick Start Guide with Detailed Comments

This guide explains every step of the Countdown application with command-by-command instructions.

---

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** and **npm** installed (Download from nodejs.org)
- **MongoDB** running locally (or MongoDB Atlas account for cloud)
- **Git** installed (for cloning repository)

---

## ⚙️ Step 1: Environment Setup

### 1.1 Install Dependencies

```bash
# Install backend dependencies
cd server
npm install
# This installs: express, mongoose, cors, bcryptjs, jsonwebtoken, dotenv

# Install frontend dependencies
cd ../client
npm install
# This installs: react, react-dom, react-router-dom, axios, framer-motion, chart.js, lucide-react
```

### 1.2 Create Environment File

```bash
# In server folder, create .env file:
# Add these lines to server/.env:

MONGO_URI=mongodb://127.0.0.1:27017/countdown  # Local MongoDB
# OR if using MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/countdown

JWT_SECRET=your_jwt_secret_key_here              # Can be any random string
PORT=5001                                        # Backend server port
```

---

## 🗄️ Step 2: Database Setup

### 2.1 Start MongoDB (if running locally)

```bash
# On Mac:
brew services start mongodb-community

# On Linux:
sudo service mongod start

# On Windows:
# Open MongoDB from Start Menu or run:
# "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"
```

### 2.2 Verify MongoDB Connection

```bash
# Test connection:
mongosh
# If successful, you'll see: >

# Create database:
use countdown
# Switch to countdown database

# View collections:
show collections
# Should be empty initially
```

---

## 🎯 Step 3: Start the Application

### 3.1 Start Backend Server

```bash
# Navigate to server directory
cd server

# Start the server
npm start
# OR: node index.js
# OR (with auto-reload): npm run dev

# Expected output:
# Server is running on port 5001
# MongoDB URI: mongodb://127.0.0.1:27017/countdown
# Connected to MongoDB
```

**What's happening:**
- Express server starts on port 5001
- Connects to MongoDB database
- Routes are registered: /api/auth, /api/income, /api/expense, /api/loan
- Server waits for API calls from frontend

### 3.2 Start Frontend Development Server (New Terminal)

```bash
# Navigate to client directory
cd client

# Start the React development server
npm run dev
# OR: npm start

# Expected output:
#   ➜  Local:   http://localhost:5173/
#   ➜  press h to show help
```

**What's happening:**
- Vite development server starts on port 5173
- React app compiles and loads in browser
- Hot reload enabled (changes refresh automatically)
- App checks for JWT token in localStorage

---

## 🔐 Step 4: Test Authentication Flow

### 4.1 User Signs Up

```bash
# Expected Flow:

1. App opens → http://localhost:5173
2. App checks: Is token in localStorage? → NO
3. App redirects to: Auth page (/auth)
4. Auth page shows: "Create Account" form
5. User fills:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
6. User clicks: "Sign Up"

Frontend:
  POST to: http://localhost:5001/api/auth/signup
  Payload: {
    name: "John Doe",
    email: "john@example.com",
    password: "password123"
  }

Backend (authController.signup):
  Step 1: Check if user exists → NO
  Step 2: Hash password with bcrypt
  Step 3: Create User document in MongoDB
  Step 4: Generate JWT token
  Step 5: Return token + user info

Frontend receives:
  {
    token: "eyJhbGciOiJIUzI1NiIs...",
    user: { id: "605c...", name: "John Doe", email: "john@example.com" }
  }

Frontend actions:
  1. Store token in localStorage
  2. Redirect to Dashboard (/)
  3. App re-renders with FinanceProvider
  4. FinanceContext fetches data
```

### 4.2 User Logs In (Next Time)

```bash
# Same process but with existing user:

1. App opens
2. Check token in localStorage → YES (from previous signup)
3. Skip Auth page
4. Load Dashboard with data
```

---

## 💰 Step 5: Test Income Tracking

### 5.1 Add Income Entry

```bash
# User navigates to: /income page
# User clicks: "Add Income" button
# User fills form:
#   Amount: 5000
#   Source: Salary
#   Date: 2024-01-15

Frontend (Income.jsx):
  const handleAddIncome = async () => {
    POST to: http://localhost:5001/api/income/add
    Headers: Authorization: Bearer <token>
    Payload: {
      amount: 5000,
      source: "Salary",
      date: "2024-01-15"
    }
  }

Backend (financeController.addIncome):
  Step 1: Extract userId from JWT token → "605c..."
  Step 2: Create Income document:
    {
      userId: "605c...",
      amount: 5000,
      source: "Salary",
      date: "2024-01-15"
    }
  Step 3: Save to MongoDB in 'incomes' collection
  Step 4: Return saved income object

Frontend:
  Step 1: Receive response from backend
  Step 2: Call fetchData() to refresh incomes state
  Step 3: Fetch updated income list:
    GET /api/income
    Returns array of all incomes for this user
  Step 4: Update FinanceContext state
  Step 5: Re-render Income page + Dashboard

Dashboard updates:
  - totalIncome = 5000
  - Health score recalculates
  - Summary cards update
```

### 5.2 View Incomes in Dashboard

```bash
# Dashboard calculates:
const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
# Sums all income amounts: 5000 + 2000 + 1500 = 8500

# Displays in SummaryCard:
#   Title: "Monthly Income"
#   Amount: $8,500
#   Trend: +12% from last month
```

---

## 🛒 Step 6: Test Expense Tracking

### 6.1 Add Expense Entry

```bash
# User navigates to: /expenses page
# User clicks: "Add Expense" button
# User fills form:
#   Amount: 200
#   Category: Food
#   Date: 2024-01-15

Frontend (Expenses.jsx):
  POST to: http://localhost:5001/api/expense/add
  Headers: Authorization: Bearer <token>
  Payload: {
    amount: 200,
    category: "Food",
    date: "2024-01-15"
  }

Backend (financeController.addExpense):
  Step 1: Extract userId from JWT token
  Step 2: Create Expense document
  Step 3: Save to MongoDB
  Step 4: Return saved expense

Frontend:
  Step 1: Receive response
  Step 2: Call fetchData() to refresh state
  Step 3: Update FinanceContext
  Step 4: Re-render pages

Dashboard updates:
  - totalExpense = 200 (or sum of all)
  - netSavings = totalIncome - totalExpense
  - Health score recalculates
```

### 6.2 Delete Expense

```bash
# User on Expenses page sees list
# User clicks "Delete" button on an expense

Frontend:
  DELETE to: http://localhost:5001/api/expense/{expenseId}
  Headers: Authorization: Bearer <token>

Backend (financeController.deleteExpense):
  Expense.findOneAndDelete({
    _id: expenseId,
    userId: userId  # Security: verify ownership
  })

Frontend:
  Call fetchData() to refresh state
  Expense removed from list and dashboard
```

---

## 🏦 Step 7: Test Loan Management

### 7.1 Create a Loan

```bash
# User navigates to: /loans page
# User clicks: "Create New Loan" button
# User fills form:
#   Loan Amount: 100,000
#   Interest Rate: 10% p.a.
#   Tenure: 60 months (5 years)
#   Start Date: 2024-01-01

Frontend (Loans.jsx):
  POST to: http://localhost:5001/api/loan/create
  Headers: Authorization: Bearer <token>
  Payload: {
    loanAmount: 100000,
    interestRate: 10,
    tenureMonths: 60,
    startDate: "2024-01-01"
  }

Backend (loanController.createLoan):
  Step 1: Extract userId from token → "605c..."
  Step 2: Call loanService.calculateEMI(100000, 10, 60)
    
    Calculate EMI using formula:
    EMI = P × [R(1+R)^N] / [(1+R)^N - 1]
    
    Where:
    P = 100,000 (principal)
    R = 10 / 100 / 12 = 0.00833 (monthly rate)
    N = 60 (months)
    
    Calculate:
    (1 + R)^N = (1.00833)^60 = 1.6453
    Numerator = 100000 × 0.00833 × 1.6453 = 1371.06
    Denominator = 1.6453 - 1 = 0.6453
    EMI = 1371.06 / 0.6453 = 2,124.71

  Step 3: Create Loan document:
    {
      userId: "605c...",
      loanAmount: 100000,
      interestRate: 10,
      tenureMonths: 60,
      emi: 2124.71,
      remainingBalance: 100000,  # Initially same as loan amount
      startDate: "2024-01-01"
    }

  Step 4: Save to MongoDB
  Step 5: Return loan object

Frontend:
  Step 1: Receive loan response with EMI calculated
  Step 2: Call fetchData() to refresh loans
  Step 3: Display in Loans page:
    Loan Amount: ₹100,000
    Interest Rate: 10% p.a.
    Tenure: 60 months
    Monthly EMI: ₹2,124.71

Dashboard updates:
  - totalLoanBalance = 100,000
  - totalEMI = 2,124.71
  - Health score drops (increased debt obligation)
```

### 7.2 Pay EMI

```bash
# User on Loans page clicks "Pay EMI" button
# User enters: Amount: 2124.71, Date: 2024-02-01

Frontend (Loans.jsx):
  POST to: http://localhost:5001/api/loan/{loanId}/pay-emi
  Headers: Authorization: Bearer <token>
  Payload: {
    amountPaid: 2124.71,
    date: "2024-02-01"
  }

Backend (loanController.payEmi):
  Step 1: Find loan by ID and verify ownership
  
  Step 2: Calculate interest portion:
    monthlyRate = 10 / 100 / 12 = 0.00833
    remainingBalance = 100,000 (initially)
    interest = 100,000 × 0.00833 = 833.00
  
  Step 3: Calculate principal portion:
    principalPaid = amountPaid - interest
    principalPaid = 2124.71 - 833.00 = 1291.71
  
  Step 4: Update loan balance:
    remainingBalance = 100,000 - 1291.71 = 98,708.29
  
  Step 5: Create EmiPayment record for history:
    {
      loanId: "{loanId}",
      amountPaid: 2124.71,
      date: "2024-02-01",
      status: "paid"
    }
  
  Step 6: Return updated loan + payment details

Frontend:
  Receives: {
    loan: { remainingBalance: 98708.29, ... },
    payment: { amountPaid: 2124.71, ... },
    interestPaid: 833.00
  }
  
  Shows confirmation:
    "EMI Paid Successfully!"
    "Principal: ₹1,291.71"
    "Interest: ₹833.00"
    "New Balance: ₹98,708.29"
  
  Calls fetchData() to refresh state
  Dashboard updates with new balance
```

---

## 🎰 Step 8: Test Loan Simulator

### 8.1 Run Simulation

```bash
# User navigates to: /simulator page
# User selects loan: "Student Loan"
# User enters: Extra Monthly Payment: ₹500
# User clicks: "Simulate"

Frontend (Simulator.jsx):
  POST to: http://localhost:5001/api/loan/{loanId}/simulate
  Headers: Authorization: Bearer <token>
  Payload: {
    extraMonthlyPayment: 500
  }

Backend (loanController.simulateLoan):
  Calls loanService.simulateExtraPayment(98708.29, 10, 60, 500)
  
  Loop month by month:
    Month 1:
      balance = 98,708.29
      interest = 98,708.29 × 0.00833 = 821.56
      payment = baseEMI(2124.71) + extra(500) = 2624.71
      newBalance = 98,708.29 - (2624.71 - 821.56) = 96,905.14
    
    Month 2:
      balance = 96,905.14
      interest = 807.06
      payment = 2624.71
      newBalance = 95,088.49
    
    ... Continue until balance = 0
  
  Results:
    Original payoff: 60 months
    With ₹500 extra: 42 months
    Months saved: 18 months
    Interest saved: ₹15,000

Frontend:
  Receives simulation results
  Displays:
    "Standard Payoff: 60 months"
    "With ₹500 Extra: 42 months"
    "💰 Months Saved: 18 months"
    "💡 Interest Saved: ₹15,000"
  
  Shows visualization/charts
```

---

## 📊 Step 9: Download Financial Report

```bash
# User on Dashboard clicks "Download Report" button

Frontend (Dashboard.jsx):
  handleDownloadReport() {
    generateFinancialReport(incomes, expenses, loans)
  }

Backend (reportService.js):
  Generates PDF with:
    - All income entries
    - All expense entries
    - All loan details
    - Calculations (totals, health score, EMI details)
    - Charts and graphs

Frontend:
  Browser downloads: countdown_report_{date}.pdf
```

---

## 🐛 Debugging Guide

### Check API Endpoint

```bash
# Test if backend is running:
curl http://localhost:5001/api/income
# Should return (401 Unauthorized) because no token provided
# This means server is running!

# With valid token:
curl -H "Authorization: Bearer <token>" http://localhost:5001/api/income
# Should return array of incomes
```

### Check Database

```bash
# Connect to MongoDB:
mongosh

# Switch to database:
use countdown

# View all users:
db.users.find()

# View all incomes:
db.incomes.find()

# View all loans:
db.loans.find()

# Clear all data (for testing):
db.users.deleteMany({})
db.incomes.deleteMany({})
db.expenses.deleteMany({})
db.loans.deleteMany({})
```

### Check Browser Console

```bash
# Open browser DevTools: F12 or Right-click → Inspect
# Go to Console tab
# Look for errors (red messages)
# Check Network tab to see API requests

# Common issues:
- 401 Unauthorized: Token expired or invalid
- 404 Not Found: API endpoint doesn't exist
- CORS error: Backend CORS not configured
- Network error: Backend server not running
```

---

## ✅ Test Checklist

- [ ] Backend server starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Can sign up with new account
- [ ] Can log in with existing account
- [ ] Can add income entry
- [ ] Can add expense entry
- [ ] Can create loan (EMI calculates correctly)
- [ ] Can pay EMI (balance updates)
- [ ] Can run loan simulator
- [ ] Dashboard displays all metrics
- [ ] Can download PDF report
- [ ] Can switch currency
- [ ] Can delete expense

---

## 📁 Important Files for Understanding Flow

### Backend (Start Here)
1. `server/index.js` - Server setup and routes
2. `server/routes/authRoutes.js` - Auth endpoints
3. `server/controllers/authController.js` - Login/Signup logic
4. `server/middlewares/authMiddleware.js` - JWT verification
5. `server/controllers/financeController.js` - Income/Expense logic
6. `server/controllers/loanController.js` - Loan operations
7. `server/services/loanService.js` - Financial calculations

### Frontend (Then This)
1. `client/src/main.jsx` - React entry point
2. `client/src/App.jsx` - Main app component and routing
3. `client/src/contexts/FinanceContext.jsx` - Global state management
4. `client/src/pages/Auth.jsx` - Login/Signup UI
5. `client/src/pages/Dashboard.jsx` - Home page
6. `client/src/pages/Income.jsx` - Income management
7. `client/src/pages/Loans.jsx` - Loan management
8. `client/src/pages/Simulator.jsx` - Loan simulation

---

## 🎓 How Data Flows Through the App

```
USER INTERACTION
    ↓
REACT COMPONENT (e.g., Income.jsx)
    ↓
AXIOS API CALL (POST /api/income/add)
    ↓
EXPRESS ROUTE (routes/incomeRoutes.js)
    ↓
AUTH MIDDLEWARE (Verify JWT token & extract userId)
    ↓
CONTROLLER (financeController.addIncome)
    ↓
MONGODB (Save Income document)
    ↓
Response sent back to frontend
    ↓
Frontend calls fetchData() to refresh state
    ↓
FinanceContext updated
    ↓
All components using useFinance() re-render
    ↓
Dashboard displays updated values
```

---

## 📚 Key Concepts

### JWT Token
- Issued after login/signup
- Stored in localStorage
- Sent in every API request header
- Backend verifies token on protected routes
- Prevents unauthorized access

### MongoDB Collections
- `users` - User accounts
- `incomes` - Income entries
- `expenses` - Expense entries
- `loans` - Loan information
- `emipayments` - Payment history

### EMI Calculation
- Monthly payment amount for a loan
- Interest decreases over time
- Principal increases over time
- Can be accelerated with extra payments

### Health Score
- 0-100 scale
- Based on income, expenses, and debt
- Higher = better financial health
- Helps users understand financial status

---

## 🚀 Next Steps

- [ ] Understand End-to-End flow (read END-TO-END-FLOW.md)
- [ ] Read through commented code files
- [ ] Make changes and see how data flows
- [ ] Add new features (e.g., budget alerts, investment tracking)
- [ ] Deploy to production (Heroku, Vercel, AWS)

Enjoy building! 🎉

