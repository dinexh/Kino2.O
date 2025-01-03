import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        console.log('Initiating database connection...');
        const db = await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            maxPoolSize: 10,
            minPoolSize: 5,
            maxIdleTimeMS: 10000,
            retryWrites: true,
            retryReads: true,
            w: 'majority'
        });

        isConnected = db.connections[0].readyState;
        console.log('Database connection state:', isConnected);
        console.log('Database connected successfully to:', db.connection.host);

        // Handle connection errors
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            console.error('Error details:', {
                name: err.name,
                message: err.message,
                stack: err.stack
            });
            if (!isConnected) {
                throw err;
            }
        });

        // Handle disconnection
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            isConnected = false;
        });

        // Handle process termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

        return db;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        isConnected = false;
        // Retry connection after 5 seconds
        setTimeout(() => {
            console.log('Retrying MongoDB connection...');
            connectDB();
        }, 5000);
        throw error;
    }
};

export default connectDB;