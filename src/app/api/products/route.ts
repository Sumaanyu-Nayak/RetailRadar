import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, Store, Product } from '@/models';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { productSchema } from '@/lib/validations';

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Ensure all models are registered
    void User;
    void Store;
    
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('store');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    
    const query: Record<string, unknown> = { isAvailable: true };
    
    if (storeId) {
      query.store = storeId;
    }
    
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const products = await Product.find(query)
      .populate('store', 'name locality address')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a product (store owners only)
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    await dbConnect();
    
    if (request.user?.role !== 'store_owner') {
      return NextResponse.json(
        { error: 'Only store owners can create products' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { storeId, ...productData } = body;
    
    // Verify that the store belongs to the user
    const store = await Store.findOne({
      _id: storeId,
      owner: request.user.userId,
    });
    
    if (!store) {
      return NextResponse.json(
        { error: 'Store not found or not authorized' },
        { status: 404 }
      );
    }
    
    const validatedData = productSchema.parse(productData);
    
    const product = await Product.create({
      ...validatedData,
      store: storeId,
    });
    
    const populatedProduct = await Product.findById(product._id)
      .populate('store', 'name locality address');
    
    return NextResponse.json(
      { message: 'Product created successfully', product: populatedProduct },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Create product error:', error);
    
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
