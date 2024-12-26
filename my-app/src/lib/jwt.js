import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
}

export function generateAuthToken(payload) {
    try {
        return jwt.sign(payload, JWT_SECRET, { 
            expiresIn: '24h',
            algorithm: 'HS256'
        });
    } catch (error) {
        console.error('Token generation error:', error);
        throw error;
    }
}

export async function verifyAuthToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            console.error('Invalid token:', error.message);
        } else if (error.name === 'TokenExpiredError') {
            console.error('Token expired');
        } else {
            console.error('Token verification error:', error);
        }
        return null;
    }
} 