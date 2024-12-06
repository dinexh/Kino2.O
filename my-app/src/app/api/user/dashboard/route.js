import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get user ID from query params or headers
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not provided' },
        { status: 400 }
      );
    }

    // Get user data from Firebase
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    
    return NextResponse.json({
      name: userData.name,
      paymentId: userData.paymentId,
      ticketStatus: userData.ticketStatus,
      eventDate: userData.eventDate,
      // Add any other fields you need
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
} 