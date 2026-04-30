# ⚡ Quick Reference Guide

Quick commands and code snippets for development.

## 🚀 Start Application

```bash
# Terminal 1: Backend
cd countdown/server
npm run dev:local

# Terminal 2: Frontend  
cd countdown/client
npm run dev:local

# Terminal 3 (Optional): MongoDB
mongod
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001
- Demo Login: demo@countdown.com / demo123456

## 📦 Install Dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd client && npm install
```

## 🗄️ Database

```bash
# Seed database with demo data
cd server && npm run seed

# Check MongoDB
mongod --version

# Connect to MongoDB
mongosh
use countdown
db.users.find()
db.loans.find()
```

## 🔐 Authentication

### Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@countdown.com","password":"demo123456"}'
```

### Get Profile
```bash
curl -X GET http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 💳 Loans API

### Get All Loans
```bash
curl -X GET http://localhost:5001/api/loans \
  -H "Authorization: Bearer TOKEN"
```

### Create Loan
```bash
curl -X POST http://localhost:5001/api/loans \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Home Loan",
    "type": "home",
    "principal": 5000000,
    "remainingBalance": 4200000,
    "annualInterestRate": 6.5,
    "loanTenureMonths": 240,
    "remainingMonths": 180,
    "startDate": "2022-01-15"
  }'
```

### Get Dashboard
```bash
curl -X GET http://localhost:5001/api/loans/analytics/dashboard \
  -H "Authorization: Bearer TOKEN"
```

### Simulate Payment
```bash
curl -X POST http://localhost:5001/api/loans/LOAN_ID/simulate \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "paymentType": "monthly"
  }'
```

## 🧮 Calculation Functions

### Frontend (client/src/utils/calculations.js)
```javascript
import { 
  calculateEMI, 
  calculateDebtRatio, 
  calculateCountdown, 
  formatCurrency 
} from './utils/calculations';

// Calculate EMI
const emi = calculateEMI(500000, 12, 48);
// Result: 12,400 (approx)

// Calculate debt ratio
const ratio = calculateDebtRatio(50000, 100000);
// Result: { ratio: 50, percentage: "50%", status: "caution", color: "yellow" }

// Calculate countdown
const countdown = calculateCountdown(36);
// Result: { years: 3, months: 0, days: 0, formatted: "3y 0m 0d" }

// Format currency
const formatted = formatCurrency(1000000, "INR");
// Result: "₹10,00,000"
```

### Backend (server/src/services/financialService.js)
```javascript
const {
  calculateEMI,
  generateAmortizationSchedule,
  calculateDebtRatio,
  calculateCountdown,
  generateInsights,
} = require('./services/financialService');

// Same functions, used server-side
```

## 🎨 Component Usage

### Widget Component
```jsx
import WidgetComponent from './components/WidgetComponent';

<WidgetComponent 
  dashboard={dashboardData} 
  isLoading={loading} 
/>
```

### Private Route
```jsx
import PrivateRoute from './components/PrivateRoute';

<Route path="/dashboard" element={
  <PrivateRoute>
    <DashboardPage />
  </PrivateRoute>
} />
```

## 📁 File Locations

| What | Location |
|------|----------|
| Backend entry | `server/src/index.js` |
| Backend models | `server/src/models/` |
| Backend routes | `server/src/routes/` |
| Backend logic | `server/src/services/` |
| Frontend entry | `client/src/main.jsx` |
| Frontend app | `client/src/App.jsx` |
| Frontend pages | `client/src/pages/` |
| Frontend components | `client/src/components/` |
| API service | `client/src/services/api.js` |
| Calculations | `client/src/utils/calculations.js` |
| Styles | `client/src/index.css` |
| Config | `client/vite.config.js` |

## 🔧 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://127.0.0.1:27017/countdown
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
PORT=5001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## 🧪 Testing Checklist

- [ ] Signup with new email
- [ ] Login with credentials
- [ ] View dashboard
- [ ] Add new loan
- [ ] See EMI calculated
- [ ] See debt ratio update
- [ ] View all loans
- [ ] Edit loan
- [ ] Delete loan
- [ ] Logout and re-login
- [ ] Check calculations match

## 🐛 Debug Commands

```bash
# Check node processes
lsof -i :5001        # Backend
lsof -i :5173        # Frontend
lsof -i :27017       # MongoDB

# Kill process
kill -9 <PID>

# Check npm versions
node --version
npm --version

# Clear cache
npm cache clean --force

# Check npm registry
npm config get registry

# View logs
npm run dev:local 2>&1 | tee app.log
```

## 📊 Key Formulas

### EMI Calculation
```
EMI = (P × r × (1 + r)^n) / ((1 + r)^n - 1)
P = Principal
r = Monthly interest rate (annual/12/100)
n = Number of months
```

### Debt Ratio
```
Debt Ratio = (Total Monthly EMI / Monthly Income) × 100
Result ≤ 30% = Green (Safe)
Result 30-50% = Yellow (Caution)
Result > 50% = Red (Risk)
```

### Remaining Balance (after payment)
```
Remaining = Current Balance - Principal Payment
Where: Principal Payment = EMI - Interest for month
```

## 🎯 Common Tasks

### Add a new API endpoint
1. Create route in `server/src/routes/`
2. Create controller in `server/src/controllers/`
3. Add to `server/src/index.js`
4. Test with curl
5. Add frontend service in `client/src/services/api.js`
6. Use in component

### Add a new component
1. Create component in `client/src/components/`
2. Export from component file
3. Import in page/parent component
4. Pass props and use

### Change database
1. Stop server
2. Update `MONGO_URI` in `.env`
3. Run `npm run seed` (optional)
4. Restart server

### Add new calculation
1. Add function to `server/src/services/financialService.js`
2. Add mirror function to `client/src/utils/calculations.js`
3. Export both
4. Use where needed

## 📱 Widget Customization

Change widget colors in `WidgetComponent.jsx`:
```javascript
const ratioColors = {
  green: { bg: 'bg-emerald-900/40', ... },
  yellow: { bg: 'bg-amber-900/40', ... },
  red: { bg: 'bg-red-900/40', ... },
};
```

Change animations in Framer Motion props:
```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
/>
```

## 🚨 Error Handling

### Backend Errors
```javascript
try {
  // Do something
} catch (error) {
  return res.status(500).json({
    success: false,
    message: 'Error description',
    error: error.message
  });
}
```

### Frontend Errors
```javascript
try {
  await loansAPI.getLoans();
} catch (error) {
  setError(error.response?.data?.message || 'Failed to load');
}
```

## 🔒 Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use HTTPS in production
- [ ] Set CORS_ORIGIN correctly
- [ ] Hash passwords (bcryptjs)
- [ ] Validate all inputs
- [ ] Check authentication on protected routes
- [ ] Rate limiting configured
- [ ] CORS headers set
- [ ] Sensitive data not logged

## 📈 Performance Tips

- Cache API responses when possible
- Use React.memo for component optimization
- Lazy load components
- Optimize database queries with indexes
- Minimize bundle size
- Use CDN for static assets
- Enable gzip compression

## 🎓 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

## ✨ Quick Wins

```javascript
// Add loading spinner
const Loading = () => (
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
);

// Format currency
const price = formatCurrency(1000000, "INR"); // ₹10,00,000

// Format number
const count = formatNumber(50000); // 50,000

// Countdown
const cd = calculateCountdown(36); // 3y 0m 0d
```

---

**Print this page for quick reference while developing!** 📄
