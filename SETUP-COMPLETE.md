# 🚀 Countdown - Lock-Screen First Debt Freedom App

**Complete Production-Ready Application**

Know how long until you're debt-free, know if you're financially safe, and know what action to take next.

## 🎯 Core Features

✅ **Debt Countdown Engine** - Calculate exact payoff date in years, months, days  
✅ **EMI Calculator** - Precise monthly installment calculations using industry formula  
✅ **Debt Safety Indicator** - Color-coded risk assessment (Green/Yellow/Red)  
✅ **Multi-Loan Support** - Manage multiple loans with unified countdown  
✅ **Decision Engine** - AI-powered actionable insights  
✅ **Simulation Engine** - "What-if" scenarios for extra payments  
✅ **Dashboard UI** - Beautiful, minimal, mobile-first design  
✅ **Lock Screen Widget** - iOS/Android-style status widget  

## 📊 Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS
- Framer Motion (animations)
- Axios (API calls)
- Chart.js (visualizations)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt Password Hashing

**Database:**
- MongoDB (Local or MongoDB Atlas)

## 📁 Project Structure

```
countdown/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── models/         # MongoDB schemas
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, validation
│   │   ├── scripts/        # Database seeding
│   │   └── index.js        # Server entry point
│   ├── package.json
│   ├── .env                # Environment variables
│   └── .env.example        # Example env file
│
└── Documentation files     # Guides and references
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ and npm 8+
- **MongoDB** 4.4+ (Local or Atlas)
- **Git**

### Step 1: Clone Repository

```bash
cd countdown
git clone . . # Already initialized
```

### Step 2: Backend Setup

```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Create .env file (already provided)
# Edit .env with your MongoDB URI and JWT secret

# Seed database with demo data
npm run seed

# Start backend server
npm run dev:local

# Expected output:
# ✅ MongoDB Connected: 127.0.0.1
# 🚀 Countdown Server Starting
# PORT: 5001
```

### Step 3: Frontend Setup

```bash
# In a new terminal, navigate to client
cd client

# Install dependencies
npm install

# Start development server
npm run dev:local

# Expected output:
# VITE v4.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
```

### Step 4: Access Application

```
Frontend: http://localhost:5173
Backend API: http://localhost:5001

Demo Credentials:
- Email: demo@countdown.com
- Password: demo123456
```

## 🔐 API Endpoints

### Authentication

```
POST   /api/auth/signup           - Create new account
POST   /api/auth/login            - Login user
GET    /api/auth/profile          - Get user profile
PUT    /api/auth/profile          - Update profile
POST   /api/auth/change-password  - Change password
```

### Loans

```
GET    /api/loans                 - Get all loans
POST   /api/loans                 - Create new loan
GET    /api/loans/:id             - Get loan details
PUT    /api/loans/:id             - Update loan
DELETE /api/loans/:id             - Delete loan
POST   /api/loans/:id/pay         - Record payment
POST   /api/loans/:id/simulate    - Simulate extra payment
GET    /api/loans/:id/amortization - Get amortization schedule
GET    /api/loans/analytics/dashboard - Get dashboard data
```

## 📊 EMI Calculation Formula

```
EMI = (P × r × (1 + r)^n) / ((1 + r)^n - 1)

Where:
- P = Principal amount
- r = Monthly interest rate (annual rate / 12 / 100)
- n = Number of months
```

## 🎯 Debt Ratio Classification

```
Green (Safe):     ≤ 30%
Yellow (Caution): 30% - 50%
Red (Risk):       > 50%
```

## 🧪 Testing the Application

### 1. Test Login/Signup
- Click "Sign Up" and create account
- Login with your credentials
- Or use demo account (demo@countdown.com / demo123456)

### 2. Test Dashboard
- View lock-screen widget showing:
  - Countdown to debt freedom
  - Monthly EMI amount
  - Debt ratio with color indicator
  - Financial insights

### 3. Test Loan Management
- Add new loan (POST /api/loans)
- Edit loan details
- Delete loan
- View loan list

### 4. Test Calculations
- EMI is automatically calculated
- Amortization schedule generated
- Debt ratio updates in real-time

### 5. Sample Curl Tests

```bash
# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@countdown.com","password":"demo123456"}'

# Get dashboard (replace TOKEN with actual token)
curl -X GET http://localhost:5001/api/loans/analytics/dashboard \
  -H "Authorization: Bearer TOKEN"

# Get all loans
curl -X GET http://localhost:5001/api/loans \
  -H "Authorization: Bearer TOKEN"
```

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  monthlyIncome: Number,
  currency: String (default: 'INR'),
  notifications: Boolean,
  createdAt: Date
}
```

### Loan Model
```javascript
{
  userId: ObjectId (reference to User),
  name: String,
  type: String (personal, home, auto, education, credit-card, other),
  principal: Number,
  remainingBalance: Number,
  annualInterestRate: Number,
  loanTenureMonths: Number,
  remainingMonths: Number,
  emi: Number (auto-calculated),
  startDate: Date,
  expectedPayoffDate: Date (auto-calculated),
  totalInterestPaid: Number,
  totalInterestRemaining: Number,
  extraMonthlyPayment: Number (default: 0),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🌐 Deployment

### Deploy Backend (Heroku/Railway/Render)

```bash
# 1. Set environment variables in deployment platform
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5001
NODE_ENV=production

# 2. Deploy
# Follow platform-specific instructions
```

### Deploy Frontend (Vercel/Netlify)

```bash
# 1. Build
npm run build

# 2. Update API endpoint in .env
REACT_APP_API_URL=https://your-api.com

# 3. Deploy build folder
# Follow platform-specific instructions
```

## 📱 Mobile Responsiveness

The app is fully responsive and works on:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (320px - 767px)

Widget component is optimized for lock-screen display.

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Bcrypt password hashing
- ✅ Request validation
- ✅ CORS protection
- ✅ Input sanitization
- ✅ Secure HTTP headers

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB (macOS)
brew services start mongodb-community

# Or use MongoDB Atlas (cloud)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/countdown
```

### Port Already in Use
```bash
# Kill process on port 5001 (Backend)
lsof -i :5001
kill -9 <PID>

# Or change PORT in .env
PORT=5002
```

### CORS Error
```bash
# Update CORS_ORIGIN in server/.env
CORS_ORIGIN=http://localhost:5173
```

### Clear Node Modules
```bash
# Backend
cd server && rm -rf node_modules && npm install

# Frontend
cd client && rm -rf node_modules && npm install
```

## 📚 Core Logic Functions

### Backend Services (server/src/services/financialService.js)

- `calculateEMI()` - Calculate monthly EMI
- `generateAmortizationSchedule()` - Full payment schedule
- `calculateDebtRatio()` - Debt-to-income ratio
- `calculateCountdown()` - Time to debt freedom
- `simulateExtraMonthlyPayment()` - Impact of extra payments
- `generateInsights()` - Actionable recommendations
- `calculateTotalMetrics()` - Aggregate metrics

### Frontend Utilities (client/src/utils/calculations.js)

Mirror of backend logic for client-side calculations.

## 🎨 UI Components

### WidgetComponent
Main lock-screen style widget showing:
- Large countdown timer
- Monthly EMI
- Color-coded debt ratio
- Key financial insight

### Pages
- `HomePage` - Landing page with features
- `LoginPage` - User authentication
- `SignupPage` - Account creation
- `DashboardPage` - Main dashboard
- `LoansPage` - Loan list management
- `AddEditLoanPage` - Create/edit loans

## 📝 License

MIT License - Feel free to use this project for personal or commercial use.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

For issues or questions:
- Check troubleshooting section above
- Review API documentation
- Check component prop types
- Review error logs

---

**Made with ❤️ for Financial Freedom**

Start your countdown to debt freedom today! 🚀
