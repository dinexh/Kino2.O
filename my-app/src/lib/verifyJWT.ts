import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface JWTPayload {
  role: string;
  [key: string]: any;
}

export async function verifyJWT() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('JWT')?.value;

  if (!token) {
    return { valid: false, payload: null };
  }

  try {
    const secret = process.env.JWT_SECRET || '';
    const payload = jwt.verify(token, secret) as JWTPayload;
    return { valid: true, payload };
  } catch (error) {
    return { valid: false, payload: null };
  }
} 