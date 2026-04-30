/**
 * DATABASE SEEDING SCRIPT
 * Populates database with sample data for testing
 * Run: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Loan = require('../src/models/Loan');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/countdown';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Loan.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create demo user
        const demoUser = await User.create({
            name: 'Demo User',
            email: 'demo@countdown.com',
            password: 'demo123456',
            monthlyIncome: 100000,
            currency: 'INR',
        });
        console.log('✅ Created demo user:', demoUser.email);

        // Create sample loans
        const loans = await Loan.create([
            {
                userId: demoUser._id,
                name: 'Home Loan',
                type: 'home',
                principal: 5000000,
                remainingBalance: 4200000,
                annualInterestRate: 6.5,
                loanTenureMonths: 240,
                remainingMonths: 180,
                startDate: new Date('2022-01-15'),
                notes: 'Primary residence',
            },
            {
                userId: demoUser._id,
                name: 'Car Loan',
                type: 'auto',
                principal: 1500000,
                remainingBalance: 900000,
                annualInterestRate: 8.5,
                loanTenureMonths: 60,
                remainingMonths: 36,
                startDate: new Date('2022-06-01'),
                notes: 'Toyota Fortuner',
            },
            {
                userId: demoUser._id,
                name: 'Education Loan',
                type: 'education',
                principal: 500000,
                remainingBalance: 350000,
                annualInterestRate: 7.0,
                loanTenureMonths: 120,
                remainingMonths: 90,
                startDate: new Date('2021-08-20'),
                notes: 'MBA course',
            },
            {
                userId: demoUser._id,
                name: 'Personal Loan',
                type: 'personal',
                principal: 300000,
                remainingBalance: 150000,
                annualInterestRate: 12.5,
                loanTenureMonths: 48,
                remainingMonths: 24,
                startDate: new Date('2023-01-10'),
                notes: 'Wedding expenses',
            },
        ]);

        console.log(`✅ Created ${loans.length} sample loans`);

        // Create additional users
        const users = await User.create([
            {
                name: 'Alice Johnson',
                email: 'alice@countdown.com',
                password: 'alice123456',
                monthlyIncome: 75000,
                currency: 'INR',
            },
            {
                name: 'Bob Smith',
                email: 'bob@countdown.com',
                password: 'bob123456',
                monthlyIncome: 150000,
                currency: 'INR',
            },
        ]);

        console.log(`✅ Created ${users.length} additional users`);

        // Create loans for Alice
        await Loan.create({
            userId: users[0]._id,
            name: 'Home Loan',
            type: 'home',
            principal: 3000000,
            remainingBalance: 2500000,
            annualInterestRate: 6.8,
            loanTenureMonths: 180,
            remainingMonths: 140,
            startDate: new Date('2021-06-01'),
        });

        console.log('✅ Database seeding completed successfully!');
        console.log('');
        console.log('📝 Demo Credentials:');
        console.log('   Email: demo@countdown.com');
        console.log('   Password: demo123456');
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();
