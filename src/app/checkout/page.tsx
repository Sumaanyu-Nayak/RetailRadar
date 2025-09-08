'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { User, MapPin, CreditCard, Truck, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { state, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    locality: '',
    pincode: '',
    phone: '',
    instructions: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Redirect if not logged in as customer
  React.useEffect(() => {
    if (!user || user.role !== 'customer') {
      router.push('/auth/login');
      return;
    }
    
    if (state.items.length === 0) {
      router.push('/products');
      return;
    }
  }, [user, state.items, router]);

  // Group items by store for delivery calculation
  const itemsByStore = state.items.reduce((acc, item) => {
    const storeId = item.store._id;
    if (!acc[storeId]) {
      acc[storeId] = {
        store: item.store,
        items: [],
        subtotal: 0
      };
    }
    acc[storeId].items.push(item);
    acc[storeId].subtotal += item.price * item.quantity;
    return acc;
  }, {} as Record<string, { store: { _id: string; name: string; address: string }; items: Array<{ _id: string; name: string; price: number; quantity: number; store: { _id: string; name: string; address: string } }>; subtotal: number }>);

  const deliveryFee = 0; // Free delivery for college stores
  const totalAmount = state.total + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare order data to match API expectations
      const orderData = {
        items: state.items.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        deliveryAddress: {
          name: user?.name || '',
          address: deliveryInfo.address,
          locality: deliveryInfo.locality,
          pincode: deliveryInfo.pincode,
          phone: deliveryInfo.phone
        },
        paymentMethod: paymentMethod === 'cod' ? 'cash' : paymentMethod,
        notes: deliveryInfo.instructions
      };

      console.log('Sending order data:', orderData);
      console.log('Token:', localStorage.getItem('auth-token') ? 'Present' : 'Missing');

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth-token')}`
        },
        body: JSON.stringify(orderData)
      });

      console.log('Checkout API response status:', response.status);
      console.log('Checkout API response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Response ok:', response.ok);

      if (response.status === 0 || response.status === 404) {
        throw new Error('API endpoint not found. Please check if the server is running.');
      }

      const contentType = response.headers.get('content-type');
      console.log('Content type:', contentType);
      
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        console.log('Checkout API result:', result);

        if (!response.ok) {
          throw new Error(result.error || `Server returned ${response.status}: ${response.statusText}`);
        }

        // Clear cart and redirect to success page
        clearCart();
        router.push(`/orders/${result.order._id}?success=true`);
      } else {
        const textResponse = await response.text();
        console.error('Non-JSON response from checkout API:', textResponse);
        console.error('Response status:', response.status);
        console.error('Response status text:', response.statusText);
        throw new Error(`Server returned an invalid response (${response.status}): ${response.statusText || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || state.items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold">Customer Information</h2>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-medium">{user.name}</p>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold">Delivery Address</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Address *
                    </label>
                    <textarea
                      required
                      value={deliveryInfo.address}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Room/Flat, Building, Street"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Locality *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryInfo.locality}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, locality: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Area, Sector"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryInfo.pincode}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, pincode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123456"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={deliveryInfo.phone}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+91 9999999999"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    value={deliveryInfo.instructions}
                    onChange={(e) => setDeliveryInfo({...deliveryInfo, instructions: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Any specific instructions for delivery"
                  />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold">Payment Method</h2>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-sm text-gray-600">Pay when your order arrives</div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 opacity-50">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    disabled
                    className="mr-3"
                  />
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <div className="font-medium">Online Payment</div>
                      <div className="text-sm text-gray-600">Coming soon - Card/UPI/Wallet</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {/* Items by Store */}
              <div className="space-y-4 mb-6">
                {Object.values(itemsByStore).map(({ store, items, subtotal }) => (
                  <div key={store._id} className="border-b pb-4">
                    <h4 className="font-medium text-gray-900 mb-2">{store.name}</h4>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item._id} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm font-medium mt-2 pt-2 border-t">
                      <span>Store Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{state.total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  loading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>

              <div className="text-xs text-gray-500 text-center mt-3">
                By placing this order, you agree to our terms and conditions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
