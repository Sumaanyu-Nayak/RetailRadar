import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Store from '@/models/Store';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { productSchema } from '@/lib/validations';

// GET /api/products/[id] - Get product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const product = await Product.findById(id)
      .populate('store', 'name locality address phone email');
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product (store owner only)
export const PUT = withAuth(async (
  request: AuthenticatedRequest,
  context?: { params: Promise<Record<string, string>> }
) => {
  try {
    await dbConnect();
    
    const params = await context?.params;
    const productId = params?.id;
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }
    
    const product = await Product.findById(productId).populate('store');
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns the store
    const store = await Store.findOne({
      _id: product.store._id,
      owner: request.user?.userId,
    });
    
    if (!store) {
      return NextResponse.json(
        { error: 'Not authorized to update this product' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const validatedData = productSchema.parse(body);
    
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      validatedData,
      { new: true, runValidators: true }
    ).populate('store', 'name locality address');
    
    return NextResponse.json(
      { message: 'Product updated successfully', product: updatedProduct },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Update product error:', error);
    
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

// DELETE /api/products/[id] - Delete product (store owner only)
export const DELETE = withAuth(async (
  request: AuthenticatedRequest,
  context?: { params: Promise<Record<string, string>> }
) => {
  try {
    await dbConnect();
    
    const params = await context?.params;
    const productId = params?.id;
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }
    
    const product = await Product.findById(productId).populate('store');
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns the store
    const store = await Store.findOne({
      _id: product.store._id,
      owner: request.user?.userId,
    });
    
    if (!store) {
      return NextResponse.json(
        { error: 'Not authorized to delete this product' },
        { status: 403 }
      );
    }
    
    await Product.findByIdAndDelete(productId);
    
    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
