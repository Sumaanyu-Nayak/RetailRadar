// Sample data seeder for RetailRadar
// Run with: npm run seed

import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/retailradar';

// Define schemas directly in the seeder
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'store_owner'], default: 'customer' }
}, { timestamps: true });

const StoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  locality: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  imageUrl: { type: String },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Store = mongoose.model('Store', StoreSchema);
const Product = mongoose.model('Product', ProductSchema);

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Store.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const hashedPassword = await bcryptjs.hash('password123', 12);
    
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@customer.com',
        password: hashedPassword,
        role: 'customer'
      },
      {
        name: 'Store Owner 1',
        email: 'owner1@store.com',
        password: hashedPassword,
        role: 'store_owner'
      },
      {
        name: 'Store Owner 2',
        email: 'owner2@store.com',
        password: hashedPassword,
        role: 'store_owner'
      }
    ]);
    console.log('Created sample users');

    // Create sample stores
    const stores = await Store.create([
      {
        name: 'Tech Galaxy',
        description: 'Your one-stop shop for all electronics and gadgets',
        address: 'Shop No. 123, Brigade Road, Bangalore - 560001',
        locality: 'Brigade Road',
        phone: '+91-9876543210',
        email: 'techgalaxy@store.com',
        owner: users[1]._id
      },
      {
        name: 'Fresh Mart Grocery',
        description: 'Fresh fruits, vegetables, and daily essentials',
        address: 'No. 45, Koramangala 4th Block, Bangalore - 560034',
        locality: 'Koramangala',
        phone: '+91-9876543211',
        email: 'freshmart@store.com',
        owner: users[1]._id
      },
      {
        name: 'Fashion Hub',
        description: 'Trendy clothing and accessories for all ages',
        address: 'Unit 67, Commercial Street, Bangalore - 560001',
        locality: 'Commercial Street',
        phone: '+91-9876543212',
        email: 'fashionhub@store.com',
        owner: users[2]._id
      },
      {
        name: 'Book Paradise',
        description: 'Books, stationery, and educational materials',
        address: 'Shop 34, Jayanagar 4th Block, Bangalore - 560011',
        locality: 'Jayanagar',
        phone: '+91-9876543213',
        email: 'bookparadise@store.com',
        owner: users[2]._id
      }
    ]);
    console.log('Created sample stores');

    // Create sample products
    const products = await Product.create([
      // Tech Galaxy products
      {
        name: 'iPhone 15',
        description: 'Latest Apple iPhone with advanced features',
        category: 'Electronics',
        price: 79999,
        stock: 10,
        store: stores[0]._id
      },
      {
        name: 'Samsung Galaxy S24',
        description: 'Flagship Android smartphone',
        category: 'Electronics',
        price: 69999,
        stock: 15,
        store: stores[0]._id
      },
      {
        name: 'MacBook Air M3',
        description: 'Lightweight laptop for professionals',
        category: 'Electronics',
        price: 114900,
        stock: 5,
        store: stores[0]._id
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Noise cancelling wireless headphones',
        category: 'Electronics',
        price: 29990,
        stock: 20,
        store: stores[0]._id
      },

      // Fresh Mart products
      {
        name: 'Organic Bananas',
        description: 'Fresh organic bananas - 1kg pack',
        category: 'Fruits',
        price: 80,
        stock: 50,
        store: stores[1]._id
      },
      {
        name: 'Basmati Rice',
        description: 'Premium quality basmati rice - 5kg',
        category: 'Groceries',
        price: 450,
        stock: 30,
        store: stores[1]._id
      },
      {
        name: 'Fresh Milk',
        description: 'Pure cow milk - 1 liter pack',
        category: 'Dairy',
        price: 60,
        stock: 100,
        store: stores[1]._id
      },
      {
        name: 'Whole Wheat Bread',
        description: 'Healthy whole wheat bread loaf',
        category: 'Bakery',
        price: 35,
        stock: 25,
        store: stores[1]._id
      },

      // Fashion Hub products
      {
        name: 'Casual T-Shirt',
        description: 'Comfortable cotton t-shirt for daily wear',
        category: 'Clothing',
        price: 599,
        stock: 40,
        store: stores[2]._id
      },
      {
        name: 'Denim Jeans',
        description: 'Stylish denim jeans - Regular fit',
        category: 'Clothing',
        price: 1299,
        stock: 25,
        store: stores[2]._id
      },
      {
        name: 'Sneakers',
        description: 'Comfortable sports sneakers',
        category: 'Footwear',
        price: 2499,
        stock: 15,
        store: stores[2]._id
      },
      {
        name: 'Leather Wallet',
        description: 'Genuine leather wallet with multiple slots',
        category: 'Accessories',
        price: 899,
        stock: 30,
        store: stores[2]._id
      },

      // Book Paradise products
      {
        name: 'Programming Book',
        description: 'Complete guide to modern JavaScript',
        category: 'Books',
        price: 699,
        stock: 20,
        store: stores[3]._id
      },
      {
        name: 'Notebook Set',
        description: 'Set of 5 ruled notebooks',
        category: 'Stationery',
        price: 150,
        stock: 50,
        store: stores[3]._id
      },
      {
        name: 'Scientific Calculator',
        description: 'Advanced scientific calculator for students',
        category: 'Electronics',
        price: 899,
        stock: 12,
        store: stores[3]._id
      },
      {
        name: 'Art Supplies Kit',
        description: 'Complete art supplies for drawing and painting',
        category: 'Art Supplies',
        price: 1299,
        stock: 8,
        store: stores[3]._id
      }
    ]);
    console.log('Created sample products');

    console.log('\n=== Sample Data Created Successfully ===');
    console.log('Users created:', users.length);
    console.log('Stores created:', stores.length);
    console.log('Products created:', products.length);
    console.log('\nLogin credentials:');
    console.log('Customer: john@customer.com / password123');
    console.log('Store Owner 1: owner1@store.com / password123');
    console.log('Store Owner 2: owner2@store.com / password123');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeder
if (typeof require !== 'undefined' && require.main === module) {
  seedData();
}

export default seedData;
