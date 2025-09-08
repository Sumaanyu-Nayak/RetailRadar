import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Store from '@/models/Store';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

// GET /api/products/my - Get current user's products
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    await dbConnect();
    
    if (request.user?.role !== 'store_owner') {
      return NextResponse.json(
        { error: 'Only store owners can access this endpoint' },
        { status: 403 }
      );
    }
    
    // Get all stores owned by the user
    const userStores = await Store.find({ owner: request.user.userId }).select('_id');
    const storeIds = userStores.map(store => store._id);
    
    // Get products from all user's stores
    const products = await Product.find({ store: { $in: storeIds } })
      .populate('store', 'name locality')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Get my products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
