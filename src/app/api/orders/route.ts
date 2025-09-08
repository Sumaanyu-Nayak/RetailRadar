import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import { User, Store, Product, Order } from '@/models';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    console.log('Orders API GET called');
    
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid auth header found');
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    console.log('Token extracted:', token ? 'Yes' : 'No');
    
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      console.log('Token decoded successfully:', decoded.userId);
    } catch {
      console.log('Token verification failed');
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    await dbConnect();
    console.log('Database connected');
    
    // Ensure models are registered
    void User;
    void Store;
    void Product;

    const orders = await Order.find({ customer: decoded.userId })
      .populate('customer', 'name email')
      .populate('items.product', 'name imageUrl')
      .sort({ createdAt: -1 })
      .limit(20);

    console.log('Orders found:', orders.length);
    return NextResponse.json(orders);
    
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    console.log('Orders API POST called');
    
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    let decoded: { userId: string; email: string; role: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string; role: string };
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    await dbConnect();
    void Product;

    const body = await request.json();
    const { items, deliveryAddress, paymentMethod, notes } = body;

    console.log('Order request body:', body);

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    if (!deliveryAddress || !deliveryAddress.phone || !deliveryAddress.address) {
      return NextResponse.json(
        { error: 'Complete delivery address is required' },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method is required' },
        { status: 400 }
      );
    }

    // Verify products exist and calculate total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });

      // Update product stock
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Generate order number
    const orderNumber = `ORD${Date.now()}`;

    // Create order
    const order = await Order.create({
      orderNumber,
      customer: decoded.userId,
      items: orderItems,
      totalAmount: total,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
      notes,
      status: 'pending'
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('items.product', 'name imageUrl');

    console.log('Order created successfully:', order._id);

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      order: populatedOrder
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
