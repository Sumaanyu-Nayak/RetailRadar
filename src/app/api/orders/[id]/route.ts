import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Order } from '@/models';

async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    
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

    const { id } = params;

    // Find the order
    const order = await Order.findById(id)
      .populate('customer', 'name email')
      .populate('items.product', 'name imageUrl')
      .lean();

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this order
    const orderObj = order as { customer?: { _id: { toString(): string } } };
    if (decoded.role === 'customer' && orderObj.customer && 
        orderObj.customer._id.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export { GET };
