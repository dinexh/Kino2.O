import mysql from "mysql2/promise";

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
    throw new Error('Database configuration missing in environment variables');
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function query(sql: string, values?: any[]) {
    try {
        const [results] = await pool.execute(sql, values);
        return results;
    } catch (error) {
        console.error('Database query error:', {
            sql,
            error: error.message
        });
        throw error;
    }
}

export async function getConnection() {
    return await pool.getConnection();
}

// Test the connection on startup
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('Failed to connect to database:', err);
    });

export default pool;