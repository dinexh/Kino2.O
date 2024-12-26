import mongoose from 'mongoose';

const MONGODB_URI = /*process.env.MONGODB_URI ||*/ "mongodb+srv://pavankarthik107:kar188123@cluster0.atnjd.mongodb.net/chitramela?retryWrites=true&w=majority&appName=Cluster0" /*|| "mongodb://127.0.0.1:27017/chitramela"*/;

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
        const db = await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
            socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
            connectTimeoutMS: 30000, // Connection timeout
            maxPoolSize: 10, // Maximum number of connections in the pool
            minPoolSize: 5, // Minimum number of connections in the pool
            maxIdleTimeMS: 10000, // Maximum time a connection can remain idle
            retryWrites: true,
            retryReads: true,
            w: 'majority'
        });

        isConnected = db.connections[0].readyState;
        console.log('New database connection established');

        // Handle connection errors
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
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