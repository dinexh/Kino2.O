import { connectDB } from '../config/db';
import User from '../model/users';

async function clearUsers() {
    try {
        await connectDB();
        await User.deleteMany({});
        console.log('All users have been cleared from the database');
        process.exit(0);
    } catch (error) {
        console.error('Error clearing users:', error);
        process.exit(1);
    }
}

clearUsers(); 