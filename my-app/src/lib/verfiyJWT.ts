import { cookies } from 'next/headers'
import { jwtVerify } from "jose";

export const verifyJWT = async () => {
    try {
        const cookieStore = cookies()
        const JWT = cookieStore.get('jwt')?.value;

        if (!JWT) {
            return { valid: false, reason: 'JWT missing' };
        }

        const { payload } = await jwtVerify(
            JWT,
            new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET),
            {
                algorithms: ['HS256'],
            }
        );

        console.log('payload', payload)

        if (payload) {            
            return { valid: true, payload: payload };
        } else {
            return { valid: false, reason: 'Invalid JWT' };
        }
    } catch (error) {
        return { valid: false, reason: 'Verification error' };
    }
}