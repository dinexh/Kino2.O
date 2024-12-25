import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (payload) => {
    try {
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
        console.log('JWT token generated successfully');
        return token;
    } catch (error) {
        console.error('Error generating JWT token:', error);
        throw error;
    }
};

export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('JWT token verified successfully');
        return decoded;
    } catch (error) {
        console.error('JWT verification error:', error.message);
        return null;
    }
};

export const generateAuthToken = (user) => {
    try {
        const payload = {
            id: user.id || user._id,
            email: user.email,
            role: user.role
        };
        console.log('Generating auth token for user:', user.email);
        return generateToken(payload);
    } catch (error) {
        console.error('Error generating auth token:', error);
        throw error;
    }
}; 