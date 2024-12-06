import { NextResponse } from 'next/server';

export async function POST(request) {
  // For demo purposes, accept any login
  return NextResponse.json({
    token: "demo-token",
    user: {
      id: "demo-user",
      username: "demo",
      role: "admin"
    }
  });
} 