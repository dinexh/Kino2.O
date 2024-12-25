import mongoose from 'mongoose';
import User from '../model/users.js';
import connectDB from '../config/db.js';

const users = [
    {
        email: 'admin@chitramela.com',
        password: 'Admin@123',
        role: 'superuser'
    },
    {
        email: 'user@chitramela.com',
        password: 'User@123',
        role: 'user'
    }
];

async function addUsers() {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log('Connected to MongoDB');

        // Add each user
        for (const userData of users) {
            const existingUser = await User.findOne({ email: userData.email });
            
            if (existingUser) {
                console.log(`User ${userData.email} already exists`);
                continue;
            }

            const user = new User(userData);
            await user.save();
            console.log(`Added user: ${userData.email} with role: ${userData.role}`);
        }

        console.log('Initial users added successfully');
    } catch (error) {
        console.error('Error adding users:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    }
}

// Run the function
addUsers(); 