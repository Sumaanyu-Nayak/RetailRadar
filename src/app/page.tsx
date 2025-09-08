'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Store, ShoppingBag, Users, MapPin } from 'lucide-react';

interface Store {
  _id: string;
  name: string;
  description: string;
  locality: string;
  address: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  store: {
    name: string;
    locality: string;
  };
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locality, setLocality] = useState('');
  const [featuredStores, setFeaturedStores] = useState<Store[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedData();
  }, []);

  const fetchFeaturedData = async () => {
    try {
      const [storesResponse, productsResponse] = await Promise.all([
        fetch('/api/stores?limit=6'),
        fetch('/api/products?limit=8')
      ]);

      const storesData = await storesResponse.json();
      const productsData = await productsResponse.json();

      if (storesData.success) {
        setFeaturedStores(storesData.stores);
      }
      if (productsData.success) {
        setFeaturedProducts(productsData.products);
      }
    } catch (error) {
      console.error('Error fetching featured data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (locality) params.set('locality', locality);
    
    window.location.href = `/products?${params.toString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            College Retail Hub
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Discover all campus shops in one place - from groceries and stationery to 
            laundry services, OAC snacks, and FC restaurant meals
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg p-4 shadow-lg">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search for products, services, or shops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:w-64">
                <input
                  type="text"
                  placeholder="Location on campus"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-4 py-3 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Search size={20} />
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <Store className="mx-auto text-blue-600 mb-4" size={48} />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">5+ Campus Shops</h3>
              <p className="text-gray-600">
                All your college shops in one convenient platform
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <ShoppingBag className="mx-auto text-green-600 mb-4" size={48} />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">100+ Products & Services</h3>
              <p className="text-gray-600">
                From groceries to laundry, everything you need
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <Users className="mx-auto text-purple-600 mb-4" size={48} />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Student Focused</h3>
              <p className="text-gray-600">
                Designed specifically for college community needs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Stores */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Campus Shops</h2>
            <p className="text-xl text-gray-600">Explore our college retail partners</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredStores.map((store) => (
              <Link
                key={store._id}
                href={`/stores/${store._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{store.name}</h3>
                  <p className="text-gray-600 mb-4">{store.description}</p>
                  <div className="flex items-center text-gray-500">
                    <MapPin size={16} className="mr-2" />
                    <span className="text-sm">{store.address}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/stores"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Shops
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Popular Items</h2>
            <p className="text-xl text-gray-600">Most loved products and services by students</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <ShoppingBag size={64} className="text-gray-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">₹{product.price}</span>
                    <span className="text-sm text-gray-500">{product.store.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who use College Retail Hub for all their campus shopping needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Start Shopping
            </Link>
            <Link
              href="/auth/register"
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
            >
              Join as Seller
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}