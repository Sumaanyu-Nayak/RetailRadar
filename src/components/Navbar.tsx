'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Store, User, LogOut, ShoppingBag, Package } from 'lucide-react';
import CartDropdown from './CartDropdown';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Store className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">RetailRadar</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/stores" 
              className="text-gray-700 hover:text-blue-600 flex items-center space-x-1"
            >
              <Store className="h-4 w-4" />
              <span>Stores</span>
            </Link>
            <Link 
              href="/products" 
              className="text-gray-700 hover:text-blue-600 flex items-center space-x-1"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Products</span>
            </Link>
            {user && user.role === 'customer' && (
              <Link 
                href="/orders" 
                className="text-gray-700 hover:text-blue-600 flex items-center space-x-1"
              >
                <Package className="h-4 w-4" />
                <span>My Orders</span>
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart Dropdown - only show for customers */}
            {user && user.role === 'customer' && (
              <CartDropdown />
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {user.name}
                  {user.role === 'store_owner' && (
                    <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Store Owner
                    </span>
                  )}
                </span>
                
                {user.role === 'store_owner' && (
                  <Link
                    href="/dashboard"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 flex items-center space-x-1"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
