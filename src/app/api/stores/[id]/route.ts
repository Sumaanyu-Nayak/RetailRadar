import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Store from '@/models/Store';
import Product from '@/models/Product';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { storeSchema } from '@/lib/validations';

// GET /api/stores/[id] - Get store by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const store = await Store.findById(id)
      .populate('owner', 'name email');
    
    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ store }, { status: 200 });
  } catch (error) {
    console.error('Get store error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/stores/[id] - Update store (owner only)
export const PUT = withAuth(async (
  request: AuthenticatedRequest,
  context?: { params: Promise<Record<string, string>> }
) => {
  try {
    await dbConnect();
    
    const params = await context?.params;
    const storeId = params?.id;
    if (!storeId) {
      return NextResponse.json({ error: 'Store ID required' }, { status: 400 });
    }
    
    const store = await Store.findById(storeId);
    
    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the owner
    if (store.owner.toString() !== request.user?.userId) {
      return NextResponse.json(
        { error: 'Not authorized to update this store' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const validatedData = storeSchema.parse(body);
    
    const updatedStore = await Store.findByIdAndUpdate(
      storeId,
      validatedData,
      { new: true, runValidators: true }
    ).populate('owner', 'name email');
    
    return NextResponse.json(
      { message: 'Store updated successfully', store: updatedStore },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Update store error:', error);
    
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

// DELETE /api/stores/[id] - Delete store (owner only)
export const DELETE = withAuth(async (
  request: AuthenticatedRequest,
  context?: { params: Promise<Record<string, string>> }
) => {
  try {
    await dbConnect();
    
    const params = await context?.params;
    const storeId = params?.id;
    if (!storeId) {
      return NextResponse.json({ error: 'Store ID required' }, { status: 400 });
    }
    
    const store = await Store.findById(storeId);
    
    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the owner
    if (store.owner.toString() !== request.user?.userId) {
      return NextResponse.json(
        { error: 'Not authorized to delete this store' },
        { status: 403 }
      );
    }
    
    // Delete all products associated with this store
    await Product.deleteMany({ store: storeId });
    
    // Delete the store
    await Store.findByIdAndDelete(storeId);
    
    return NextResponse.json(
      { message: 'Store and associated products deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete store error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
