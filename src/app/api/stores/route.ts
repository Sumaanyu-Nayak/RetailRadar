import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, Store } from '@/models';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { storeSchema } from '@/lib/validations';

// GET /api/stores - Get all stores
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Ensure User model is registered
    void User;
    
    const { searchParams } = new URL(request.url);
    const locality = searchParams.get('locality');
    const search = searchParams.get('search');
    
    const query: Record<string, unknown> = { isActive: true };
    
    if (locality) {
      query.locality = { $regex: locality, $options: 'i' };
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const stores = await Store.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true,
      stores 
    }, { status: 200 });
  } catch (error) {
    console.error('Get stores error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/stores - Create a store (store owners only)
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    await dbConnect();
    
    if (request.user?.role !== 'store_owner') {
      return NextResponse.json(
        { error: 'Only store owners can create stores' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const validatedData = storeSchema.parse(body);
    
    const store = await Store.create({
      ...validatedData,
      owner: request.user.userId,
    });
    
    const populatedStore = await Store.findById(store._id)
      .populate('owner', 'name email');
    
    return NextResponse.json(
      { message: 'Store created successfully', store: populatedStore },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Create store error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      const zodError = error as unknown as { errors: unknown[] };
      return NextResponse.json(
        { error: 'Validation failed', details: zodError.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
