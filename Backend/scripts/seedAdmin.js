const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
dotenv.config();

const seedAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const adminEmail = 'admin@gmail.com';
        const adminPassword = 'sober@2113';

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('⚠️ Admin user already exists');
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('🔄 Updated existing user role to admin');
            }
        } else {
            const newAdmin = new User({
                name: 'System Admin',
                email: adminEmail,
                password: adminPassword, // Plain text, model will hash it
                mobile: '9999999999',
                role: 'admin'
            });

            await newAdmin.save();
            console.log('🚀 Admin user created successfully');
        }

        process.exit();
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
