import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../model/users.js';

async function clearUsers() {
    try {
        await connectDB();
        console.log('Connected to MongoDB');
        await User.deleteMany({});
        console.log('All users have been cleared from the database');
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error clearing users:', error);
        process.exit(1);
    }
}

clearUsers(); 