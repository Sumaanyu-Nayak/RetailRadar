'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowLeft, ShoppingBag, MapPin, Phone, Mail, Store, Package, Tag } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
  store: {
    _id: string;
    name: string;
    description: string;
    locality: string;
    address: string;
    phone: string;
    email: string;
  };
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <Link href="/products" className="text-blue-600 hover:text-blue-800">
            ← Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          href="/products"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <ShoppingBag className="h-32 w-32 text-gray-400" />
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">₹{product.price}</div>
                  <div className="text-sm text-gray-500">Price</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                </div>
                <div className="flex items-center">
                  <Package className="h-4 w-4 mr-2 text-gray-500" />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.stock > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            </div>

            {/* Store Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Available at</h3>
                <Store className="h-6 w-6 text-blue-600" />
              </div>

              <div className="space-y-4">
                <div>
                  <Link 
                    href={`/stores/${product.store._id}`}
                    className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {product.store.name}
                  </Link>
                  <p className="text-gray-600 mt-1">{product.store.description}</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{product.store.locality}</p>
                      <p className="text-sm text-gray-600">{product.store.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" />
                    <a 
                      href={`tel:${product.store.phone}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {product.store.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-gray-500 flex-shrink-0" />
                    <a 
                      href={`mailto:${product.store.email}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {product.store.email}
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Link
                    href={`/stores/${product.store._id}`}
                    className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Store className="h-4 w-4 mr-2" />
                    View Store & More Products
                  </Link>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to buy?</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> This is a listing service. Contact the store directly to purchase this item.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`tel:${product.store.phone}`}
                  className="flex-1 bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors text-center font-medium"
                >
                  Call Store Now
                </a>
                <a
                  href={`mailto:${product.store.email}?subject=Inquiry about ${product.name}`}
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors text-center font-medium"
                >
                  Email Store
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
