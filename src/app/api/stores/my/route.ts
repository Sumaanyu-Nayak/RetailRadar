import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Store from '@/models/Store';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

// GET /api/stores/my - Get current user's stores
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    await dbConnect();
    
    if (request.user?.role !== 'store_owner') {
      return NextResponse.json(
        { error: 'Only store owners can access this endpoint' },
        { status: 403 }
      );
    }
    
    const stores = await Store.find({ owner: request.user.userId })
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ stores }, { status: 200 });
  } catch (error) {
    console.error('Get my stores error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
