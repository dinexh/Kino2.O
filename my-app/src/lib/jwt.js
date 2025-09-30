import jwt from 'jsonwebtoken';

const getJWTSecret = () => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return JWT_SECRET;
};

export function sign(payload, options = {}) {
    return jwt.sign(payload, getJWTSecret(), options);
}

export function verify(token) {
    return jwt.verify(token, getJWTSecret());
}

export function generateAccessToken(payload) {
    try {
        return jwt.sign(payload, getJWTSecret(), { 
            expiresIn: '10m', // 10 minutes
            algorithm: 'HS256'
        });
    } catch (error) {
        console.error('Access token generation error:', error);
        throw error;
    }
}

export function generateRefreshToken(payload) {
    try {
        return jwt.sign(payload, getJWTSecret(), { 
            expiresIn: '30m', // 30 minutes
            algorithm: 'HS256'
        });
    } catch (error) {
        console.error('Refresh token generation error:', error);
        throw error;
    }
}

export async function verifyAuthToken(token) {
    try {
        return jwt.verify(token, getJWTSecret());
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

export async function refreshAccessToken(refreshToken) {
    try {
        const decoded = jwt.verify(refreshToken, getJWTSecret());
        // Generate new access token with user data from refresh token
        const accessToken = generateAccessToken({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        });
        return { accessToken };
    } catch (error) {
        console.error('Token refresh error:', error);
        return null;
    }
} 