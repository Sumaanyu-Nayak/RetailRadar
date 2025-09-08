// Simple script to clear orders collection for testing
// Run this once if you're having issues with old order schema

import dbConnect from '../src/lib/mongodb';
import mongoose from 'mongoose';

async function clearOrders() {
  try {
    await dbConnect();
    
    // Drop the orders collection to start fresh with new schema
    const db = mongoose.connection.db;
    await db.collection('orders').drop();
    
    console.log('Orders collection dropped successfully');
  } catch (error) {
    console.log('Error dropping orders collection (might not exist):', error.message);
  } finally {
    process.exit(0);
  }
}

clearOrders();
