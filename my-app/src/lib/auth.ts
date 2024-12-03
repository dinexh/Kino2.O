import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

interface TokenPayload {
    id: number;
    username: string;
    email: string;
    role: 'SuperAdmin' | 'Admin' | 'RegisteredUser';
}

export const createToken = (payload: TokenPayload): string => {
    // Create access token
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    return accessToken;
};

export const createRefreshToken = (payload: TokenPayload): string => {
    // Create refresh token with longer expiry
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const verifyToken = async (token: string): Promise<TokenPayload> => {
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

export const verifyRefreshToken = async (token: string): Promise<TokenPayload> => {
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
        return decoded;
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
}; 