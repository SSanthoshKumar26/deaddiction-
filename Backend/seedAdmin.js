const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB for seeding...');

        const adminEmail = 'admin@gmail.com';
        const adminPassword = 'sober@2113';

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('ℹ️ Admin user already exists. Updating password and role...');
            existingAdmin.password = adminPassword;
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('✅ Admin user updated successfully.');
        } else {
            const admin = await User.create({
                name: 'Admin User',
                email: adminEmail,
                mobile: '9751055190',
                password: adminPassword,
                role: 'admin'
            });
            console.log('✅ Admin user created successfully.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
        process.exit(1);
    }
};

seedAdmin();
